# Spec 002 — Onboarding "Seu Motivo" e Companheiro Guardião

- **Estado:** ✅ aprovada (Equipe Peão, 27/10/2026) · 🔄 **alterada pela revisão de 27/10/2026 — aguarda reaprovação**
- **Autor(es):** Ian Costa Guimarães · revisão: Maykon Júnio (com apoio de IA)
- **Aprovada por:** Equipe Peão em 2026-10-27 · reaprovação: _—_
- **Prioridade:** Must
- **Issue:** [#4](https://github.com/antonioscarvalho/equipepeao/issues/4) · **Fluxos:** [F1 e parte do F9](../../docs/02-produto/fluxos.md)

> **O que mudou na revisão:** histórias "Ainda não sei" e privacidade ganharam critério de aceite (CA-7, CA-8); aviso 18+ na tela 1 (CA-2); a ajuda passa a 1 toque, como na 001; o Guardião ganhou regras verificáveis de estado e de marcos (CA-5, CA-9, CA-10); persona única (Marcos).

## 1. Contexto e problema

Pessoas que enfrentam problemas com apostas online chegam à aplicação em momento de vulnerabilidade, carregando vergonha, culpa e medo de julgamento. Abordagens com sermão ou cadastros burocráticos causam abandono imediato. É necessário acolher sem julgar, explicitar os limites da ferramenta (apoio complementar, não tratamento) e evocar a motivação interna da própria pessoa (Entrevista Motivacional, que reduz a frequência de jogo por até 12 meses segundo meta-análise — ver [pesquisa](../../docs/pesquisa/02-intervencoes.md)), apresentando o Guardião como companheiro empático que nunca pune recaídas.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [ ] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [ ] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** **Marcos** ([personas](../../docs/02-produto/publico-e-personas.md)), 33 anos, autônomo, Android de entrada. Aposta tentando complementar a renda e sente vergonha perante a família.
- **Cenário:** Marcos abre o app depois de um dia difícil com apostas. Ele precisa se sentir acolhido nos primeiros 60 segundos, sem criar conta nem expor dados bancários.

## 4. Histórias de usuário

- Como **Marcos**, quero definir com clareza por que quero parar ou diminuir, para que esse motivo me sirva de âncora nos momentos de vontade.
- Como **Marcos**, quero um companheiro (Guardião) que me acompanhe de forma empática, sem me punir nem fazer sermão quando eu tiver dificuldades.
- Como **Marcos**, se ainda não decidi parar totalmente, quero poder escolher "Ainda não sei" sem ser empurrado para um plano de ação.
- Como **Marcos**, quero saber logo no começo que meus registros ficam só no meu celular.

## 5. Critérios de aceite

- **CA-1:** Dado o primeiro acesso, quando a pessoa abre o app, então o onboarding tem **no máximo 5 telas** lineares, e as telas de motivo, régua e meta (2, 3 e 4) têm a opção **Pular**.
- **CA-2:** Dado a tela 1, então ela diz que o app é apoio e **não substitui atendimento profissional**, que é **para maiores de 18 anos**, e mostra **"Preciso de ajuda agora"**, que leva ao protocolo de crise com **1 toque**.
- **CA-3:** Dado a tela de motivo, então há chips (família, grana, sono, trabalho, saúde, autoestima, outro motivo) com seleção múltipla e um campo de texto livre opcional.
- **CA-4:** Dado a régua de importância (0 a 10), quando a pessoa marca uma nota N > 0, então aparece a pergunta aberta da Entrevista Motivacional *"O que faz ser N e não N−3?"* (resposta opcional).
- **CA-5:** Dado a apresentação do Guardião, então ele aparece com expressão tranquila e uma descrição em texto para leitor de tela; **não existe** nenhum estado de doença, tristeza punitiva, fome ou morte.
- **CA-6:** Dado qualquer resposta do onboarding, então ela fica guardada **só no aparelho**, sem envio a servidor.
- **CA-7:** Dado a tela de meta, então há as opções **Parar de apostar**, **Diminuir primeiro** e **Ainda não sei**; quando a pessoa escolhe "Ainda não sei", então o app mostra o texto de acolhimento do microcopy e segue para o início **sem** pedir plano de ação.
- **CA-8:** Dado a tela 5, então ela explica em até 3 linhas que os registros ficam só no celular e podem ser apagados, e oferece proteger com PIN como **opcional** (a configuração do PIN é da [spec 008](../008-configuracoes-privacidade-acessibilidade/spec.md)).
- **CA-9:** Dado o total de dias sem apostar calculado pela [spec 004](../004-contador-e-dinheiro/spec.md), quando ele chega a **7, 30 e 90 dias**, então o Guardião ganha um elemento visual novo; o próximo marco aparece **antes**, com quantos dias faltam (nada é surpresa nem aleatório).
- **CA-10:** Dado um registro de "Apostei" no dia, quando a pessoa volta ao início, então o Guardião aparece em estado de **acolhimento** com o texto "O Guardião continua aqui. Recomeçar faz parte." e **não perde** nenhum elemento já conquistado.

## 6. Acessibilidade

- Atalho para **Alto contraste** visível já na tela 1 (o controle completo fica nas configurações da [spec 008](../008-configuracoes-privacidade-acessibilidade/spec.md)).
- Rótulos acessíveis em todos os botões e seletores (TalkBack e VoiceOver); a régua 0–10 é lida como grupo de opções.
- Área mínima de toque de 48×48 px.
- Navegação completa por teclado, sem armadilhas de foco; o foco vai para o título ao trocar de tela.

## 7. Conteúdo e mensagens

- Textos do [microcopy](../../docs/02-produto/microcopy.md), seções F1 e "Guardião e marcos".
- Sem estigma: nada de "viciado", "derrota" ou "fracasso".
- Tom: *"Bora construir uma vida sem apostas? Um passo de cada vez."*

## 8. Fora do escopo

- Login, senha, e-mail ou CPF.
- Armazenamento em nuvem ou envio de dados a servidores.
- Bichinho punitivo (que adoece, chora ou morre se a pessoa falhar), itens colecionáveis ou recompensas aleatórias.
- Configuração do PIN, tamanho de fonte e reduzir animações (spec 008).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas (nome "Guardião"; uso de "Rolê que Rende" no nome depende de autorização)
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos ou do próprio usuário, no aparelho

## 10. Dúvidas em aberto

- [PRECISA ESCLARECER: política para menores de 18 anos além do aviso — orientação jurídica]
