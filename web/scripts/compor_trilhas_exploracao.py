"""Gera as trilhas principais do app com um motor cinematografico proprio.

A referencia principal e um colchao de pad sustentado, com varias vozes do acorde
(o "organo" que sobe embaixo da melodia nos temas tipo Interstellar), por cima de
uma percussao leve (bumbo, caixa, chocalho) que da o chao ritmico. A melodia
principal usa um timbre mais "corda/metal" com entrada e corpo suaves, em vez do
antigo bico de ocarina; um sino esparso da o brilho. O pad tem afinacao parada
(sem vibrato) e entrada/saida curtas (so pra tirar o clique da troca de acorde,
sem inchar e esvaziar de forma perceptivel): depois do feedback de que ainda
sobrava "um som de vai e vem" mesmo apos tirar o pulso motorik em colcheias (que
existiu numa versao anterior, tipo trilha de Formula 1, e foi removido), o
vibrato e o balanco de volume por secao foram os dois suspeitos cortados.
Cada trilha tem um "perfil" (pad/bateria/melodia/sino) que decide o quanto pesa cada
camada: `leve` fica mais pad/atmosferica, `carrinho` fica mais bateria.

Uso: python compor_trilhas_exploracao.py [leve|alegre|pulo|carrinho]
"""
import math
import os
import random
import sys
import wave
from array import array


SR = 32000
BATIDAS_POR_ACORDE = 8  # dois compassos 4/4
CAUDA = 1.6
FADE_LOOP = 1.0
BATIDAS_BUMBO = (0.0, 1.5, 3.0, 4.0, 5.5, 7.0)
BATIDAS_CAIXA = (1.0, 3.0, 5.0, 7.0)
BATIDAS_CHOCALHO = (0.5, 1.5, 1.75, 2.5, 3.5, 3.75, 4.5, 5.5, 5.75, 6.5, 7.5, 7.75)
MELODIAS_SECOES = (
    ((0.0, 0, 1.3), (1.5, 7, 0.7), (2.5, 9, 1.4),
     (4.5, 12, 1.6), (6.25, 7, 1.5)),
    ((0.0, 4, 1.1), (1.5, 9, 1.4), (3.5, 12, 1.1),
     (5.0, 9, 0.9), (6.25, 7, 1.5)),
    ((0.0, 0, 0.9), (1.0, 4, 0.9), (2.25, 9, 1.6),
     (4.5, 14, 1.6), (6.5, 12, 1.3)),
    ((0.0, 0, 1.3), (1.5, 7, 0.7), (2.5, 9, 1.4),
     (4.5, 12, 1.1), (6.0, 7, 0.4), (6.75, 0, 1.0)),
)

# Peso de cada camada por trilha: quanto mais "pad", mais colchao sustentado/Interstellar.
PERFIS = {
    "leve":     dict(pad=1.30, bateria=0.70, melodia=1.00, sino=1.15),
    "alegre":   dict(pad=1.00, bateria=1.00, melodia=1.05, sino=1.00),
    "pulo":     dict(pad=0.95, bateria=1.00, melodia=1.00, sino=0.85),
    "carrinho": dict(pad=0.85, bateria=1.15, melodia=0.95, sino=0.75),
}


# Cada secao define o acorde (voicing espalhado), o baixo e o ostinato. A melodia tem
# frase, resposta, subida para o climax e retorno do tema com resolucao.
TRILHAS = {
    "leve": {
        "arquivo": "trilha-leve",
        "bpm": 92,
        "perfil": "leve",
        "secoes": [
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 81]),
            ([50, 57, 62, 64, 66], (38, 45), [62, 66, 69, 76]),
            ([48, 55, 60, 62, 64], (36, 43), [60, 64, 67, 74]),
            ([55, 62, 67, 71, 76], (43, 50), [67, 71, 76, 79]),
        ],
    },
    "alegre": {
        "arquivo": "trilha-alegre",
        "bpm": 112,
        "perfil": "alegre",
        "secoes": [
            ([48, 55, 60, 64, 67], (36, 43), [60, 64, 67, 74]),
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 79]),
            ([53, 60, 65, 67, 69], (41, 48), [65, 69, 72, 77]),
            ([48, 55, 60, 64, 69], (36, 43), [60, 64, 69, 76]),
        ],
    },
    "pulo": {
        "arquivo": "trilha-pulo",
        "bpm": 116,
        "perfil": "pulo",
        "secoes": [
            ([52, 59, 64, 66, 68], (40, 47), [64, 68, 71, 78]),
            ([47, 54, 59, 61, 63], (35, 42), [71, 75, 78, 83]),
            ([45, 52, 57, 59, 61], (33, 40), [69, 73, 76, 81]),
            ([52, 59, 64, 66, 68], (40, 47), [64, 68, 71, 78]),
        ],
    },
    "carrinho": {
        "arquivo": "trilha-carrinho",
        "bpm": 120,
        "perfil": "carrinho",
        "secoes": [
            ([50, 57, 62, 64, 66], (38, 45), [62, 66, 69, 76]),
            ([57, 64, 69, 71, 73], (45, 52), [69, 73, 76, 81]),
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 79]),
            ([50, 57, 62, 66, 69], (38, 45), [62, 66, 69, 74]),
        ],
    },
}


def hz(nota_midi):
    return 440.0 * (2.0 ** ((nota_midi - 69) / 12.0))


def acrescentar_baque(canal, inicio, volume, detune, atraso=0.0):
    t0 = inicio + atraso
    i0 = max(0, int(t0 * SR))
    i1 = min(len(canal), int((t0 + 0.4) * SR))
    for i in range(i0, i1):
        t = i / SR - t0
        freq = (70.0 - 28.0 * min(1.0, t / 0.32)) * (1.0 + detune)
        fase = 2.0 * math.pi * freq * t
        env = math.exp(-11.5 * t)
        corpo = 0.86 * math.sin(fase) + 0.14 * math.sin(2.0 * fase)
        estalo = math.exp(-70.0 * t) * 0.22 * math.sin(2.0 * math.pi * 210.0 * t)
        canal[i] += volume * env * corpo + volume * estalo


def acrescentar_tom(canal, inicio, volume, detune, atraso=0.0):
    t0 = inicio + atraso
    i0 = max(0, int(t0 * SR))
    i1 = min(len(canal), int((t0 + 0.24) * SR))
    for i in range(i0, i1):
        t = i / SR - t0
        freq = (156.0 - 45.0 * min(1.0, t / 0.16)) * (1.0 + detune)
        fase = 2.0 * math.pi * freq * t
        env = math.exp(-17.0 * t)
        canal[i] += volume * env * (0.82 * math.sin(fase) + 0.18 * math.sin(1.7 * fase))


def acrescentar_caixa(canal, inicio, volume, semente, atraso=0.0):
    t0 = inicio + atraso
    i0 = max(0, int(t0 * SR))
    i1 = min(len(canal), int((t0 + 0.16) * SR))
    rng = random.Random(semente)
    anterior = 0.0
    for i in range(i0, i1):
        t = i / SR - t0
        branco = rng.uniform(-1.0, 1.0)
        ruido = branco - 0.72 * anterior
        anterior = branco
        corpo = math.sin(2.0 * math.pi * 185.0 * t) * math.exp(-24.0 * t)
        canal[i] += volume * math.exp(-31.0 * t) * (0.78 * ruido + 0.22 * corpo)


def acrescentar_chocalho(canal, inicio, volume, semente, atraso=0.0):
    t0 = inicio + atraso
    i0 = max(0, int(t0 * SR))
    i1 = min(len(canal), int((t0 + 0.055) * SR))
    rng = random.Random(semente)
    anterior = 0.0
    for i in range(i0, i1):
        t = i / SR - t0
        branco = rng.uniform(-1.0, 1.0)
        ruido = branco - 0.9 * anterior
        anterior = branco
        canal[i] += volume * math.exp(-82.0 * t) * ruido


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


def acrescentar_pad(canal, nota, inicio, duracao, volume, brilho, detune, atraso=0.0):
    """Colchao sustentado com entrada e saida em meio-cosseno curtas (so pra tirar o
    clique, sem dar um 'inchar e esvaziar' perceptivel a cada troca de acorde) e tom
    parado, sem vibrato: o 'organo'/corda que sobe embaixo da melodia (trilha tipo
    Interstellar), sem nenhum balanco de afinacao ou volume indo e vindo."""
    ataque = 0.12
    solte = 0.3
    t0 = inicio + atraso
    freq = hz(nota) * (1.0 + detune)
    limite = min(len(canal), int((t0 + duracao + solte) * SR))
    i0 = max(0, int(t0 * SR))
    for i in range(i0, limite):
        t = i / SR - t0
        if t < ataque:
            env = 0.5 - 0.5 * math.cos(math.pi * t / ataque)
        elif t < duracao:
            env = 1.0
        else:
            x = min(1.0, (t - duracao) / solte)
            env = 0.5 + 0.5 * math.cos(math.pi * x)
        fase = 2.0 * math.pi * freq * t
        corpo = math.sin(fase) + 0.34 * brilho * math.sin(2.0 * fase) + 0.12 * brilho * math.sin(3.0 * fase)
        canal[i] += volume * env * corpo


def acrescentar_sino(canal, nota, inicio, volume, atraso=0.0):
    """Sino esparso com parciais inarmonicos (nao e campainha de jogo, e brilho de trilha)."""
    t0 = inicio + atraso
    freq = hz(nota)
    decaimento = 2.3
    limite = min(len(canal), int((t0 + 2.8) * SR))
    i0 = max(0, int(t0 * SR))
    for i in range(i0, limite):
        t = i / SR - t0
        env = math.exp(-decaimento * t)
        fase = 2.0 * math.pi * freq * t
        onda = (0.62 * math.sin(fase) + 0.24 * math.sin(2.756 * fase)
                + 0.14 * math.sin(5.4 * fase))
        canal[i] += volume * env * onda


def acrescentar_nota_melodia(canal, nota, inicio, duracao, volume, detune, atraso=0.0, brilho=1.0):
    t0 = inicio + atraso
    freq = hz(nota) * (1.0 + detune)
    ataque = 0.05
    soltura = 0.3
    limite = min(len(canal), int((t0 + duracao + soltura) * SR))
    i0 = max(0, int(t0 * SR))
    for i in range(i0, limite):
        t = i / SR - t0
        if t < ataque:
            env = 0.5 - 0.5 * math.cos(math.pi * t / ataque)
        elif t < duracao:
            x = (t - ataque) / max(0.001, duracao - ataque)
            env = 0.86 + 0.14 * math.sin(math.pi * x)  # leve respiro no meio da nota
        else:
            env = math.exp(-11.0 * (t - duracao))
        fase = 2.0 * math.pi * freq * t
        corpo = 0.78 * math.sin(fase) + 0.16 * brilho * math.sin(2.0 * fase) + 0.06 * brilho * math.sin(3.0 * fase)
        textura = math.exp(-20.0 * t) * 0.08 * math.sin(2.02 * fase)
        canal[i] += volume * env * (corpo + textura)


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
    perfil = PERFIS[config["perfil"]]
    segundos_batida = 60.0 / config["bpm"]
    duracao_secao = BATIDAS_POR_ACORDE * segundos_batida
    ciclo = len(config["secoes"]) * duracao_secao
    total = int((ciclo + CAUDA) * SR)
    canal = [0.0] * total

    for indice, (acorde, baixo, arpejo) in enumerate(config["secoes"]):
        inicio = indice * duracao_secao
        crescimento = 0.55 + indice * 0.15
        brilho = min(1.5, 0.5 + indice * 0.32)

        # Colchao sustentado: pedal do baixo + o acorde inteiro, entrando em meio-cosseno.
        pad_vol_base = 0.016 * crescimento * perfil["pad"]
        acrescentar_pad(canal, baixo[0], inicio, duracao_secao, pad_vol_base * 1.5, brilho,
                         detune, atraso)
        for voz, nota in enumerate(acorde):
            acrescentar_pad(canal, nota, inicio, duracao_secao, pad_vol_base * (0.9 - voz * 0.08),
                            brilho, detune, atraso + voz * 0.02)

        # Ataque breve marca a troca harmonica por cima do pad.
        for voz, nota in enumerate((acorde[0], acorde[1])):
            acrescentar_pluck(canal, nota, inicio, 0.015 * crescimento, 7.5,
                              detune, atraso + voz * 0.045)

        # Bateria: bumbo em 3+3+2 com caixa no backbeat dos dois compassos.
        for batida in BATIDAS_BUMBO:
            volume_bumbo = 0.03 if batida in (0, 4) else (0.021 if batida in (1.5, 5.5) else 0.014)
            acrescentar_baque(canal, inicio + batida * segundos_batida,
                              volume_bumbo * crescimento * perfil["bateria"], detune, atraso)
        for batida in BATIDAS_CAIXA:
            semente = int((inicio + batida) * SR) + indice * 97
            acento = 1.0 if batida in (3, 7) else 0.68
            acrescentar_caixa(canal, inicio + batida * segundos_batida,
                              0.036 * acento * crescimento * perfil["bateria"], semente, atraso)
        for passo, batida in enumerate(BATIDAS_CHOCALHO):
            semente = int((inicio + batida) * SR) + indice * 211 + passo
            antecipacao = batida % 1.0 == 0.75
            volume_chocalho = 0.004 if antecipacao else (0.0075 if passo % 2 else 0.0055)
            acrescentar_chocalho(canal, inicio + batida * segundos_batida,
                                 volume_chocalho * crescimento * perfil["bateria"], semente, atraso)
        if indice > 0:
            for batida in (3.5, 7.5):
                acrescentar_tom(canal, inicio + batida * segundos_batida,
                                0.006 * crescimento, detune, atraso)

        # Baixo acompanha o galope do bumbo e deixa a melodia respirar entre frases.
        for batida, nota_baixo in ((0, baixo[0]), (1.5, baixo[1]), (3, baixo[0]),
                                   (4, baixo[0]), (5.5, baixo[1]), (7, baixo[0])):
            acrescentar_pluck(canal, nota_baixo, inicio + batida * segundos_batida,
                              (0.025 if batida in (0, 4) else 0.018) * crescimento,
                              7.2, detune, atraso)

        # Sino esparso: um brilho por secao par, no topo do arpejo (textura, nao efeito de jogo).
        if indice % 2 == 0:
            acrescentar_sino(canal, arpejo[-1] + 12, inicio + 0.5 * segundos_batida,
                             0.01 * crescimento * perfil["sino"], atraso)

        raiz_gancho = acorde[0]
        if raiz_gancho < 48:
            raiz_gancho += 12
        for indice_nota, (batida, intervalo, duracao) in enumerate(MELODIAS_SECOES[indice]):
            nota = raiz_gancho + intervalo
            volume = (0.082 + indice * 0.008) * (1.12 if indice_nota == 0 else 1.0) * perfil["melodia"]
            acrescentar_nota_melodia(canal, nota, inicio + batida * segundos_batida,
                                     duracao * segundos_batida, volume, detune, atraso, brilho=brilho)

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
