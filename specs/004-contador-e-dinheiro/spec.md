# Spec 004 — Check-in Diário, Contador de Dias, Dinheiro Preservado e Simulação Open Finance

- **Estado:** ✅ aprovada
- **Autor(es):** Ian Costa Guimarães
- **Aprovada por:** Equipe Peão em 2026-10-27
- **Prioridade:** Must

## 1. Contexto e problema

Pessoas com problemas com apostas perdem a percepção da dimensão dos valores gastos e sofrem com o "efeito de violação da abstinência" quando têm uma recaída (a sensação de que "perdi tudo e voltei à estaca zero", o que leva a novas apostas descontroladas). É indispensável uma abordagem de redução de danos: valorizar o total acumulado de dias sem apostar no mês, transformar o dinheiro não apostado em conquistas tangíveis para o orçamento familiar e demonstrar a viabilidade do Open Finance como aliado passivo de proteção financeira.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [x] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [ ] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** Usuário de classe D/E, renda em torno de R$ 2.500, com histórico de gastos impulsivos de R$ 30 a R$ 60 por aposta.
- **Cenário:** O usuário abre o aplicativo no final do dia para fazer seu registro diário e acompanhar sua recuperação financeira.

## 4. Histórias de usuário

- Como pessoa em processo de recuperação, quero registrar meu dia com 1 toque ("Não apostei" ou "Apostei") sem medo de ser punido ou julgado.
- Como pessoa que teve um lapso, quero ser acolhido com empatia e ver que meus dias anteriores de esforço não foram apagados, para que eu continue tentando.
- Como trabalhador com orçamento apertado, quero ver o dinheiro preservado convertido em itens concretos (botijão de gás, compras da semana, conta de luz).
- Como correntista, quero entender como o Open Finance do Banco do Brasil pode me ajudar a identificar meu dinheiro protegido sem esforço manual.

## 5. Critérios de aceite

- **CA-1:** Card de check-in na tela inicial permite registrar o dia com 1 toque: [Não apostei] e [Apostei].
- **CA-2:** Se a opção for [Não apostei], a resposta é serena e respeitosa (*"Anotado. Mais um passo dado."*), sem sons estridentes ou explosão de confetes.
- **CA-3:** Se a opção for [Apostei], abre-se o fluxo pós-lapso: agradecimento pelo registro sincero (*"Obrigado por registrar. Isso não apaga o que você já construiu."*), levantamento leve de gatilho e sugestão de ajustar o plano de ação.
- **CA-4:** O contador exibe o TOTAL de dias sem apostar no mês corrente, mantendo o histórico de progresso mesmo se houver um lapso (proibido zerar a pontuação de forma punitiva).
- **CA-5:** O cálculo de dinheiro preservado é calculado como estimativa com base no valor médio configurado pelo usuário, vinculando o montante a metas tangíveis.
- **CA-6:** Painel demonstrativo de Open Finance funcionando com dados sintéticos pré-carregados (sandbox), demonstrando ausência de Pix para intermediadoras de apostas e dinheiro preservado.
- **CA-7:** O modo manual permanece 100% funcional para usuários que não conectarem contas bancárias.

## 6. Acessibilidade

- Leitores de tela leem o saldo preservado e os dias sem jogar com descrições semânticas completas.
- Alto contraste nativo com base nos tokens do Rolê que Rende.
- Alternância simples entre visualização monetária e visualização de metas de compras essenciais.

## 7. Conteúdo e mensagens

- Alinhado com `docs/02-produto/microcopy.md` (Fluxo F4).
- Nunca usar palavras como "perdeu a sequência" ou "voltou para o dia zero".
- O valor é apresentado como estimativa consciente de autocuidado.

## 8. Fora do escopo

- Transações financeiras reais, transferências via Pix ou bloqueio compulsório de contas bancárias.
- Uso de dados reais de clientes do Banco do Brasil ou credenciais institucionais (vedado pela Seção 8.5).
- Mecânicas de gamificação com moedas virtuais que possam ser resgatadas ou sorteadas.

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas (ou, se simula, é educativo e explícito)
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos ou públicos

## 10. Dúvidas em aberto

- Nenhuma. Fluxos alinhados com `docs/02-produto/fluxos.md` (F4).
