"""
Trilha sonora do app inteiro (nao so o modo historia): leve, alegre e energetica.
Troca a OST "estelar" anterior, que saiu melancolica/devagar demais pro feedback recebido
("achei muito depressiva"). Em Do maior, acordes com 6a (brilho, sem soar "cassino"),
baixo em staccato dando groove (bounce), melodia saltitante e cativante por cima.

Sintese 100% propria, sem sample de terceiro. So stdlib (math/array/wave).
Loop sem costura: renderiza alem do ciclo e faz crossfade de potencia igual
entre a cauda e o inicio, pra tocar com <audio loop> sem clique no ponto de loop.
"""
import math
import os
import wave
from array import array

SR = 48000
CICLO = 24.0
CROSSFADE = 3.0
DUR = CICLO + CROSSFADE
N = int(SR * DUR)

# Progressao bem "alegre": Do - Fa - Sol - Do (I-IV-V-I), acordes com 6a (brilho pop, sem ser doce
# demais). 6s cada; o ultimo precisa continuar ressoando ate DUR pra alimentar o crossfade.
ACORDES = [
    ([130.81, 164.81, 196.00, 220.00], 0.0, 6.0),    # Do6 (C E G A)
    ([174.61, 220.00, 261.63, 293.66], 6.0, 12.0),   # Fa6 (F A C D)
    ([196.00, 246.94, 293.66, 329.63], 12.0, 18.0),  # Sol6 (G B D E)
    ([130.81, 164.81, 196.00, 220.00], 18.0, DUR),   # Do6 de volta -- segue até a cauda
]

# Baixo em staccato (groove): raiz-raiz-quinta-raiz a cada 1.2s, repetido 5x por acorde de 6s.
BAIXO = [
    (65.41, 98.00, 0.0),    # Do2, Sol2 -- acorde 1
    (87.31, 130.81, 6.0),   # Fa2, Do3  -- acorde 2
    (98.00, 146.83, 12.0),  # Sol2, Re3 -- acorde 3
    (65.41, 98.00, 18.0),   # Do2, Sol2 -- acorde 4 (de volta)
]
PASSO_BAIXO = 0.3

# Melodia saltitante (cativante), um motivo por acorde, repetido 2x (começo e meio do bloco de 6s).
MELODIAS = [
    (0.0, [659.25, 783.99, 1046.50, 783.99, 880.00, 783.99, 659.25]),    # sobre Do: E G C' G A G E
    (6.0, [698.46, 880.00, 1046.50, 880.00, 1174.66, 1046.50, 880.00]),  # sobre Fa: F A C' A D' C' A
    (12.0, [783.99, 987.77, 1174.66, 987.77, 1318.51, 1174.66, 987.77]), # sobre Sol: G B D' B E' D' B
    (18.0, [659.25, 783.99, 1046.50, 783.99, 880.00, 783.99, 659.25]),  # Do de volta, mesmo motivo
]
TEMPOS_MELODIA = [0.2, 0.5, 0.8, 1.1, 1.6, 1.9, 2.2]
REPETE_MELODIA_EM = 3.4  # repete o motivo 3.4s depois, ainda dentro do bloco de 6s

# Brilhos esparsos (sheen), bem poucos -- a melodia já carrega a energia.
BRILHOS = [2.7, 8.9, 15.1, 21.3]
FREQ_BRILHO = 1760.00


def env_pad(t, dur, ataque=0.18, release=0.45):
    if t < 0:
        return 0.0
    if t < ataque:
        return t / ataque
    if t < dur:
        return 1.0
    if t < dur + release:
        return 1.0 - (t - dur) / release
    return 0.0


def acrescentar_pad(canal, freqs, t0, t1, amp, detune):
    dur = t1 - t0
    i0 = max(0, int(t0 * SR))
    i1 = min(N, int((t1 + 0.6) * SR))
    for freq in freqs:
        f = freq * (1 + detune)
        for i in range(i0, i1):
            t = i / SR - t0
            e = env_pad(t, dur)
            if e <= 0.0:
                continue
            fase = 2 * math.pi * f * t
            valor = 0.75 * math.sin(fase) + 0.2 * math.sin(2 * fase) + 0.05 * math.sin(3 * fase)
            canal[i] += amp * e * valor


def nota_curta(canal, freq, t0, amp, decaimento, harmonicos, detune=0.0, atraso=0.0):
    f = freq * (1 + detune)
    ataque = 0.006
    i0 = max(0, int((t0 + atraso) * SR))
    for i in range(i0, N):
        t = i / SR - (t0 + atraso)
        if t < 0:
            continue
        env = (t / ataque) if t < ataque else math.exp(-(t - ataque) * decaimento)
        if env < 0.0008:
            break
        fase = 2 * math.pi * f * t
        valor = sum(a * math.sin((k + 1) * fase) for k, a in enumerate(harmonicos))
        canal[i] += amp * env * valor


def gerar_canal(detune, atraso):
    canal = [0.0] * N
    for freqs, t0, t1 in ACORDES:
        acrescentar_pad(canal, freqs, t0, t1, amp=0.028, detune=detune)
    # baixo: groove raiz-raiz-quinta-raiz, timbre tipo marimba (fundamental + 3a parcial).
    for raiz, quinta, t0 in BAIXO:
        padrao = [raiz, raiz, quinta, raiz]
        for rep in range(5):
            base = t0 + rep * PASSO_BAIXO * 4
            for k, freq in enumerate(padrao):
                nota_curta(canal, freq, base + k * PASSO_BAIXO, amp=0.07, decaimento=11, harmonicos=[0.85, 0.0, 0.25], detune=detune, atraso=atraso)
    # melodia: sininho brilhante (mais harmônicos agudos que a OST anterior = mais "alegre").
    for t0, notas in MELODIAS:
        for k, freq in enumerate(notas):
            t = t0 + TEMPOS_MELODIA[k]
            nota_curta(canal, freq, t, amp=0.06, decaimento=7, harmonicos=[0.7, 0.22, 0.08], detune=detune, atraso=atraso)
            nota_curta(canal, freq, t + REPETE_MELODIA_EM, amp=0.055, decaimento=7, harmonicos=[0.7, 0.22, 0.08], detune=detune, atraso=atraso)
    for t0 in BRILHOS:
        nota_curta(canal, FREQ_BRILHO, t0, amp=0.02, decaimento=9, harmonicos=[0.8, 0.2], detune=detune, atraso=atraso)
    return canal


def crossfade_loop(canal, ciclo_s, cauda_s):
    n_ciclo = int(ciclo_s * SR)
    n_cauda = int(cauda_s * SR)
    saida = canal[:n_ciclo]
    for i in range(n_cauda):
        x = i / n_cauda
        fade_in = math.sin(x * math.pi / 2)
        fade_out = math.cos(x * math.pi / 2)
        cauda_amostra = canal[n_ciclo + i] if (n_ciclo + i) < len(canal) else 0.0
        saida[i] = saida[i] * fade_in + cauda_amostra * fade_out
    return saida


def normalizar(sinal, pico_alvo=0.55):
    pico = max(abs(x) for x in sinal) or 1.0
    fator = pico_alvo / pico
    return [x * fator for x in sinal]


def main():
    esquerda = gerar_canal(detune=-0.0014, atraso=0.0)
    direita = gerar_canal(detune=0.0014, atraso=0.008)

    esquerda = crossfade_loop(esquerda, CICLO, CROSSFADE)
    direita = crossfade_loop(direita, CICLO, CROSSFADE)

    esquerda = normalizar(esquerda)
    direita = normalizar(direita)

    aqui = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(aqui, "..", "public", "sons", "trilha-alegre.wav")
    with wave.open(out_path, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        dados = array("h")
        for l, r in zip(esquerda, direita):
            dados.append(max(-32767, min(32767, int(l * 32767))))
            dados.append(max(-32767, min(32767, int(r * 32767))))
        w.writeframes(dados.tobytes())
    print(f"gerado: {out_path} ({len(esquerda) / SR:.1f}s, loop sem costura)")


if __name__ == "__main__":
    main()
