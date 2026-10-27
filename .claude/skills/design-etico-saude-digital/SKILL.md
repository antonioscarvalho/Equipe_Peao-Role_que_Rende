---
name: design-etico-saude-digital
description: Obrigatória em toda funcionalidade. Regras de design ético para app de saúde mental voltado a apostadores — gamificação sem mecânica de aposta, notificações, privacidade/LGPD, linguagem simples e acessibilidade.
---

# Design ético para saúde digital

## Princípio central
O público é especialmente sensível a **recompensas variáveis, urgência e luzes/sons de vitória** — exatamente o que as bets usam. O app precisa ser o oposto: calmo, previsível, respeitoso com o tempo da pessoa. Engajamento é meio, não fim; sucesso é a pessoa precisar menos do app.

## Gamificação: permitido vs. proibido
| Proibido | Permitido |
|---|---|
| Recompensas aleatórias, roletas, caixas surpresa, raspadinhas | Marcos previsíveis e anunciados (7, 30, 90 dias) |
| Sons e animações de "vitória" estilo cassino | Feedback visual discreto |
| Streak que zera e "pune" | Total de dias sem apostar + sequência atual, com tom neutro |
| Rankings e competição | Comparação apenas consigo mesmo(a) |
| Moedas, pontos trocáveis, loja | Visualização de progresso ligada aos valores da pessoa |
| FOMO ("só hoje!", contagem regressiva) | Convites opcionais |

## Notificações
- Opt-in por tipo, com frequência máxima definida pela pessoa.
- Texto discreto na tela de bloqueio (nada de "apostas", "vício", "dívida"); nome e ícone do app opcionalmente neutros ("modo discreto").
- Nunca em tom de culpa ou ameaça; nunca às madrugadas, a não ser que a pessoa peça.

## Privacidade e LGPD
- Dados de saúde são **dados sensíveis** (LGPD art. 5º, II e art. 11): consentimento específico e destacado, finalidade clara.
- Offline-first; uso sem cadastro; criptografia local; bloqueio do app por PIN/biometria opcional.
- Coleta mínima. Nada em URL, logs ou analytics de terceiros. Analytics, se existir, agregado e opt-in.
- Exportar e apagar todos os dados com 1 ação (botão "apagar tudo" com confirmação).
- Pensar no risco de outra pessoa da casa abrir o celular.

## Linguagem e acessibilidade
- Português do Brasil simples; frases curtas; sem jargão clínico (ou explicado).
- Linguagem centrada na pessoa: "pessoa que aposta", não "viciado".
- Contraste WCAG AA, fonte ajustável, leitores de tela, alvos de toque ≥ 44px.
- Funcionar bem em Android de entrada e com internet ruim; áudio opcional para quem tem dificuldade de leitura.

## Ética de produto
- Não aceitar anúncios ou patrocínio de qualquer empresa de apostas.
- Transparência sobre quem fez o app, base científica e limites.
- Plano de avaliação: métricas de desfecho (dias sem apostar, gasto, PGSI ao longo do tempo, se validado) acima de métricas de vaidade (tempo no app).

## Checklist (rodar em todo módulo)
- [ ] Alguma mecânica lembra jogo de azar? Se sim, remover.
- [ ] Notificações são opt-in, discretas e sem culpa?
- [ ] Coleta só o essencial, local e criptografado?
- [ ] Texto simples, sem julgamento, acessível?
- [ ] A métrica de sucesso do módulo é de desfecho, não de retenção?
