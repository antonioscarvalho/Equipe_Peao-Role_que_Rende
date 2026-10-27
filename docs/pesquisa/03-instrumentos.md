# 03 · Instrumentos de rastreio e acompanhamento

> Pesquisa feita em 27/10/2026. ⚠️ = não confirmado em fonte primária.
> **Regra do projeto:** rastreio no app gera **orientação e encaminhamento**, nunca rótulo ou diagnóstico.

## Comparativo

| Instrumento | Itens | Para que serve | Acurácia relatada | Português do Brasil | Licença | Uso sugerido no app |
|---|---|---|---|---|---|---|
| **PGSI** (Problem Gambling Severity Index, do CPGI) | 9 | Gravidade/risco nos últimos 12 meses; faixas 0 / 1–2 / 3–7 / 8+ | Validado em vários países (ex.: espanhol, α ordinal = 0,97) | **Adaptação transcultural e validade de conteúdo** publicadas na *Rev Saúde Pública* (2026); validação psicométrica completa ⚠️ não encontrada. O III LENAD usou o PGSI | ⚠️ não verificada; o CPGI é do Canadian Centre on Substance Use and Addiction | Autoavaliação **opcional** no início e a cada 4 semanas, mostrada como "nível de risco" com orientação, sem rótulo |
| **BBGS** (Brief Biosocial Gambling Screen) | 3 | Rastreio rápido de possível transtorno | Sensibilidade 0,96 / especificidade 0,99 na população geral (Gebauer 2010, citado em fonte secundária ⚠️); acerto de 0,88 em serviço de dependência química | ⚠️ nenhuma validação brasileira encontrada | ⚠️ não verificada (criado pela Cambridge Health Alliance) | Opcional, para quem não quer responder 9 itens |
| **NODS-CLiP** | 3 | Rastreio rápido | AUC 0,90 em serviço de dependência química; está entre os 5 instrumentos com acurácia satisfatória na meta-análise de 2019 | ⚠️ nenhuma validação brasileira encontrada | ⚠️ não verificada | Alternativa ao BBGS |

Fontes: [Rev Saúde Pública — adaptação do PGSI](https://revistas.usp.br/rsp/article/view/252251) (DOI 10.11606/s1518-8787.2026060007368) · [Validação espanhola do PGSI](https://irep.ntu.ac.uk/id/eprint/34405/) · [Am J Addict 2015 — rastreios breves](https://scholars.uky.edu/en/publications/evaluation-of-brief-screens-for-gambling-disorder-in-the-substanc/) · [Meta-análise de acurácia 2019 (Monash)](https://research.monash.edu/en/publications/the-diagnostic-accuracy-of-brief-screening-instruments-for-proble/) · [ACA — dados do BBGS](https://www.counseling.org/resources/practice-briefs/article/gambling-disorder)

## Medidas de desfecho para o próprio app (sem licença)

Medidas simples, autorreferidas, pensadas para o celular:

| Medida | Como coletar | Frequência |
|---|---|---|
| Dias sem apostar (total no período, não só a sequência atual) | Check-in diário de 1 toque: "apostei / não apostei" | Diária, opcional |
| Valor apostado | Faixas de valor (evita digitar número exato) | Quando registrar um lapso |
| Tempo gasto apostando | Faixas | Quando registrar um lapso |
| **Fissura (0–10)** | Régua no SOS, antes e depois | A cada uso do SOS |
| Autoeficácia ("Quão confiante você está em não apostar esta semana?" 0–10) | Régua | Semanal |
| PGSI (se o licenciamento for liberado) | Questionário | A cada 4 semanas |

## Pendências antes de usar qualquer escala
1. ⚠️ **Licença do PGSI**: confirmar as condições de uso com o CCSA e se a versão adaptada da *Rev Saúde Pública* pode ser reproduzida.
2. ⚠️ **Validação brasileira**: hoje só há validade de conteúdo do PGSI. Avisar no app que o resultado é orientativo.
3. Textos de devolução do resultado precisam de **revisão clínica** (skill `seguranca-e-crise`), sem palavras como "viciado" ou "patológico".
4. O NICE NG248 deixou de usar o PGSI como critério **único** de gravidade, o que reforça usar a escala só como apoio.
