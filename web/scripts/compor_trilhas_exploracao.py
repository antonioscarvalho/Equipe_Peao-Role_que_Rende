"""Gera as trilhas instrumentais do jogo com clima de descoberta espacial.

Composicao e sintese originais, sem samples ou melodias de terceiros. A linguagem usa
frases pentatonicas simples, acordes abertos, plucks claros e um pulso leve: curiosa e
acolhedora, com referencia ao espaco exploratorio de Minecraft, sem reproduzir sua musica.

Uso: python compor_trilhas_exploracao.py [leve|alegre|pulo|carrinho]
"""
import math
import os
import sys
import wave
from array import array


SR = 32000
BATIDAS_POR_ACORDE = 8  # dois compassos 4/4
CAUDA = 1.4
FADE_LOOP = 1.0
BATIDAS_ARPEJO = (0.0, 0.75, 1.5, 2.5, 3.25, 4.0, 4.75, 5.5, 6.25, 7.0, 7.65)
PASSOS_ARPEJO = (0, 1, 2, 3, 2, 1, 0, 2, 3, 2, 1)
BATIDAS_MELODIA = (0.25, 1.25, 2.25, 3.5, 4.25, 5.25, 6.25, 7.5)


# Cada secao: notas do acorde, baixo (raiz/quinta), arpejo e pequena resposta melodica.
# Os registros ficam centrados e brilhantes, sem subgraves ou agudos estridentes.
TRILHAS = {
    "leve": {
        "arquivo": "trilha-leve",
        "bpm": 100,
        "secoes": [
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 81], [79, 83, 86, 88, 86, 83, 81, 79]),
            ([48, 55, 60, 62, 64], (36, 43), [60, 64, 67, 74], [84, 86, 88, 91, 88, 86, 83, 84]),
            ([50, 57, 62, 64, 66], (38, 45), [62, 66, 69, 76], [86, 88, 90, 93, 90, 88, 86, 83]),
            ([55, 62, 67, 71, 76], (43, 50), [67, 71, 76, 79], [79, 83, 88, 86, 83, 81, 83, 79]),
        ],
    },
    "alegre": {
        "arquivo": "trilha-alegre",
        "bpm": 108,
        "secoes": [
            ([48, 55, 60, 64, 67], (36, 43), [60, 64, 67, 74], [76, 79, 84, 86, 84, 79, 81, 76]),
            ([53, 60, 65, 67, 69], (41, 48), [65, 69, 72, 77], [77, 81, 84, 86, 84, 81, 79, 77]),
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 79], [79, 83, 86, 88, 86, 83, 81, 79]),
            ([48, 55, 60, 64, 69], (36, 43), [60, 64, 69, 76], [76, 79, 84, 88, 86, 84, 81, 76]),
        ],
    },
    "pulo": {
        "arquivo": "trilha-pulo",
        "bpm": 116,
        "secoes": [
            ([52, 59, 64, 66, 68], (40, 47), [64, 68, 71, 78], [76, 80, 83, 88, 83, 80, 78, 76]),
            ([45, 52, 57, 59, 61], (33, 40), [69, 73, 76, 81], [81, 85, 88, 90, 88, 85, 83, 81]),
            ([47, 54, 59, 61, 63], (35, 42), [71, 75, 78, 83], [83, 87, 90, 92, 90, 87, 85, 83]),
            ([52, 59, 64, 66, 68], (40, 47), [64, 68, 71, 78], [76, 80, 83, 88, 86, 83, 80, 76]),
        ],
    },
    "carrinho": {
        "arquivo": "trilha-carrinho",
        "bpm": 106,
        "secoes": [
            ([50, 57, 62, 64, 66], (38, 45), [62, 66, 69, 76], [74, 78, 81, 86, 83, 81, 78, 76]),
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 79], [79, 81, 86, 88, 86, 83, 81, 79]),
            ([57, 64, 69, 71, 73], (45, 52), [69, 73, 76, 81], [81, 85, 88, 90, 88, 85, 83, 81]),
            ([50, 57, 62, 66, 69], (38, 45), [62, 66, 69, 74], [74, 78, 81, 86, 83, 81, 78, 74]),
        ],
    },
}


def hz(nota_midi):
    return 440.0 * (2.0 ** ((nota_midi - 69) / 12.0))


def envelope_pad(t, duracao):
    ataque = 0.65
    release = 0.7
    if t < 0:
        return 0.0
    if t < ataque:
        return t / ataque
    if t < duracao:
        return 1.0
    if t < duracao + release:
        return 1.0 - (t - duracao) / release
    return 0.0


def acrescentar_pad(canal, notas, inicio, fim, detune):
    duracao = fim - inicio
    i0 = max(0, int(inicio * SR))
    i1 = min(len(canal), int((fim + 0.75) * SR))
    frequencias = [hz(nota) * (1.0 + detune) for nota in notas]
    for i in range(i0, i1):
        t = i / SR - inicio
        env = envelope_pad(t, duracao)
        if env <= 0:
            continue
        fase = 2.0 * math.pi * t
        valor = sum(math.sin(f * fase) * peso for f, peso in zip(frequencias, (0.47, 0.23, 0.16, 0.09, 0.05)))
        canal[i] += 0.026 * env * valor


def acrescentar_pluck(canal, nota, inicio, volume, decaimento, detune, atraso=0.0):
    t0 = inicio + atraso
    freq = hz(nota) * (1.0 + detune)
    limite = min(len(canal), int((t0 + min(2.2, 7.8 / decaimento)) * SR))
    i0 = max(0, int(t0 * SR))
    for i in range(i0, limite):
        t = i / SR - t0
        env = min(1.0, t / 0.006) * math.exp(-decaimento * t)
        if env < 0.0006:
            break
        fase = 2.0 * math.pi * freq * t
        onda = (0.68 * math.sin(fase) + 0.23 * math.sin(2.0 * fase)
                + 0.07 * math.sin(3.0 * fase) + 0.02 * math.sin(4.0 * fase))
        canal[i] += volume * env * onda


def crossfade_loop(canal, ciclo, fade):
    amostras_ciclo = int(ciclo * SR)
    amostras_fade = int(fade * SR)
    saida = canal[:amostras_ciclo]
    for i in range(amostras_fade):
        x = i / amostras_fade
        saida[i] = (saida[i] * math.sin(x * math.pi / 2.0)
                    + canal[amostras_ciclo + i] * math.cos(x * math.pi / 2.0))
    return saida


def gerar_canal(config, detune, atraso):
    segundos_batida = 60.0 / config["bpm"]
    duracao_secao = BATIDAS_POR_ACORDE * segundos_batida
    ciclo = len(config["secoes"]) * duracao_secao
    total = int((ciclo + CAUDA) * SR)
    canal = [0.0] * total

    for indice, (acorde, baixo, arpejo, melodia) in enumerate(config["secoes"]):
        inicio = indice * duracao_secao
        acrescentar_pad(canal, acorde, inicio, inicio + duracao_secao, detune)

        # Baixo redondo em dois pulsos por compasso, com pequena pausa para a melodia respirar.
        for batida in (0, 2, 4, 6):
            nota_baixo = baixo[0] if batida in (0, 4) else baixo[1]
            acrescentar_pluck(canal, nota_baixo, inicio + batida * segundos_batida,
                              0.058, 6.0, detune, atraso)

        # Arpejo ascendente/descendente e motivo de oito notas, como pergunta e resposta.
        for batida, passo in zip(BATIDAS_ARPEJO, PASSOS_ARPEJO):
            acrescentar_pluck(canal, arpejo[passo], inicio + batida * segundos_batida,
                              0.030, 6.8, detune, atraso)
        for batida, nota in zip(BATIDAS_MELODIA, melodia):
            acrescentar_pluck(canal, nota, inicio + batida * segundos_batida,
                              0.047, 4.2, detune, atraso)

    return crossfade_loop(canal, ciclo, FADE_LOOP)


def renderizar(nome):
    config = TRILHAS[nome]
    esquerda = gerar_canal(config, -0.0007, 0.0)
    direita = gerar_canal(config, 0.0007, 0.004)
    pico = max(max(abs(amostra) for amostra in esquerda), max(abs(amostra) for amostra in direita)) or 1.0
    escala = 0.74 / pico
    pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sons")
    caminho = os.path.join(pasta, config["arquivo"] + ".wav")

    dados = array("h")
    for l, r in zip(esquerda, direita):
        dados.append(max(-32767, min(32767, int(l * escala * 32767))))
        dados.append(max(-32767, min(32767, int(r * escala * 32767))))
    with wave.open(caminho, "wb") as arquivo:
        arquivo.setnchannels(2)
        arquivo.setsampwidth(2)
        arquivo.setframerate(SR)
        arquivo.writeframes(dados.tobytes())
    print(f"gerado: {caminho} ({len(esquerda) / SR:.1f}s, {config['bpm']} bpm)")


def main():
    nomes = sys.argv[1:] or list(TRILHAS)
    for nome in nomes:
        if nome not in TRILHAS:
            raise SystemExit(f"trilha desconhecida: {nome}; escolha entre {', '.join(TRILHAS)}")
        renderizar(nome)


if __name__ == "__main__":
    main()
