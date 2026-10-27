# 05 · Evidências sobre apps de saúde mental

> Pesquisa feita em 27/10/2026. ⚠️ = não confirmado em fonte primária.

## 1. Engajamento: o problema real
- **Baumel et al. 2019 (JMIR):** análise de uso real de apps populares de ansiedade, depressão e bem-estar no Android. A **taxa mediana de abertura diária foi de 4%**. Uma fonte secundária fala em perda de mais de 80% dos usuários em 10 dias e retenção em 30 dias abaixo de 4% ⚠️. [JMIR 2019;21(9):e14567](https://www.jmir.org/2019/9/e14567) · [PMC6785720](https://pmc.ncbi.nlm.nih.gov/articles/PMC6785720) (observacional)
- **Mais uso ≠ mais efeito:** uma revisão de 2026 argumenta que maximizar o engajamento sem critério pode **não melhorar, ou até piorar,** o resultado clínico e cria riscos éticos ⚠️ (só o resumo foi lido, *Information*/MDPI).

> **Para o produto:** a métrica de sucesso é de **desfecho** (dias sem apostar, gasto, fissura), não de tempo de tela. O valor precisa aparecer **na primeira sessão** (ex.: SOS funcionando) e no **momento da necessidade**, não depender de uso diário.

## 2. Gamificação
- **Cheng et al. 2019 (JMIR Mental Health):** revisão de 70 artigos e 50 apps. A gamificação em saúde mental em geral **não** usa motivadores extrínsecos pesados, mas muitos autores não justificam por que gamificaram, ou seja, a escolha não é guiada por teoria. [JMIR Ment Health 2019;6(6):e13717](https://mental.jmir.org/2019/6/e13717) (revisão sistemática)
- Revisão de escopo de 2016 (*Frontiers in Psychiatry*): jogos aplicados podem aumentar o engajamento, mas alguns fatores de engajamento podem ser explorados contra o usuário. [Frontiers 2016](https://www.frontiersin.org/articles/10.3389/fpsyt.2016.00215/pdf)
- ⚠️ Não encontrei estudos específicos sobre **streaks** ou *dark patterns* em apps de saúde. A proibição de streak punitivo, recompensa aleatória e rankings (regras inegociáveis do prompt e da skill `design-etico-saude-digital`) se apoia em **plausibilidade teórica**: esse público é sensível a recompensas variáveis e ao efeito de violação da abstinência. Isso é opinião de especialista, não ECR.

## 3. Intervenções no momento da necessidade (JITAI) e EMA
- **GamblingLess: In-The-Moment / Gambling Habit Hacker (Dowling, Rodda et al., Austrália e Nova Zelândia):** ensaio microrrandomizado de 28 dias, com 3 avaliações momentâneas (EMA) por dia. A cada avaliação, a pessoa recebe ou não uma intervenção personalizada (estratégias com planos de ação e de enfrentamento). Registro ACTRN12622000490774. [Protocolo, JMIR Res Protoc 2022](https://researchprotocols.org/2022/7/e38919) · [Aceitabilidade, 2025](https://pmc.ncbi.nlm.nih.gov/articles/pmid/40468443)
  - Os estudos de aceitabilidade indicam que a JITAI ajuda a manter os limites de gasto definidos pela pessoa.
  - ⚠️ Os resultados principais de eficácia estavam **em revisão por pares** ([preprint JMIR 79852](https://preprints.jmir.org/preprint/79852)).

> **Para o produto:** check-ins curtos em **horários de risco escolhidos pela pessoa** (dia do pagamento, jogo de domingo), com planos "Se… então…", têm base promissora. Três avaliações por dia é pesado para o nosso público; comece com check-in opcional e configurável.

## 4. Bloqueio e autoexclusão
- **Software de bloqueio (avaliação da GambleAware, 2018):** de modo geral eficaz para restringir acesso aos grandes sites, mas **nenhum bloqueou 100%** e a eficácia depende do compromisso do usuário. [GambleAware](https://gambleaware.org/our-research/publication-library/articles/evaluating-online-blocking-software)
- **Revisão de 2020:** ferramentas de bloqueio são oferecidas "sem garantia de qualidade" e podem ser contornadas. [CasinoBeats](https://casinobeats.com/2020/05/26/lack-of-quality-revealed-in-review-of-online-gambling-tools/) ⚠️
- **Autoexclusão no Reino Unido (GamCare/Ipsos 2023, longitudinal):** funciona como um "**quebra-molas**" e dá melhor resultado **combinada** com outras ferramentas e apoio. [CasinoBeats](https://casinobeats.com/2023/04/24/gamcare-self-exclusion-scheme-study/) ⚠️
- **Não há ECRs** de software de bloqueio com desfechos de jogo. Várias fontes têm conflito de interesse (vendedores de software, iniciativas da indústria).

> **Para o produto:** o guia de bloqueio funciona como **fricção em camadas** (bloqueio técnico + barreira financeira + apoio humano), sem prometer eficácia. Com a MP 1.394, os sites ilegais não respeitam autoexclusão (ver [04-contexto-brasil](04-contexto-brasil.md)).

## 5. O que evitar (riscos conhecidos)
| Risco | Mitigação |
|---|---|
| Pessoas em crise usando um app sem saída para ajuda humana | Protocolo de crise a até 2 toques, que funciona offline (skill `seguranca-e-crise`) |
| Exposição de dados sensíveis (saúde e finanças) a terceiros e à família | Offline-first, criptografia local, PIN, modo discreto, sem analytics por padrão (LGPD art. 11) |
| Gamificação que imita cassino | Lista de proibições da skill `design-etico-saude-digital` |
| Notificações que funcionam como gatilho ("aposta", "dívida" na tela de bloqueio) | Texto neutro e opt-in |
| Promessas sem evidência ("cure seu vício em 30 dias") | Linguagem honesta; o app é apoio e ponte |
| Abandono em poucos dias | Valor imediato no SOS; nada de depender de uso diário |
