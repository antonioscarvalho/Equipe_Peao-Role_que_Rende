"""
Trilha do mini jogo "Role de Carrinho": mesma familia sonora das outras trilhas (leve, alegre),
em Re maior, com o baixo em colcheias continuas e mais legato (rolando, sem pausa) pra combinar
com o movimento de dirigir -- diferente do baixo saltitante do Pulo do Bichinho.

Sintese 100% propria, sem sample de terceiro. So stdlib (math/array/wave).
Loop sem costura (crossfade de potencia igual entre a cauda e o inicio).
"""
import math
import os
import wave
from array import array

SR = 48000
CICLO = 20.0
CROSSFADE = 2.5
DUR = CICLO + CROSSFADE
N = int(SR * DUR)

# Re - Sol - La - Re (I-IV-V-I) com 6a, 5s cada.
ACORDES = [
    ([146.83, 185.00, 220.00, 246.94], 0.0, 5.0),    # Re6 (D F# A B)
    ([196.00, 246.94, 293.66, 329.63], 5.0, 10.0),   # Sol6 (G B D E)
    ([220.00, 277.18, 329.63, 369.99], 10.0, 15.0),  # La6 (A C# E F#)
    ([146.83, 185.00, 220.00, 246.94], 15.0, DUR),   # Re6 de volta -- segue até a cauda
]

# Baixo rolando: colcheias continuas raiz-quinta-raiz-quinta, sem respiro (sensacao de andamento).
BAIXO = [
    (73.42, 110.00, 0.0),    # Re2, La2
    (98.00, 146.83, 5.0),    # Sol2, Re3
    (110.00, 164.81, 10.0),  # La2, Mi3
    (73.42, 110.00, 15.0),   # Re2, La2
]
PASSO_BAIXO = 0.25

# Melodia mais sustentada (cruzeiro, não saltos): duas notas longas por acorde.
MELODIAS = [
    (0.8, [587.33, 739.99], [1.6, 2.0]),    # sobre Re: D' F#'
    (5.8, [659.25, 783.99], [1.6, 2.0]),    # sobre Sol: E' G'
    (10.8, [739.99, 880.00], [1.6, 2.0]),   # sobre La: F#' A'
    (15.8, [587.33, 739.99], [1.6, 2.0]),   # Re de volta
]


def env_pad(t, dur, ataque=0.15, release=0.35):
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


def nota(canal, freq, t0, dur, amp, decaimento, harmonicos, detune=0.0, atraso=0.0):
    f = freq * (1 + detune)
    ataque = 0.01
    i0 = max(0, int((t0 + atraso) * SR))
    i1 = min(N, int((t0 + atraso + dur + 1.2) * SR))
    for i in range(i0, i1):
        t = i / SR - (t0 + atraso)
        if t < 0:
            continue
        env = (t / ataque) if t < ataque else max(0.0, 1.0 - (t - ataque) / dur) if t < dur else math.exp(-(t - dur) * decaimento)
        if env < 0.0008:
            continue
        fase = 2 * math.pi * f * t
        valor = sum(a * math.sin((k + 1) * fase) for k, a in enumerate(harmonicos))
        canal[i] += amp * env * valor


def gerar_canal(detune, atraso):
    canal = [0.0] * N
    for freqs, t0, t1 in ACORDES:
        acrescentar_pad(canal, freqs, t0, t1, amp=0.024, detune=detune)
    for raiz, quinta, t0 in BAIXO:
        padrao = [raiz, quinta, raiz, quinta]
        for rep in range(5):
            base = t0 + rep * PASSO_BAIXO * 4
            for k, freq in enumerate(padrao):
                nota(canal, freq, base + k * PASSO_BAIXO, PASSO_BAIXO * 0.95, amp=0.06, decaimento=14, harmonicos=[0.85, 0.0, 0.2], detune=detune, atraso=atraso)
    for t0, notas_lista, duracoes in MELODIAS:
        t = t0
        for freq, dur in zip(notas_lista, duracoes):
            nota(canal, freq, t, dur, amp=0.042, decaimento=3, harmonicos=[0.7, 0.2, 0.08], detune=detune, atraso=atraso)
            t += dur
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
    out_path = os.path.join(aqui, "..", "public", "sons", "trilha-carrinho.wav")
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
