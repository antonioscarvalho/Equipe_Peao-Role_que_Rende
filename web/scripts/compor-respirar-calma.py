"""
Som de fundo pro "Deu vontade" (respiração guiada 4-4-6, Respiracao.tsx): um drone bem grave e
suave cujo volume segue o próprio ritmo da respiração -- sobe devagar nos 4s de inspirar, fica
estável nos 4s de segurar (com um brilho bem de leve por cima), e desce devagar nos 6s de soltar.
O ciclo inteiro (14s) é exatamente a duração de um ciclo de respiração, então o loop é natural:
comeca e termina em silencio, sem precisar de crossfade.

Desligado por padrao (spec 003 CA-3) -- só toca se a pessoa ligar "som da respiração".
Sintese 100% propria, sem sample de terceiro. So stdlib (math/array/wave).
"""
import math
import os
import wave
from array import array

SR = 48000
CICLO = 14.0  # 4 (inspira) + 4 (segura) + 6 (expira), igual ao ritmo guiado
N = int(SR * CICLO)

FREQS_DRONE = [73.42, 110.00, 146.83]  # Re2, La2, Re3 -- bem grave, só fundo
FREQ_BRILHO = 587.33  # Re5, aparece suave só durante o "segura"


def envelope_respiracao(t):
    if t < 4.0:
        return math.sin(math.pi / 2 * (t / 4.0))          # inspira: sobe
    if t < 8.0:
        return 1.0                                          # segura: estável
    if t < 14.0:
        return math.cos(math.pi / 2 * ((t - 8.0) / 6.0))    # expira: desce
    return 0.0


def gerar_canal(detune):
    canal = [0.0] * N
    for i in range(N):
        t = i / SR
        env = envelope_respiracao(t)
        valor = 0.0
        for f in FREQS_DRONE:
            ff = f * (1 + detune)
            valor += math.sin(2 * math.pi * ff * t) * 0.33
        if 4.0 <= t < 8.0:
            es = math.sin(math.pi * (t - 4.0) / 4.0)  # brilho sobe e desce dentro do platô
            valor += math.sin(2 * math.pi * FREQ_BRILHO * (1 + detune) * t) * 0.12 * es
        canal[i] = valor * env
    return canal


def normalizar(sinal, pico_alvo=0.32):
    pico = max(abs(x) for x in sinal) or 1.0
    fator = pico_alvo / pico
    return [x * fator for x in sinal]


def main():
    esquerda = normalizar(gerar_canal(detune=-0.0015))
    direita = normalizar(gerar_canal(detune=0.0015))
    aqui = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(aqui, "..", "public", "sons", "respirar-calma.wav")
    with wave.open(out_path, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        dados = array("h")
        for l, r in zip(esquerda, direita):
            dados.append(max(-32767, min(32767, int(l * 32767))))
            dados.append(max(-32767, min(32767, int(r * 32767))))
        w.writeframes(dados.tobytes())
    print(f"gerado: {out_path} ({len(esquerda) / SR:.1f}s, loop natural)")


if __name__ == "__main__":
    main()
