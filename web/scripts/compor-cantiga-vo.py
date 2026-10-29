"""
Compoe a cantiga da Vo Vega (cena "musica", capitulo 1 do modo historia):
o roteiro (capitulos/cap1.ts) diz "a luz vem devagar...".

Versao "bem fofa": o timbre de caixinha de musica ficou mais redondo (menos
harmonico, ataque mais suave), ganhou um arrulho grave por baixo da melodia
(como alguem cantarolando de boca fechada junto, "mmm") e uma chuvinha de
sininhos esparsos entre as frases (brilho de pingente de berco, nao e efeito
de jogo). O drone grave que pulsa devagar (ecoando "as estrelas pulsam
devagar", ver cenas/CenaCap1.tsx) e o eco continuam dando corpo e aconchego.
Sintese 100% propria (nenhum sample de terceiro), so stdlib (math/array/wave).

Uso:
    python3 compor-cantiga-vo.py
    ffmpeg -y -i ../public/sons/cantiga-vo.wav -c:a libopus -b:a 64k -vbr on ../public/sons/cantiga-vo.opus
    rm ../public/sons/cantiga-vo.wav   # o .wav e so material de trabalho; o jogo serve o .opus
"""
import math
import os
import wave
from array import array

SR = 48000
DUR_TOTAL = 15.0  # segundos, com final sustentado e cauda do eco
N = int(SR * DUR_TOTAL)

# (frequencia, inicio_s, taxa_de_decaimento, amplitude, vibrato_hz, vibrato_prof)
# taxa de decaimento menor = nota dura/ressoa mais (usado na ultima, "...gar", pra "devagar").
NOTAS = [
    (293.66, 0.00, 1.7, 0.16, 5.0, 0.004),   # tum
    (293.66, 0.80, 1.7, 0.16, 5.0, 0.004),   # tum
    (440.00, 1.65, 2.6, 0.14, 5.5, 0.005),   # ta
    (369.99, 2.10, 1.7, 0.15, 5.0, 0.004),   # ra
    (293.66, 3.00, 1.7, 0.16, 5.0, 0.004),   # tum
    (293.66, 3.80, 1.7, 0.16, 5.0, 0.004),   # tum
    (587.33, 5.00, 2.2, 0.11, 5.5, 0.005),   # a
    (659.25, 5.40, 2.0, 0.12, 5.5, 0.005),   # luz
    (739.99, 5.85, 1.6, 0.13, 5.0, 0.004),   # vem
    (880.00, 6.60, 2.0, 0.12, 6.0, 0.005),   # de
    (739.99, 7.05, 1.4, 0.13, 5.0, 0.004),   # va
    (587.33, 7.80, 0.55, 0.14, 4.5, 0.004),  # gar -- decai bem devagar
]

# Acompanhamento em arpejo, baixo e macio: dá chão à melodia sem competir com ela.
# A harmonia passeia por Ré, Lá e Sol, como uma cantiga simples que a família saberia cantar junto.
ACOMPANHAMENTO = [
    (146.83, 0.00, 3.8, 0.045, 3.8, 0.002),  # Ré
    (220.00, 0.82, 4.2, 0.032, 4.0, 0.002),  # Lá
    (185.00, 1.65, 3.8, 0.036, 3.8, 0.002),  # Fá sustenido
    (220.00, 2.45, 4.2, 0.030, 4.0, 0.002),  # Lá
    (146.83, 3.00, 3.8, 0.043, 3.8, 0.002),  # Ré
    (220.00, 3.80, 4.2, 0.030, 4.0, 0.002),  # Lá
    (196.00, 5.00, 3.8, 0.038, 3.8, 0.002),  # Sol
    (246.94, 5.85, 4.0, 0.030, 4.0, 0.002),  # Si
    (146.83, 6.60, 3.8, 0.038, 3.8, 0.002),  # Ré
    (220.00, 7.05, 4.2, 0.028, 4.0, 0.002),  # Lá
    (146.83, 7.80, 0.65, 0.040, 3.8, 0.002), # Ré final
]

PAD_FREQ = 73.42  # D2, bem grave e discreto
PAD_AMP = 0.05
PAD_LFO_HZ = 0.12  # "as estrelas pulsam devagar"


def sininho(freq, t0, decaimento, amp, vib_hz, vib_prof, detune=0.0, atraso=0.0):
    f = freq * (1 + detune)
    buf = [0.0] * N
    ataque = 0.015  # mais suave que um sino "de verdade": fica mais fofo, menos metalico
    i0 = max(0, int((t0 + atraso) * SR))
    for i in range(i0, N):
        t = i / SR - (t0 + atraso)
        if t < 0:
            continue
        env = (0.5 - 0.5 * math.cos(math.pi * min(1.0, t / ataque))) if t < ataque else math.exp(-(t - ataque) * decaimento)
        if env < 0.0005:
            break
        f_mod = f * (1 + vib_prof * math.sin(2 * math.pi * vib_hz * t))
        fase = 2 * math.pi * f_mod * t
        valor = 0.88 * math.sin(fase) + 0.10 * math.sin(2 * fase) + 0.02 * math.sin(3 * fase)
        buf[i] = amp * env * valor
    return buf


def arrulho(freq, t0, dur, amp, atraso=0.0):
    """Um 'mmm' cantarolado de boca fechada, bem baixinho, uma oitava abaixo da
    melodia: e a Vo acompanhando por baixo, o que da o aconchego de verdade."""
    buf = [0.0] * N
    ataque = 0.12
    solte = 0.22
    i0 = max(0, int((t0 + atraso) * SR))
    i1 = min(N, int((t0 + atraso + dur + solte) * SR))
    for i in range(i0, i1):
        t = i / SR - (t0 + atraso)
        if t < 0:
            continue
        if t < ataque:
            env = 0.5 - 0.5 * math.cos(math.pi * t / ataque)
        elif t < dur:
            env = 1.0
        else:
            env = max(0.0, 1.0 - (t - dur) / solte)
        fase = 2 * math.pi * freq * t
        # Par de formantes bem suaves pra lembrar "mmm" fechado, sem ficar nasal.
        valor = 0.70 * math.sin(fase) + 0.18 * math.sin(2.02 * fase) + 0.06 * math.sin(3.0 * fase)
        buf[i] = amp * env * valor
    return buf


def sininho_pingente(freq, t0, amp, atraso=0.0):
    """Sininho esparso com parciais inarmonicos (brilho de pingente de berco),
    pra salpicar entre as frases sem virar efeito de jogo."""
    buf = [0.0] * N
    decaimento = 2.6
    i0 = max(0, int((t0 + atraso) * SR))
    i1 = min(N, int((t0 + atraso + 2.2) * SR))
    for i in range(i0, i1):
        t = i / SR - (t0 + atraso)
        if t < 0:
            continue
        env = math.exp(-decaimento * t)
        fase = 2 * math.pi * freq * t
        valor = 0.6 * math.sin(fase) + 0.22 * math.sin(2.76 * fase) + 0.12 * math.sin(5.4 * fase)
        buf[i] = amp * env * valor
    return buf


def somar(dst, src):
    for i in range(len(dst)):
        dst[i] += src[i]


def gerar_canal(detune, atraso):
    canal = [0.0] * N
    for freq, t0, dec, amp, vhz, vprof in NOTAS:
        somar(canal, sininho(freq, t0, dec, amp, vhz, vprof, detune=detune, atraso=atraso))
    for freq, t0, dec, amp, vhz, vprof in ACOMPANHAMENTO:
        somar(canal, sininho(freq, t0, dec, amp, vhz, vprof, detune=detune * 0.6, atraso=atraso))
    # Arrulho de "mmm" uma oitava abaixo, só no trecho "a luz vem devagar" (índices 6–11
    # de NOTAS): é a frase em que, no roteiro, a Nina sempre entra cantando junto.
    for freq, t0, dec, amp, vhz, vprof in NOTAS[6:]:
        dur = max(0.5, 1.6 / dec)
        somar(canal, arrulho(freq / 2.0, t0, dur, amp * 0.55, atraso=atraso))
    # Sininhos esparsos (pingente de berço), salpicados entre as frases.
    for freq, t0, amp in ((1174.66, 4.55, 0.045), (1318.51, 6.30, 0.04), (987.77, 9.60, 0.05)):
        somar(canal, sininho_pingente(freq, t0, amp, atraso=atraso))
    # Drone grave, com leve atraso de entrada (as estrelas pulsam, devagar).
    for i in range(N):
        t = i / SR
        fade_in = min(1.0, t / 1.2)
        lfo = 0.5 + 0.5 * math.sin(2 * math.pi * PAD_LFO_HZ * t - math.pi / 2)
        canal[i] += PAD_AMP * fade_in * lfo * math.sin(2 * math.pi * PAD_FREQ * (1 + detune * 0.3) * t)
    return canal


def eco(sinal, atraso_s, ganho, repeticoes):
    atraso = int(atraso_s * SR)
    out = list(sinal)
    atual_ganho = ganho
    deslocado = sinal
    for _ in range(repeticoes):
        novo = [0.0] * N
        for i in range(N):
            j = i - atraso
            if j >= 0:
                novo[i] = deslocado[j] * atual_ganho
        # suaviza o eco (passa-baixa simples de um polo) pra ficar mais "quente".
        suavizado = [0.0] * N
        acumulado = 0.0
        alpha = 0.35
        for i in range(N):
            acumulado += alpha * (novo[i] - acumulado)
            suavizado[i] = acumulado
        for i in range(N):
            out[i] += suavizado[i]
        deslocado = suavizado
        atual_ganho *= 0.55
    return out


def normalizar(sinal, pico_alvo=0.55):
    pico = max(abs(x) for x in sinal) or 1.0
    fator = pico_alvo / pico
    return [x * fator for x in sinal]


def main():
    esquerda = gerar_canal(detune=-0.0015, atraso=0.0)
    direita = gerar_canal(detune=0.0015, atraso=0.006)

    esquerda = eco(esquerda, 0.17, 0.30, 3)
    direita = eco(direita, 0.19, 0.30, 3)

    esquerda = normalizar(esquerda)
    direita = normalizar(direita)

    aqui = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(aqui, "..", "public", "sons", "cantiga-vo.wav")
    with wave.open(out_path, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        dados = array("h")
        for l, r in zip(esquerda, direita):
            dados.append(max(-32767, min(32767, int(l * 32767))))
            dados.append(max(-32767, min(32767, int(r * 32767))))
        w.writeframes(dados.tobytes())
    print(f"gerado: {out_path} -- agora rode o ffmpeg (ver docstring) e apague o .wav")


if __name__ == "__main__":
    main()
