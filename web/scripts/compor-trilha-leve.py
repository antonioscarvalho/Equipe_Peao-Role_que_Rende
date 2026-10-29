"""Trilha instrumental leve para a navegação do Guardião.

Síntese própria, sem samples: acordes macios, baixo redondo e uma melodia saltitante
em Sol maior, com pulso calmo. O ciclo usa crossfade para repetir sem estalo.

Uso:
    python compor-trilha-leve.py
    ffmpeg -y -i ../public/sons/trilha-leve.wav -c:a libopus -b:a 64k -vbr on ../public/sons/trilha-leve.opus
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

# Sol - Ré - Mi menor - Dó com nona: familiar e luminoso sem soar triunfal.
ACORDES = [
    ([196.00, 246.94, 293.66, 392.00], 0.0, 6.0),
    ([146.83, 185.00, 220.00, 293.66], 6.0, 12.0),
    ([164.81, 196.00, 246.94, 293.66], 12.0, 18.0),
    ([130.81, 164.81, 196.00, 293.66], 18.0, DUR),
]

# Baixo leve em pulso de 90 bpm: raiz, raiz, quinta, raiz.
BAIXO = [(98.00, 146.83, 0.0), (73.42, 110.00, 6.0), (82.41, 123.47, 12.0), (65.41, 98.00, 18.0)]
PASSO_BAIXO = 0.667

# Motivos curtos sobem e descem como um assobio; a segunda volta varia o repouso final.
MELODIAS = [
    (0.0, [392.00, 493.88, 587.33, 659.25, 587.33, 493.88, 440.00, 392.00]),
    (6.0, [440.00, 587.33, 739.99, 880.00, 739.99, 659.25, 587.33, 440.00]),
    (12.0, [493.88, 659.25, 783.99, 987.77, 783.99, 739.99, 659.25, 493.88]),
    (18.0, [392.00, 523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 392.00]),
]
TEMPOS = [0.25, 0.68, 1.12, 1.56, 2.08, 2.52, 2.96, 3.48]
REPETE_EM = 3.6
BRILHOS = [2.8, 8.7, 14.6, 20.5]


def envelope(t, dur, ataque=0.25, release=0.55):
    if t < 0:
        return 0.0
    if t < ataque:
        return t / ataque
    if t < dur:
        return 1.0
    if t < dur + release:
        return 1.0 - (t - dur) / release
    return 0.0


def acrescentar_pad(canal, frequencias, inicio, fim, amp, detune):
    dur = fim - inicio
    i0 = max(0, int(inicio * SR))
    i1 = min(N, int((fim + 0.7) * SR))
    for freq in frequencias:
        f = freq * (1 + detune)
        for i in range(i0, i1):
            t = i / SR - inicio
            e = envelope(t, dur)
            if e <= 0:
                continue
            fase = 2 * math.pi * f * t
            canal[i] += amp * e * (0.82 * math.sin(fase) + 0.15 * math.sin(2 * fase) + 0.03 * math.sin(3 * fase))


def nota_curta(canal, freq, inicio, amp, decaimento, harmonicos, detune=0.0, atraso=0.0):
    f = freq * (1 + detune)
    ataque = 0.008
    i0 = max(0, int((inicio + atraso) * SR))
    for i in range(i0, N):
        t = i / SR - (inicio + atraso)
        env = t / ataque if t < ataque else math.exp(-(t - ataque) * decaimento)
        if env < 0.0007:
            break
        fase = 2 * math.pi * f * t
        canal[i] += amp * env * sum(a * math.sin((k + 1) * fase) for k, a in enumerate(harmonicos))


def gerar_canal(detune, atraso):
    canal = [0.0] * N
    for frequencias, inicio, fim in ACORDES:
        acrescentar_pad(canal, frequencias, inicio, fim, amp=0.022, detune=detune)

    for raiz, quinta, inicio in BAIXO:
        padrao = [raiz, raiz, quinta, raiz]
        for repeticao in range(2):
            base = inicio + repeticao * PASSO_BAIXO * 4
            for k, freq in enumerate(padrao):
                nota_curta(canal, freq, base + k * PASSO_BAIXO, 0.052, 10,
                           [0.88, 0.0, 0.12], detune, atraso)

    for inicio, notas in MELODIAS:
        for k, freq in enumerate(notas):
            t = inicio + TEMPOS[k]
            nota_curta(canal, freq, t, 0.046, 7.5, [0.78, 0.18, 0.04], detune, atraso)
            nota_curta(canal, freq, t + REPETE_EM, 0.041, 7.5, [0.78, 0.18, 0.04], detune, atraso)

    for t in BRILHOS:
        nota_curta(canal, 1567.98, t, 0.012, 10, [0.9, 0.1], detune, atraso)
    return canal


def crossfade_loop(canal):
    n_ciclo = int(CICLO * SR)
    n_cauda = int(CROSSFADE * SR)
    saida = canal[:n_ciclo]
    for i in range(n_cauda):
        x = i / n_cauda
        entrada = math.sin(x * math.pi / 2)
        saida[i] = saida[i] * entrada + canal[n_ciclo + i] * math.cos(x * math.pi / 2)
    return saida


def normalizar(sinal, pico_alvo=0.52):
    pico = max(abs(x) for x in sinal) or 1.0
    fator = pico_alvo / pico
    return [x * fator for x in sinal]


def main():
    esquerda = normalizar(crossfade_loop(gerar_canal(-0.0012, 0.0)))
    direita = normalizar(crossfade_loop(gerar_canal(0.0012, 0.007)))
    caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sons", "trilha-leve.wav")
    with wave.open(caminho, "w") as arquivo:
        arquivo.setnchannels(2)
        arquivo.setsampwidth(2)
        arquivo.setframerate(SR)
        dados = array("h")
        for l, r in zip(esquerda, direita):
            dados.append(max(-32767, min(32767, int(l * 32767))))
            dados.append(max(-32767, min(32767, int(r * 32767))))
        arquivo.writeframes(dados.tobytes())
    print(f"gerado: {caminho} ({len(esquerda) / SR:.1f}s, loop sem estalo)")


if __name__ == "__main__":
    main()
