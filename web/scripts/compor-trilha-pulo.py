"""
Trilha do mini jogo "Pulo do Bichinho" -- refeita do zero depois do feedback de que soava
"estranha" e parecida demais com o tema do app. Agora com identidade propria de "musiquinha
de plataforma": melodia curta e cantarolavel em arpejo (tipo classico de jogo de pular), baixo
simples e espacado (so raiz, 2 toques por acorde -- nao mais aquela "metralhadora" de 4 notas
por segundo que soava glitch), em Mi maior (mais afastado do Do maior do tema do app e do Re
maior do carrinho, pra nao parecer primo demais deles).

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

# Mi - La - Si - Mi (I-IV-V-I), triades simples (sem 6a desta vez -- som mais limpo/cheio de ar).
ACORDES = [
    ([164.81, 207.65, 246.94], 0.0, 4.0),    # Mi (E G# B)
    ([110.00, 138.59, 164.81], 4.0, 8.0),    # La, uma oitava abaixo (A C# E)
    ([123.47, 155.56, 185.00], 8.0, 12.0),   # Si (B D# F#)
    ([164.81, 207.65, 246.94], 12.0, DUR),   # Mi de volta -- segue até a cauda
]

# Baixo: só a raiz, 2 toques por acorde (no 1º e 3º tempo) -- discreto, dá espaço pra melodia.
BAIXO = [(82.41, 0.0), (82.41, 2.0), (55.00, 4.0), (55.00, 6.0), (61.74, 8.0), (61.74, 10.0), (82.41, 12.0), (82.41, 14.0)]

# Melodia continua, tipo "musiquinha de plataforma": um arpejo de 4 notas subindo e descendo
# por secao, igual em todas (só muda a tonalidade) -- fácil de reconhecer, nada aleatório.
SECOES = [
    (0.0, [659.25, 830.61, 987.77, 1318.51, 987.77, 830.61, 659.25]),      # Mi5 Sol#5 Si5 Mi6 Si5 Sol#5 Mi5
    (4.0, [880.00, 1108.73, 1318.51, 1760.00, 1318.51, 1108.73, 880.00]),  # La5 Do#6 Mi6 La6 Mi6 Do#6 La5
    (8.0, [987.77, 1244.51, 1479.98, 1975.53, 1479.98, 1244.51, 987.77]), # Si5 Re#6 Fa#6 Si6 Fa#6 Re#6 Si5
    (12.0, [659.25, 830.61, 987.77, 1318.51, 987.77, 830.61, 659.25]),
]
TEMPOS_SECAO = [0.0, 0.25, 0.5, 0.75, 1.5, 1.75, 2.0]

# Brilhos esparsos no "ar" entre as frases (3º/4º tempo de cada secao), bem de leve.
BRILHOS = [3.0, 7.0, 11.0, 15.0]
FREQ_BRILHO = [1975.53, 2217.46, 2489.02, 1975.53]


def env_pad(t, dur, ataque=0.15, release=0.4):
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
    i1 = min(N, int((t1 + 0.5) * SR))
    for freq in freqs:
        f = freq * (1 + detune)
        for i in range(i0, i1):
            t = i / SR - t0
            e = env_pad(t, dur)
            if e <= 0.0:
                continue
            fase = 2 * math.pi * f * t
            valor = 0.78 * math.sin(fase) + 0.17 * math.sin(2 * fase) + 0.05 * math.sin(3 * fase)
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
        acrescentar_pad(canal, freqs, t0, t1, amp=0.020, detune=detune)
    # baixo: so a raiz, decaimento mais lento (mais "corpo", menos clique seco).
    for freq, t0 in BAIXO:
        nota_curta(canal, freq, t0, amp=0.065, decaimento=7, harmonicos=[0.85, 0.0, 0.2], detune=detune, atraso=atraso)
    # melodia: continua, brilhante o suficiente pra carregar a musiquinha sozinha.
    for t0, notas in SECOES:
        for k, freq in enumerate(notas):
            nota_curta(canal, freq, t0 + TEMPOS_SECAO[k], amp=0.058, decaimento=5.5, harmonicos=[0.72, 0.2, 0.08], detune=detune, atraso=atraso)
    for k, t0 in enumerate(BRILHOS):
        nota_curta(canal, FREQ_BRILHO[k], t0, amp=0.02, decaimento=8, harmonicos=[0.8, 0.2], detune=detune, atraso=atraso)
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
    esquerda = gerar_canal(detune=-0.0013, atraso=0.0)
    direita = gerar_canal(detune=0.0013, atraso=0.006)
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
