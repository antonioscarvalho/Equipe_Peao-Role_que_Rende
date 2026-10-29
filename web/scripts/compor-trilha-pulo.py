"""
Trilha do mini jogo "Pulo do Bichinho": mesma familia sonora da trilha principal (alegre,
energetica), mas em Sol maior e com o baixo mais saltitante (passo mais rapido), pra combinar
com o ritmo de pular de plataforma em plataforma. Arranjo mais magro que a trilha principal de
proposito: o jogo já tem efeitos (tocar("pulo")/tocar("folha")) tocando por cima.

Sintese 100% propria, sem sample de terceiro. So stdlib (math/array/wave).
Loop sem costura (crossfade de potencia igual entre a cauda e o inicio).
"""
import math
import os
import wave
from array import array

SR = 48000
CICLO = 16.0
CROSSFADE = 2.5
DUR = CICLO + CROSSFADE
N = int(SR * DUR)

# Sol - Do - Re - Sol (I-IV-V-I) com 6a, 4s cada.
ACORDES = [
    ([196.00, 246.94, 293.66, 329.63], 0.0, 4.0),   # Sol6 (G B D E)
    ([130.81, 164.81, 196.00, 220.00], 4.0, 8.0),   # Do6  (C E G A)
    ([146.83, 185.00, 220.00, 246.94], 8.0, 12.0),  # Re6  (D F# A B)
    ([196.00, 246.94, 293.66, 329.63], 12.0, DUR),  # Sol6 de volta -- segue até a cauda
]

# Baixo bem saltitante: raiz-raiz-quinta-raiz a cada 0,25s (mais rapido que a trilha principal).
BAIXO = [
    (98.00, 146.83, 0.0),   # Sol2, Re3
    (65.41, 98.00, 4.0),    # Do2, Sol2
    (73.42, 110.00, 8.0),   # Re2, Sol#2... usar La2 como quinta (73.42 Re2, 110.00 La2)
    (98.00, 146.83, 12.0),  # Sol2, Re3
]
PASSO_BAIXO = 0.25

# Melodia curta e saltitante, só pra dar identidade (o jogo já tem efeitos sonoros por cima).
MELODIAS = [
    (0.6, [783.99, 987.77, 1174.66]),    # sobre Sol: G B D'
    (4.6, [523.25, 659.25, 783.99]),     # sobre Do: C E G
    (8.6, [587.33, 739.99, 880.00]),     # sobre Re: D F#' A'
    (12.6, [783.99, 987.77, 1174.66]),   # Sol de volta
]
TEMPOS_MELODIA = [0.0, 0.18, 0.36]


def env_pad(t, dur, ataque=0.12, release=0.3):
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
    i1 = min(N, int((t1 + 0.4) * SR))
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
    ataque = 0.005
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
        acrescentar_pad(canal, freqs, t0, t1, amp=0.022, detune=detune)
    for raiz, quinta, t0 in BAIXO:
        padrao = [raiz, raiz, quinta, raiz]
        for rep in range(4):
            base = t0 + rep * PASSO_BAIXO * 4
            for k, freq in enumerate(padrao):
                nota_curta(canal, freq, base + k * PASSO_BAIXO, amp=0.075, decaimento=16, harmonicos=[0.85, 0.0, 0.25], detune=detune, atraso=atraso)
    for t0, notas in MELODIAS:
        for k, freq in enumerate(notas):
            nota_curta(canal, freq, t0 + TEMPOS_MELODIA[k], amp=0.05, decaimento=9, harmonicos=[0.7, 0.22, 0.08], detune=detune, atraso=atraso)
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


def normalizar(sinal, pico_alvo=0.5):
    pico = max(abs(x) for x in sinal) or 1.0
    fator = pico_alvo / pico
    return [x * fator for x in sinal]


def main():
    esquerda = gerar_canal(detune=-0.0014, atraso=0.0)
    direita = gerar_canal(detune=0.0014, atraso=0.007)
    esquerda = normalizar(crossfade_loop(esquerda, CICLO, CROSSFADE))
    direita = normalizar(crossfade_loop(direita, CICLO, CROSSFADE))
    aqui = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(aqui, "..", "public", "sons", "trilha-pulo.wav")
    with wave.open(out_path, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        dados = array("h")
        for l, r in zip(esquerda, direita):
            dados.append(max(-32767, min(32767, int(l * 32767))))
            dados.append(max(-32767, min(32767, int(r * 32767))))
        w.writeframes(dados.tobytes())
    print(f"gerado: {out_path} ({len(esquerda) / SR:.1f}s)")


if __name__ == "__main__":
    main()
