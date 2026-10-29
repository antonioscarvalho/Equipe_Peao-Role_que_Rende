"""Gera trilhas instrumentais originais para uma aventura espacial cinematografica.

A sintese combina ostinatos pulsantes, percussao tonal curta e plucks melodicos que
crescem ao longo do loop. A harmonia aparece em ataques breves e arpejos, mantendo
o tom acolhedor e curioso do jogo. Sem samples ou melodias de terceiros.

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
BATIDAS_OSTINATO = (0.5, 1.0, 1.75, 2.5, 3.25, 4.5, 5.0, 5.75, 6.5, 7.25)
PASSOS_OSTINATO = (0, 2, 1, 3, 1, 0, 2, 3, 2, 1)
MELODIAS_SECOES = (
    ((0.0, 0, 1.0), (1.25, 7, 0.38), (1.75, 9, 0.58), (2.5, 7, 0.9),
     (4.0, 12, 0.9), (5.25, 9, 0.38), (5.75, 7, 0.58), (6.5, 4, 1.0)),
    ((0.0, 4, 0.65), (0.75, 7, 0.4), (1.25, 9, 1.1), (3.0, 12, 0.8),
     (4.25, 9, 0.95), (5.5, 7, 0.4), (6.0, 4, 0.45), (6.75, 7, 0.85)),
    ((0.0, 0, 0.55), (0.75, 4, 0.55), (1.5, 7, 0.9), (2.5, 9, 0.9),
     (4.0, 12, 1.1), (5.25, 14, 0.4), (5.75, 16, 0.5), (6.5, 12, 1.0)),
    ((0.0, 0, 1.0), (1.25, 7, 0.38), (1.75, 9, 0.58), (2.5, 7, 0.9),
     (4.0, 12, 0.9), (5.25, 9, 0.38), (5.75, 7, 0.58), (6.5, 0, 1.0)),
)


# Cada secao define o acorde, o baixo e o ostinato. A melodia tem frase, resposta,
# subida para o climax e retorno do tema com resolucao.
TRILHAS = {
    "leve": {
        "arquivo": "trilha-leve",
        "bpm": 100,
        "secoes": [
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 81]),
            ([48, 55, 60, 62, 64], (36, 43), [60, 64, 67, 74]),
            ([50, 57, 62, 64, 66], (38, 45), [62, 66, 69, 76]),
            ([55, 62, 67, 71, 76], (43, 50), [67, 71, 76, 79]),
        ],
    },
    "alegre": {
        "arquivo": "trilha-alegre",
        "bpm": 108,
        "secoes": [
            ([48, 55, 60, 64, 67], (36, 43), [60, 64, 67, 74]),
            ([53, 60, 65, 67, 69], (41, 48), [65, 69, 72, 77]),
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 79]),
            ([48, 55, 60, 64, 69], (36, 43), [60, 64, 69, 76]),
        ],
    },
    "pulo": {
        "arquivo": "trilha-pulo",
        "bpm": 112,
        "secoes": [
            ([52, 59, 64, 66, 68], (40, 47), [64, 68, 71, 78]),
            ([45, 52, 57, 59, 61], (33, 40), [69, 73, 76, 81]),
            ([47, 54, 59, 61, 63], (35, 42), [71, 75, 78, 83]),
            ([52, 59, 64, 66, 68], (40, 47), [64, 68, 71, 78]),
        ],
    },
    "carrinho": {
        "arquivo": "trilha-carrinho",
        "bpm": 104,
        "secoes": [
            ([50, 57, 62, 64, 66], (38, 45), [62, 66, 69, 76]),
            ([55, 62, 67, 69, 71], (43, 50), [67, 71, 74, 79]),
            ([57, 64, 69, 71, 73], (45, 52), [69, 73, 76, 81]),
            ([50, 57, 62, 66, 69], (38, 45), [62, 66, 69, 74]),
        ],
    },
}


def hz(nota_midi):
    return 440.0 * (2.0 ** ((nota_midi - 69) / 12.0))


def acrescentar_baque(canal, inicio, volume, detune, atraso=0.0):
    t0 = inicio + atraso
    i0 = max(0, int(t0 * SR))
    i1 = min(len(canal), int((t0 + 0.36) * SR))
    for i in range(i0, i1):
        t = i / SR - t0
        freq = (78.0 - 26.0 * min(1.0, t / 0.3)) * (1.0 + detune)
        fase = 2.0 * math.pi * freq * t
        env = math.exp(-13.0 * t)
        canal[i] += volume * env * (0.88 * math.sin(fase) + 0.12 * math.sin(2.0 * fase))


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


def acrescentar_nota_melodia(canal, nota, inicio, duracao, volume, detune, atraso=0.0):
    t0 = inicio + atraso
    freq = hz(nota) * (1.0 + detune)
    ataque = 0.018
    soltura = 0.18
    limite = min(len(canal), int((t0 + duracao + soltura) * SR))
    i0 = max(0, int(t0 * SR))
    for i in range(i0, limite):
        t = i / SR - t0
        if t < ataque:
            env = t / ataque
        elif t < duracao:
            env = 0.82 + 0.18 * math.exp(-2.5 * (t - ataque))
        else:
            env = 0.82 * math.exp(-13.0 * (t - duracao))
        vibrato = 0.0018 * math.sin(2.0 * math.pi * 5.1 * t)
        fase = 2.0 * math.pi * freq * (1.0 + vibrato) * t
        onda = 0.72 * math.sin(fase) + 0.21 * math.sin(2.0 * fase) + 0.07 * math.sin(3.0 * fase)
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

    for indice, (acorde, baixo, arpejo) in enumerate(config["secoes"]):
        inicio = indice * duracao_secao
        crescimento = 0.58 + indice * 0.12

        # Ataque breve marca a troca harmonica; nao ha acordes sustentados.
        notas_acorde = (acorde[0], acorde[1])
        for voz, nota in enumerate(notas_acorde):
            acrescentar_pluck(canal, nota, inicio, 0.018 * crescimento, 7.5,
                              detune, atraso + voz * 0.045)

        # Um baque por acorde deixa espaco para a frase principal.
        acrescentar_baque(canal, inicio, 0.026 * crescimento, detune, atraso)

        # O baixo muda entre os dois compassos em vez de marcar cada tempo.
        for batida, nota_baixo in ((0, baixo[0]), (4, baixo[1])):
            acrescentar_pluck(canal, nota_baixo, inicio + batida * segundos_batida,
                              0.032 * crescimento, 6.8, detune, atraso)

        # Arpejo sincopado e discreto; o motivo principal fica em primeiro plano.
        for passo, batida in enumerate(BATIDAS_OSTINATO):
            nota_arpejo = arpejo[PASSOS_OSTINATO[(passo + indice * 2) % len(PASSOS_OSTINATO)]]
            acrescentar_pluck(canal, nota_arpejo, inicio + batida * segundos_batida,
                              0.012 * crescimento, 10.0, detune, atraso)

        raiz_gancho = acorde[0] + 24
        if raiz_gancho < 72:
            raiz_gancho += 12
        for indice_nota, (batida, intervalo, duracao) in enumerate(MELODIAS_SECOES[indice]):
            nota = raiz_gancho + intervalo
            volume = (0.078 + indice * 0.009) * (1.12 if indice_nota in (0, 4) else 1.0)
            acrescentar_nota_melodia(canal, nota, inicio + batida * segundos_batida,
                                     duracao * segundos_batida, volume, detune, atraso)
            if indice >= 2 and indice_nota in (3, 4, 6):
                acrescentar_nota_melodia(canal, nota + 12, inicio + batida * segundos_batida,
                                         duracao * segundos_batida, 0.022 * crescimento,
                                         detune, atraso)

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
