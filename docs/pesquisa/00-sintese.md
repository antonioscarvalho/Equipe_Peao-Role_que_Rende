# 00 · Síntese da pesquisa (Fase 1)

> Pesquisa feita em **27/10/2026** pela Equipe Peão com apoio de IA (Claude Code), conforme a [declaração de uso de IA](../07-conformidade/declaracao-de-uso-de-ia.md).
> ⚠️ = não confirmado em fonte primária. **Todo conteúdo clínico precisa de validação por profissional de psicologia antes do lançamento.**

| Documento | Conteúdo |
|---|---|
| [01-transtorno-do-jogo](01-transtorno-do-jogo.md) | DSM-5-TR, CID-11 6C50, curso, comorbidades, suicídio, particularidades das bets |
| [02-intervencoes](02-intervencoes.md) | TCC, EM, prevenção de recaída, mindfulness, iCBT, NICE, mútua ajuda |
| [03-instrumentos](03-instrumentos.md) | PGSI, BBGS, NODS-CLiP, medidas de desfecho |
| [04-contexto-brasil](04-contexto-brasil.md) | Lei 14.790, **MP 1.394/2026**, autoexclusão, Desenrola, LENAD, rede de cuidado |
| [05-saude-digital](05-saude-digital.md) | Engajamento, gamificação, JITAI, bloqueio, riscos |

## As 10 conclusões mais importantes para o produto

1. **⚠️ As bets foram proibidas no Brasil em 25/09/2026 (MP 1.394/2026), e isso muda o problema, não o elimina.** As autorizações acabaram e os sites deveriam sair do ar em 06/10. Mas a MP pode cair no Congresso (prazo inicial em 23/11/2026) ou no STF, e o mercado clandestino continua. Hoje **todo site de bet acessível é ilegal** e não respeita autoexclusão. O produto precisa funcionar nos dois cenários, com informação regulatória em arquivo de conteúdo com data de verificação. → [04](04-contexto-brasil.md)

2. **O público é grande, digital e de baixa renda.** Pelo III LENAD, cerca de 7% da população (14+ anos) está em risco ou com jogo problemático (≈ 10,9 milhões; ⚠️ há discrepância entre 6,8% e 7,3%). Entre apostadores de plataformas digitais, a taxa é de **66,8%**; entre os de renda abaixo de 1 salário mínimo, **52,8%**. Isso pede **PWA leve, que funcione em Android simples e com internet ruim**. → [04](04-contexto-brasil.md)

3. **O risco de suicídio é real: o protocolo de crise é obrigatório, não opcional.** O registro sueco mostrou mortalidade por suicídio cerca de 15 vezes maior em quem tem diagnóstico de transtorno do jogo, embora um estudo de 2025 sugira que parte disso passa pelas comorbidades. CVV 188 e SAMU 192 a até 2 toques, funcionando offline. → [01](01-transtorno-do-jogo.md)

4. **TCC é a intervenção com mais evidência, mas o efeito de longo prazo é incerto.** A Cochrane (14 ECRs) mostra benefício logo após o tratamento. Por isso, o app deve investir em **prevenção de recaída** e tratar o lapso como dado, não como fracasso. → [02](02-intervencoes.md)

5. **Autoajuda funciona, mas apoio humano funciona mais.** No estudo de Petry (2006), a apostila de TCC ajudou, mas menos que a terapia; nas meta-análises de intervenções pela internet, as versões com apoio de terapeuta têm efeitos maiores. **O app é uma ponte**: deve levar a pessoa ao teleatendimento do SUS (⚠️ só confirmado na imprensa), ao CAPS, aos Jogadores Anônimos e à rede de apoio. → [02](02-intervencoes.md), [04](04-contexto-brasil.md)

6. **A Entrevista Motivacional é a base certa para onboarding e textos.** Reduz a frequência de jogo por até 12 meses (meta-análise com 5 ECRs) e lida com a ambivalência sem confronto. Quem ainda não decidiu parar também precisa ser acolhido. → [02](02-intervencoes.md)

7. **O SOS de fissura tem base sólida: urge surfing, adiar a decisão e planos Se/Então.** Mindfulness tem efeito moderado sobre a fissura (g ≈ 0,69, evidência tentativa); intervenções no momento da necessidade (JITAI) são promissoras, mas os resultados de eficácia ainda estão em revisão. Medir a fissura antes e depois constrói autoeficácia. → [02](02-intervencoes.md), [05](05-saude-digital.md)

8. **Rastrear sim, rotular nunca.** O PGSI tem só adaptação transcultural e validade de conteúdo no Brasil (2026), e a licença não foi verificada. O NICE deixou de usá-lo como critério único de gravidade. Usar como autoavaliação opcional que gera **orientação e encaminhamento**. → [03](03-instrumentos.md)

9. **Engajamento não é o objetivo.** Apps de saúde mental têm cerca de 4% de abertura diária, e mais uso não garante mais efeito. Nada de streak punitivo, recompensa aleatória ou ranking: esse público é especialmente sensível a recompensa variável (evidência teórica, não ECR). O valor precisa aparecer **na primeira sessão**. → [05](05-saude-digital.md)

10. **Bloqueio e barreira financeira são "quebra-molas", não muros.** Não há ECR de software de bloqueio; a autoexclusão funciona melhor em camadas e combinada com apoio. Com as bets ilegais, o guia de bloqueio técnico (DNS, filtros), a barreira financeira (limite de Pix, pessoa de confiança) e o organizador de dívidas (Desenrola 3.0 a partir de fev/2027) ganham peso. → [04](04-contexto-brasil.md), [05](05-saude-digital.md)

## Contradições com o prompt original

| O prompt dizia | O que a pesquisa encontrou | Sugestão |
|---|---|---|
| Focar em quem aposta "especialmente em sites ilegais/não autorizados" e explicar a autoexclusão de operadores autorizados | Desde a MP 1.394/2026 **não há operadores autorizados**; todos os sites são ilegais. A situação da plataforma de autoexclusão depois da MP não foi confirmada | Manter o guia de autoexclusão só se a plataforma continuar ativa; priorizar bloqueio técnico e financeiro |
| Listar a "lista oficial de operadores autorizados" | As autorizações foram extintas | Remover do escopo, ou tratar como conteúdo condicional caso a MP caia |
| "Regras sobre PIX/cartão para apostas" | A Portaria 615/2024 (proibição do cartão de crédito) perdeu relevância prática com a proibição total | Manter só como contexto histórico |

## Dúvidas abertas
1. A plataforma gov.br de autoexclusão continua ativa depois da MP? Ainda faz sentido indicá-la?
2. Licença e validação brasileira do PGSI: dá para usar no MVP?
3. O teleatendimento do SUS (Meu SUS Digital) está de fato disponível? Precisamos da fonte oficial do Ministério da Saúde.
4. Recomendações de tratamento do NICE NG248 (o site retornou 403): ler manualmente.
5. Política de idade: o LENAD mostra 10,5% de adolescentes apostando. O app atende menores de 18 anos? (exige decisão da equipe com orientação jurídica)
6. Quem da equipe (ou que mentor) pode fazer a **revisão clínica** do conteúdo durante o Game Jam?

## Próximo passo
Com o seu ok, sigo para a **Fase 2**: matriz conceito → funcionalidade e priorização MoSCoW do MVP.
