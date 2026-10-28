# Spec 004 — Check-in Diário, Contador de Dias e Dinheiro Preservado

- **Estado:** ✅ aprovada (Equipe Peão, 27/10/2026) · 🔄 **alterada pela revisão de 27/10/2026 — aguarda reaprovação**
- **Autor(es):** Ian Costa Guimarães · revisão: Maykon Júnio (com apoio de IA)
- **Aprovada por:** Equipe Peão em 2026-10-27 · reaprovação: _—_
- **Prioridade:** Must
- **Issue:** [#7](https://github.com/antonioscarvalho/equipepeao/issues/7) · **Fluxos:** [F4 e F9](../../docs/02-produto/fluxos.md)

> **O que mudou na revisão:** o Open Finance saiu desta spec e virou a [spec 007](../007-open-finance-demo/spec.md) (Could, só dados sintéticos, sem marca BB, sem "detectar aposta"); o contador mostra o **total desde o início** como número principal (decisão de 27/10: no dia 1 de cada mês o número não "cai"); novo critério para configurar o gasto e a meta (CA-6); "pontuação" virou "contagem"; o ajuste do plano depois de um lapso aponta para a spec 005.

## 1. Contexto e problema

Pessoas com problemas com apostas perdem a noção do quanto gastaram e sofrem com o "efeito de violação da abstinência": depois de um lapso, pensam "perdi tudo, voltei à estaca zero" e apostam mais (modelo de Marlatt & Gordon — skill `prevencao-recaida`). A resposta é de redução de danos: valorizar o **total** de dias sem apostar, que um lapso não apaga, e mostrar o dinheiro não apostado como algo concreto para o orçamento da casa.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [x] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [ ] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** **Marcos** ([personas](../../docs/02-produto/publico-e-personas.md)): renda em torno de R$ 2.500, apostas de R$ 30 a R$ 60 de cada vez.
- **Cenário:** no fim do dia, Marcos abre o app para registrar o dia e ver como está.

## 4. Histórias de usuário

- Como **Marcos**, quero registrar meu dia com 1 toque ("Não apostei" ou "Apostei") sem medo de ser julgado.
- Como **Marcos**, depois de um lapso, quero ser acolhido e ver que meus dias de esforço não foram apagados.
- Como **Marcos**, quero ver o dinheiro preservado como coisas concretas (botijão, compras da semana, conta de luz).
- Como **Marcos**, quero informar, quando quiser, quanto costumava apostar por semana e para onde quero levar esse dinheiro.

## 5. Critérios de aceite

- **CA-1:** Dado a tela inicial, então o card **"Como foi hoje?"** registra o dia com 1 toque: **Não apostei** · **Apostei** (humor opcional). Registrar de novo no mesmo dia substitui o registro.
- **CA-2:** Dado "Não apostei", então o app responde *"Anotado."*, sem som, confete ou animação de vitória.
- **CA-3:** Dado "Apostei", então abre o pós-lapso: (1) *"Obrigado por registrar. Isso não apaga o que você já construiu."*; (2) chips de gatilho + texto livre opcional; (3) **Editar meu plano** (abre o editor da [spec 005](../005-prevencao-e-circulo/spec.md) já com o gatilho marcado) ou **Agora não**; (4) a opção **"Tô mal com isso"** leva ao protocolo de crise.
- **CA-4:** Dado o contador, então o número principal é o **total de dias sem apostar desde o início** do uso; abaixo, em texto menor, aparecem os dias sem apostar **neste mês** e a **sequência atual**, com tom neutro. Um lapso **nunca** zera a contagem principal, e a virada do mês não muda o número principal.
- **CA-5:** Dado um gasto semanal informado, então o dinheiro preservado = (gasto semanal ÷ 7) × total de dias sem apostar, mostrado **sempre com a palavra "estimativa"** e ligado à meta da pessoa (ex.: *"≈ R$ 600 — dá pra conta de luz"*).
- **CA-6:** Dado que a pessoa ainda não informou o gasto semanal, então o card de dinheiro mostra o convite **"Quer ver quanto você preservou?"**, que abre dois campos opcionais e editáveis a qualquer momento: valor que costumava apostar por semana e meta concreta.
- **CA-7:** Dado qualquer valor de dinheiro, então ele **nunca** aparece em notificação nem na tela de bloqueio.

## 6. Acessibilidade

- O leitor de tela lê o total de dias e o dinheiro preservado com frase completa (ex.: "62 dias sem apostar desde 27 de outubro").
- Alto contraste pelos tokens do guia de estilo ([spec 008](../008-configuracoes-privacidade-acessibilidade/spec.md)).
- Alternância simples entre ver em reais e ver em metas concretas.
- Estados com texto, nunca só com cor.

## 7. Conteúdo e mensagens

- [Microcopy](../../docs/02-produto/microcopy.md), seções Início e F4.
- Nunca usar "perdeu a sequência" ou "voltou para o dia zero".
- O valor é sempre "estimativa".

## 8. Fora do escopo

- **Open Finance** (spec 007).
- Transações reais, Pix ou bloqueio de conta.
- Dados de clientes do Banco do Brasil ou credenciais institucionais (Seção 8.5).
- Moedas virtuais, pontos ou recompensas trocáveis ou sorteadas.
- Evolução visual do Guardião (spec 002, que usa o total calculado aqui).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário (valor é estimativa digitada pela pessoa)
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos ou do próprio usuário, no aparelho

## 10. Dúvidas em aberto

- Nenhuma. Fluxos alinhados com `docs/02-produto/fluxos.md` (F4 e F9, atualizados na revisão de 27/10).
