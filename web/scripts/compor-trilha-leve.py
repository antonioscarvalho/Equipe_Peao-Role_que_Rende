"""Compoe "Um Passo de Cada Vez", a trilha de navegacao do app (web/public/sons/trilha-leve.opus).

Loop de 16 compassos a 80 bpm (48 s), em Sol maior, todo sintetizado aqui, sem sample de
terceiros. Diferente das outras tres trilhas, nao usa o motor de compor_trilhas_exploracao.py:
ela e a primeira coisa que a pessoa ouve e toca por mais tempo, entao ganhou arranjo e mixagem
proprios.

O que segura o loop:
- 48 s a 48 kHz dao 2.304.000 amostras, multiplo exato do quadro de 20 ms do Opus.
- Tudo que passa do fim (soltura de nota, reverb, eco) e somado de volta no comeco, entao a
  volta nao corta cauda nenhuma. Compressor e filtros rodam sobre duas voltas emendadas e
  guardam a segunda, para o estado deles no comeco ser o mesmo do fim.
- O compasso 16 e uma virada (D9sus4 -> D, anacruse A-C na melodia) que resolve no G do
  compasso 1, e um prato bem baixo marca a volta.

O que ficou de fora de proposito, pelo feedback das versoes anteriores ("som de vai e vem"):
vibrato, chorus, desafinacao entre canais e colchao que incha a cada acorde. O colchao tem fase
presa ao tempo absoluto, entao nota comum entre dois acordes atravessa a troca sem degrau.

Uso (precisa de numpy e scipy; o ffmpeg converte para Opus):
    python3 web/scripts/compor-trilha-leve.py
    ffmpeg -i web/public/sons/trilha-leve.wav -c:a libopus -b:a 64k web/public/sons/trilha-leve.opus
"""
import os
import wave

import numpy as np
from scipy import signal

SR = 48000
BPM = 80
BATIDA = 60.0 / BPM
COMPASSO = 4 * BATIDA
COMPASSOS = 16
LOOP = COMPASSOS * COMPASSO
N = int(round(LOOP * SR))
CAUDA = 8.0
TOTAL = N + int(CAUDA * SR)
SWING = 0.04  # colcheia de contratempo atrasa 4% da batida: balanco leve, sem virar shuffle
GANHO_FINAL = 1.2  # ajustado pela medicao de loudness (alvo: perto dos -12 LUFS das outras trilhas)

assert N % 960 == 0, "o loop precisa fechar em quadro inteiro de Opus"

rng = np.random.default_rng(20261029)


def hz(midi):
    return 440.0 * 2.0 ** ((midi - 69) / 12.0)


def tempo(compasso, batida):
    """Posicao em segundos, com swing nas colcheias de contratempo."""
    frac = batida % 1.0
    if abs(frac - 0.5) < 1e-6:
        batida += SWING
    return compasso * COMPASSO + batida * BATIDA


def pan(mono, posicao):
    """Pan de potencia constante: -1 esquerda, 0 centro, 1 direita."""
    ang = (posicao + 1.0) * np.pi / 4.0
    return np.stack([mono * np.cos(ang), mono * np.sin(ang)])


class Pista:
    def __init__(self):
        self.som = np.zeros((2, TOTAL))

    def somar(self, inicio_s, estereo):
        i0 = int(round(inicio_s * SR))
        if i0 < 0:
            estereo = estereo[:, -i0:]
            i0 = 0
        i1 = min(TOTAL, i0 + estereo.shape[1])
        self.som[:, i0:i1] += estereo[:, : i1 - i0]


# ---------------------------------------------------------------- harmonia

# (baixo, vozes do teclado). Compassos com dois acordes trazem a troca na batida 2.
ACORDES = [
    (43, (59, 62, 66, 69)),            # 1  Gmaj9
    (42, (57, 62, 64, 66)),            # 2  D/F#
    (40, (55, 59, 62, 66)),            # 3  Em9
    (36, (55, 59, 62, 64)),            # 4  Cmaj9
    (35, (55, 59, 62, 69)),            # 5  G/B
    (36, (55, 60, 62, 64)),            # 6  Cadd9
    (33, (55, 60, 64, 71)),            # 7  Am9
    [(38, (55, 60, 64, 69)), (38, (54, 60, 64, 69))],  # 8  D9sus4 -> D9
    (36, (59, 62, 64, 67)),            # 9  Cmaj9
    (38, (57, 64, 66, 71)),            # 10 D6/9
    (35, (57, 62, 66, 69)),            # 11 Bm7
    (40, (55, 59, 62, 66)),            # 12 Em9
    (33, (55, 60, 64, 71)),            # 13 Am9
    (35, (57, 62, 66, 69)),            # 14 Bm7
    (36, (59, 62, 64, 67)),            # 15 Cmaj9
    [(38, (55, 60, 64, 69)), (38, (54, 60, 64, 69))],  # 16 D9sus4 -> D9, volta ao G
]


def acordes_do_compasso(c):
    """Lista de (batida_inicial, duracao_em_batidas, baixo, vozes)."""
    a = ACORDES[c]
    if isinstance(a, list):
        return [(0.0, 2.0, *a[0]), (2.0, 2.0, *a[1])]
    return [(0.0, 4.0, *a)]


# Melodia: (compasso, batida, nota, duracao em batidas). A e A' apresentam o tema; B sobe.
MELODIA = [
    (0, 0, 74, 1.5), (0, 1.5, 71, 0.5), (0, 2, 74, 0.5), (0, 2.5, 76, 1.5),
    (1, 0, 78, 1.0), (1, 1, 76, 0.5), (1, 1.5, 74, 2.5),
    (2, 0, 71, 0.5), (2, 0.5, 74, 0.5), (2, 1, 76, 1.5), (2, 2.5, 79, 0.5), (2, 3, 78, 1.0),
    (3, 0, 76, 1.5), (3, 1.5, 74, 0.5), (3, 2, 71, 2.0),
    (4, 0, 74, 1.5), (4, 1.5, 71, 0.5), (4, 2, 74, 0.5), (4, 2.5, 76, 1.5),
    (5, 0, 79, 1.0), (5, 1, 76, 0.5), (5, 1.5, 74, 0.5), (5, 2, 76, 2.0),
    (6, 0, 72, 0.5), (6, 0.5, 74, 0.5), (6, 1, 76, 1.0), (6, 2, 74, 0.5), (6, 2.5, 71, 1.5),
    (7, 0, 69, 1.5), (7, 1.5, 71, 0.5), (7, 2, 72, 1.0), (7, 3, 69, 1.0),
    (8, 0, 79, 2.5), (8, 2.5, 76, 0.5), (8, 3, 79, 1.0),
    (9, 0, 81, 1.5), (9, 1.5, 78, 0.5), (9, 2, 76, 2.0),
    (10, 0, 74, 0.5), (10, 0.5, 78, 0.5), (10, 1, 81, 1.5), (10, 2.5, 83, 0.5), (10, 3, 81, 1.0),
    (11, 0, 79, 1.5), (11, 1.5, 78, 0.5), (11, 2, 76, 1.0), (11, 3, 74, 1.0),
    (12, 0, 76, 1.5), (12, 1.5, 74, 0.5), (12, 2, 72, 0.5), (12, 2.5, 74, 0.5), (12, 3, 76, 1.0),
    (13, 0, 78, 2.0), (13, 2, 74, 1.0), (13, 3, 71, 1.0),
    (14, 0, 76, 1.0), (14, 1, 74, 0.5), (14, 1.5, 76, 0.5), (14, 2, 79, 2.0),
    (15, 0, 78, 1.5), (15, 1.5, 76, 0.5), (15, 2, 74, 1.0), (15, 3, 69, 0.5), (15, 3.5, 72, 0.5),
]


# ---------------------------------------------------------------- instrumentos

def env_ar(n, ataque, soltura_inicio, soltura):
    """Envelope em meio-cosseno: sobe em `ataque` s, fica em 1, desce em `soltura` s."""
    t = np.arange(n) / SR
    e = np.ones(n)
    a = t < ataque
    e[a] = 0.5 - 0.5 * np.cos(np.pi * t[a] / ataque)
    s = t >= soltura_inicio
    x = np.clip((t[s] - soltura_inicio) / soltura, 0.0, 1.0)
    e[s] *= 0.5 + 0.5 * np.cos(np.pi * x)
    return e


def piano_eletrico(nota, dur, vel):
    """FM 1:1 com indice que cai (o 'brilho' do martelo) e uma lamina aguda curta, tipo Rhodes."""
    f = hz(nota)
    n = int((dur + 1.2) * SR)
    t = np.arange(n) / SR
    indice = (1.1 * vel + 0.4) * np.exp(-t * 3.2) + 0.25
    mod = indice * np.sin(2 * np.pi * f * t)
    corpo = np.sin(2 * np.pi * f * t + mod)
    lamina = 0.10 * vel * np.sin(2 * np.pi * f * 14.0 * t) * np.exp(-t * 28)
    amp = np.exp(-t * 0.9) * env_ar(n, 0.004, dur, 0.35)
    return (corpo + lamina) * amp * vel


def kalimba(nota, dur, vel):
    """Lamina percutida: fundamental, parciais inarmonicos curtos e um toque de madeira."""
    f = hz(nota)
    n = int((max(dur, 0.6) + 1.6) * SR)
    t = np.arange(n) / SR
    fund = np.sin(2 * np.pi * f * t) * np.exp(-t * 1.6)
    p2 = 0.22 * np.sin(2 * np.pi * f * 5.95 * t) * np.exp(-t * 9)
    p3 = 0.08 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 4)
    toque = 0.18 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 160)
    amp = env_ar(n, 0.002, dur + 0.9, 0.6)
    return (fund + p2 + p3 + toque) * amp * vel


def voz_suave(nota, dur, vel):
    """Seno com um pouco de 2o e 3o harmonico, sem vibrato: da corpo as notas longas da melodia."""
    f = hz(nota)
    n = int((dur + 0.4) * SR)
    t = np.arange(n) / SR
    onda = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(4 * np.pi * f * t) + 0.05 * np.sin(6 * np.pi * f * t)
    return onda * env_ar(n, 0.06, dur, 0.3) * vel


def celesta(nota, vel):
    f = hz(nota)
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    mod = 1.6 * np.exp(-t * 6) * np.sin(2 * np.pi * f * 3.5 * t)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 2.4) * env_ar(n, 0.002, 1.8, 0.4) * vel


def colchao(nota, inicio_s, dur_s, canal_fase):
    """Serra de banda limitada, filtrada pelo peso dos harmonicos. A fase depende do tempo
    absoluto, entao a mesma nota em dois acordes seguidos atravessa a troca sem degrau. A
    frequencia e arredondada para caber um numero inteiro de ciclos no loop (desvio de no maximo
    0,01 Hz), para a fase tambem fechar na volta do compasso 16 para o 1."""
    f = round(hz(nota) * LOOP) / LOOP
    troca = 0.15
    n = int((dur_s + troca) * SR)
    t_abs = inicio_s + np.arange(n) / SR
    onda = np.zeros(n)
    k = 1
    while f * k < 5000 and k <= 24:
        fase = (nota * 7.31 + k * 1.93 + canal_fase) % (2 * np.pi)
        onda += (k ** -1.5) * np.sin(2 * np.pi * f * k * t_abs + fase)
        k += 1
    return onda * env_ar(n, troca, dur_s, troca)


def baixo(nota, dur, vel):
    f = hz(nota)
    n = int((dur + 0.2) * SR)
    t = np.arange(n) / SR
    # 2o e 3o harmonicos fixos: e o que deixa a linha do baixo audivel em alto-falante de celular.
    onda = np.sin(2 * np.pi * f * t) + 0.32 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    onda += 0.06 * np.sin(8 * np.pi * f * t)
    onda = np.tanh(1.6 * onda) / np.tanh(1.6)
    amp = np.exp(-t * 0.6) * env_ar(n, 0.008, dur, 0.12)
    return onda * amp * vel


def ruido(n, semente):
    return np.random.default_rng(semente).uniform(-1, 1, n)


def filtrar(x, tipo, freq, ordem=2):
    sos = signal.butter(ordem, freq, btype=tipo, fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def bumbo(vel):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    freq = 48 + 62 * np.exp(-t * 28)
    fase = 2 * np.pi * np.cumsum(freq) / SR
    corpo = np.sin(fase) * np.exp(-t * 7.5)
    clique = filtrar(ruido(n, 7), "highpass", 2500) * np.exp(-t * 300) * 0.25
    return np.tanh(1.4 * (corpo + clique)) * vel


def caixa_escovinha(vel, semente):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    chiado = filtrar(ruido(n, semente), "bandpass", [900, 6000]) * np.exp(-t * 16)
    tom = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 32) * 0.35
    return (chiado * 0.9 + tom) * vel


def chimbal(vel, aberto, semente):
    n = int((0.6 if aberto else 0.09) * SR)
    t = np.arange(n) / SR
    x = filtrar(ruido(n, semente), "highpass", 7000, 4)
    return x * np.exp(-t * (7 if aberto else 55)) * vel


def chocalho(vel, semente):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    x = filtrar(ruido(n, semente), "bandpass", [4000, 11000])
    return x * (1 - np.exp(-t * 400)) * np.exp(-t * 60) * vel


def prato(vel, semente):
    n = int(3.5 * SR)
    t = np.arange(n) / SR
    x = filtrar(ruido(n, semente), "highpass", 4500, 2)
    return x * np.exp(-t * 1.3) * (1 - np.exp(-t * 200)) * vel


def respiro(dur, vel, semente):
    """Ruido filtrado que cresce ate a volta do loop (o 'prato ao contrario' das viradas)."""
    n = int(dur * SR)
    x = filtrar(ruido(n, semente), "bandpass", [1500, 7000])
    rampa = np.linspace(0, 1, n) ** 2.5
    return x * rampa * vel


def tom_grave(nota, vel):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = hz(nota)
    fase = 2 * np.pi * np.cumsum(f * (1 + 0.25 * np.exp(-t * 30))) / SR
    return np.sin(fase) * np.exp(-t * 7) * vel


# ---------------------------------------------------------------- efeitos

def reverb(estereo, tamanho=1.0, amortecimento=0.35, decaimento=0.86):
    """Freeverb: oito pentes com passa-baixa na realimentacao e quatro passa-tudo por canal."""
    pentes = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116]
    passa_tudo = [225, 556, 441, 341]
    escala = SR / 44100 * tamanho
    saida = np.zeros_like(estereo)
    for c, desvio in enumerate((0, 23)):
        x = estereo[c]
        acc = np.zeros_like(x)
        for d in pentes:
            D = int((d + desvio) * escala)
            b = np.zeros(D + 2)
            b[D] = 1 - amortecimento
            a = np.zeros(D + 1)
            a[0] = 1.0
            a[1] = -amortecimento
            a[D] += -decaimento * (1 - amortecimento)
            acc += signal.lfilter(b, a, x)
        y = acc / len(pentes)
        for d in passa_tudo:
            D = int((d + desvio) * escala)
            g = 0.5
            b = np.zeros(D + 1)
            b[0] = -g
            b[D] = 1.0
            a = np.zeros(D + 1)
            a[0] = 1.0
            a[D] = -g
            y = signal.lfilter(b, a, y)
        saida[c] = y
    return saida


def eco(estereo, atraso_batidas=0.75, repeticoes=5, retorno=0.33):
    """Eco de colcheia pontuada alternando os lados, cada repeticao mais escura."""
    saida = np.zeros_like(estereo)
    mono = estereo.mean(axis=0)
    atual = mono
    passo = int(atraso_batidas * BATIDA * SR)
    for r in range(1, repeticoes + 1):
        atual = filtrar(atual, "lowpass", 4200 - r * 450, 1) * retorno
        lado = (r % 2) * 2 - 1
        desloc = np.zeros_like(atual)
        desloc[r * passo:] = atual[: len(atual) - r * passo]
        saida += pan(desloc, 0.6 * lado)
    return saida


def dobrar_cauda(estereo):
    """Soma no comeco tudo o que passou do fim do loop."""
    ciclo = estereo[:, :N].copy()
    resto = estereo[:, N:]
    while resto.shape[1]:
        parte = resto[:, :N]
        ciclo[:, : parte.shape[1]] += parte
        resto = resto[:, N:]
    return ciclo


def em_volta(ciclo, processo):
    """Roda um processo com estado sobre duas voltas emendadas e devolve a segunda."""
    dupla = np.concatenate([ciclo, ciclo], axis=1)
    return processo(dupla)[:, N:]


def compressor(estereo, limiar_db=-18.0, razao=2.0, ataque=0.02, soltura=0.25):
    nivel = np.sqrt(filtrar(estereo.mean(axis=0) ** 2, "lowpass", 8, 1).clip(1e-12))
    db = 20 * np.log10(nivel)
    acima = np.maximum(0.0, db - limiar_db)
    reducao = acima * (1 - 1 / razao)
    # suavizacao assimetrica (desce rapido, volta devagar) num passo so por bloco de 1 ms
    bloco = SR // 1000
    r = reducao[::bloco]
    suave = np.zeros_like(r)
    ca, cs = np.exp(-1 / (ataque * 1000)), np.exp(-1 / (soltura * 1000))
    for i in range(1, len(r)):
        coef = ca if r[i] > suave[i - 1] else cs
        suave[i] = coef * suave[i - 1] + (1 - coef) * r[i]
    ganho = 10 ** (-np.repeat(suave, bloco)[: estereo.shape[1]] / 20)
    if len(ganho) < estereo.shape[1]:
        ganho = np.pad(ganho, (0, estereo.shape[1] - len(ganho)), mode="edge")
    return estereo * ganho


# ---------------------------------------------------------------- arranjo

def montar():
    teclado, melodia, cama, grave, bateria, brilho = (Pista() for _ in range(6))

    for c in range(COMPASSOS):
        parte_b = 8 <= c < 15
        for b0, dur, nota_baixo, vozes in acordes_do_compasso(c):
            inicio = tempo(c, b0)
            dur_s = dur * BATIDA
            # Colchao: mesmo nivel nos 16 compassos (sem crescer e cair), um pouco mais cheio no B.
            nivel_cama = 0.017 if parte_b else 0.015
            for i, v in enumerate(vozes):
                for canal, posicao in ((0, -0.55 + i * 0.12), (1, 0.55 - i * 0.12)):
                    som = colchao(v, inicio, dur_s, canal * 1.7) * nivel_cama
                    cama.somar(inicio, pan(som, posicao))
            # Teclado: acorde no tempo 1 e um retoque mais leve no contratempo do 2.
            ataques = [(0.0, 0.62, dur)] if dur <= 2 else [(0.0, 0.62, 2.5), (2.5, 0.42, 1.5)]
            for desl, vel, d in ataques:
                for i, v in enumerate(vozes):
                    humano = rng.normal(0, 0.004)
                    vv = vel * (1 + rng.normal(0, 0.06)) * (0.9 if i == 0 else 1.0)
                    som = piano_eletrico(v, d * BATIDA, vv) * 0.10
                    teclado.somar(tempo(c, b0 + desl) + i * 0.012 + humano, pan(som, -0.25 + i * 0.17))

        # Baixo: tonica longa, retoque no contratempo e nota de passagem para o proximo compasso.
        prox = acordes_do_compasso((c + 1) % COMPASSOS)[0][2]
        atual = acordes_do_compasso(c)
        raiz = atual[0][2]
        raiz2 = atual[-1][2]
        passagem = prox + (2 if prox < raiz2 else -2) if abs(prox - raiz2) > 2 else raiz2 + 7
        if passagem > 47:
            passagem -= 12
        for b, nota, d, vel in ((0, raiz, 1.75, 1.0), (2.5, raiz2, 0.5, 0.7), (3.5, passagem, 0.45, 0.6)):
            grave.somar(tempo(c, b), pan(baixo(nota, d * BATIDA, vel) * 0.09, 0.0))

        # Bateria
        virada = c == COMPASSOS - 1
        for b, vel in ((0, 1.0), (2.5, 0.7)) + (((3.75, 0.45),) if c % 4 == 3 and not virada else ()):
            bateria.somar(tempo(c, b), pan(bumbo(vel) * 0.17, 0.0))
        for b in (1, 3):
            if virada and b == 3:
                continue
            bateria.somar(tempo(c, b) + 0.006, pan(caixa_escovinha(0.95, c * 10 + b) * 0.16, 0.08))
        for oitavo in range(8):
            b = oitavo * 0.5
            if virada and b >= 3:
                break
            aberto = parte_b and oitavo == 7
            vel = (0.85 if oitavo % 2 == 0 else 0.55) * (1 + rng.normal(0, 0.08))
            bateria.somar(tempo(c, b), pan(chimbal(vel, aberto, c * 100 + oitavo) * 0.06, 0.32))
        if c >= 4:
            for s in range(16):
                b = s * 0.25
                if virada and b >= 3:
                    break
                vel = (0.6 if s % 4 == 2 else 0.35) * (1.3 if parte_b else 1.0)
                bateria.somar(tempo(c, b), pan(chocalho(vel, c * 1000 + s) * 0.03, -0.38))
        if virada:
            for b, nota, vel in ((3.0, 45, 0.8), (3.5, 41, 0.9)):
                bateria.somar(tempo(c, b), pan(tom_grave(nota, vel) * 0.11, -0.2 if nota > 43 else 0.2))
            brilho.somar(tempo(c, 2.0), pan(respiro(2 * BATIDA, 0.05, 99), 0.0))

        # Celesta no B: arpejo esparso nas notas do acorde, duas oitavas acima.
        if parte_b:
            vozes = atual[0][3]
            for k, b in enumerate((0.5, 1.5, 2.5, 3.5)):
                nota = vozes[(k * 2 + c) % len(vozes)] + 24
                lado = -0.5 if k % 2 == 0 else 0.5
                brilho.somar(tempo(c, b), pan(celesta(nota, 0.5 if k else 0.65) * 0.06, lado))

    # Prato bem baixo marcando a volta ao compasso 1.
    brilho.somar(0.0, pan(prato(0.5, 4242) * 0.035, 0.4))

    for c, b, nota, d in MELODIA:
        inicio = tempo(c, b) + rng.normal(0, 0.003)
        vel = 0.85 + 0.15 * (d >= 1.0) + rng.normal(0, 0.04)
        melodia.somar(inicio, pan(kalimba(nota, d * BATIDA, vel) * 0.13, 0.05))
        if d >= 1.0:
            melodia.somar(inicio, pan(voz_suave(nota - 12, d * BATIDA, 0.6) * 0.035, -0.1))
        if 12 <= c < 15:
            melodia.somar(inicio + 0.01, pan(kalimba(nota + 12, d * BATIDA, 0.4) * 0.03, 0.3))

    return teclado, melodia, cama, grave, bateria, brilho


def mixar():
    teclado, melodia, cama, grave, bateria, brilho = montar()
    teclado.som = filtrar(teclado.som, "lowpass", 6500, 2)
    cama.som = filtrar(filtrar(cama.som, "lowpass", 2600, 2), "highpass", 140, 2)
    grave.som = filtrar(grave.som, "lowpass", 900, 2)

    seco = teclado.som + melodia.som + cama.som + grave.som + bateria.som + brilho.som
    envio = (0.30 * teclado.som + 0.32 * melodia.som + 0.40 * cama.som
             + 0.12 * bateria.som + 0.55 * brilho.som)
    envio = filtrar(envio, "highpass", 220, 2)
    molhado = reverb(envio, tamanho=1.15) * 0.55
    ecos = eco(melodia.som) * 0.45

    ciclo = dobrar_cauda(seco + molhado + ecos)

    def mestre(x):
        x = filtrar(x, "highpass", 28, 2)
        x = x + 0.35 * filtrar(x, "highpass", 2800, 1)  # realce de presenca: celular nao tem grave
        x = compressor(x, limiar_db=-20, razao=1.8)
        return x

    ciclo = em_volta(ciclo, mestre)
    ciclo *= GANHO_FINAL / np.max(np.abs(ciclo))
    # Teto suave: so encosta em pico raro, sem bombear; a margem sobra para o Opus.
    return 0.77 * np.tanh(ciclo * 1.2) / np.tanh(1.2)


def salvar(estereo, caminho):
    pcm = (np.clip(estereo, -1, 1).T * 32767).astype("<i2")
    with wave.open(caminho, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sons")
    caminho = os.path.normpath(os.path.join(pasta, "trilha-leve.wav"))
    salvar(mixar(), caminho)
    print(f"gerado: {caminho} ({LOOP:.1f}s, {BPM} bpm, {N} amostras)")
