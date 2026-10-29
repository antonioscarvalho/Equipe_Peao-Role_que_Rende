"""
Compoe a cantiga da Vo Vega (cena "musica", capitulo 1 do modo historia):
o roteiro (capitulos/cap1.ts) diz "tum-tum, ta-ra, tum-tum... a luz vem devagar...".

Sintese 100% propria (nenhum sample de terceiro): tom de caixinha de musica
(harmonicos de seno com decaimento exponencial, leve vibrato) + um drone grave
bem baixinho que pulsa devagar (ecoando "as estrelas pulsam devagar" da cena,
ver cenas/CenaCap1.tsx) + eco curto pra dar corpo. So stdlib (math/array/wave).

Uso:
    python3 compor-cantiga-vo.py
    ffmpeg -y -i ../public/sons/cantiga-vo.wav -c:a libopus -b:a 48k -vbr on ../public/sons/cantiga-vo.opus
    rm ../public/sons/cantiga-vo.wav   # o .wav e so material de trabalho; o jogo serve o .opus
"""
import math
import os
import wave
from array import array

SR = 48000
DUR_TOTAL = 13.0  # segundos, com cauda do eco incluida
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

PAD_FREQ = 73.42  # D2, bem grave e discreto
PAD_AMP = 0.05
PAD_LFO_HZ = 0.12  # "as estrelas pulsam devagar"


def sininho(freq, t0, decaimento, amp, vib_hz, vib_prof, detune=0.0, atraso=0.0):
    f = freq * (1 + detune)
    buf = [0.0] * N
    ataque = 0.009
    i0 = max(0, int((t0 + atraso) * SR))
    for i in range(i0, N):
        t = i / SR - (t0 + atraso)
        if t < 0:
            continue
        env = (t / ataque) if t < ataque else math.exp(-(t - ataque) * decaimento)
        if env < 0.0005:
            break
        f_mod = f * (1 + vib_prof * math.sin(2 * math.pi * vib_hz * t))
        fase = 2 * math.pi * f_mod * t
        valor = 0.78 * math.sin(fase) + 0.26 * math.sin(2 * fase) + 0.10 * math.sin(3 * fase)
        buf[i] = amp * env * valor
    return buf


def somar(dst, src):
    for i in range(len(dst)):
        dst[i] += src[i]


def gerar_canal(detune, atraso):
    canal = [0.0] * N
    for freq, t0, dec, amp, vhz, vprof in NOTAS:
        somar(canal, sininho(freq, t0, dec, amp, vhz, vprof, detune=detune, atraso=atraso))
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
