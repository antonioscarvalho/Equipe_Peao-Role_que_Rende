---
name: sdd-especificar
description: Cria a especificação (spec.md) de uma nova funcionalidade no fluxo SDD da equipe. Use quando alguém quiser começar uma funcionalidade nova, descrever o que o produto deve fazer ou quando pedir /sdd-especificar.
---

# SDD · Especificar

Gera `specs/NNN-<slug>/spec.md`, que descreve **o quê** e **o porquê**, nunca o como.

## Passos

1. Leia antes:
   - `docs/01-hackathon/resumo-do-edital.md`
   - `docs/02-produto/visao-do-produto.md`, `publico-e-personas.md` e `escopo-e-backlog.md`
   - `docs/03-design/conteudo-e-tom-de-voz.md`
   - as specs existentes em `specs/`, para não duplicar
2. Se a descrição do usuário não deixar claro **quem** usa, **qual problema** resolve e **qual pilar do desafio** atende, pergunte antes de escrever (no máximo três perguntas).
3. Defina o número `NNN` como o próximo livre em `specs/` (001, 002…) e um slug curto em kebab-case.
4. Copie `specs/_modelo/spec.md` para `specs/NNN-<slug>/spec.md` e preencha. Não invente dados: o que não souber, marque como `[PRECISA ESCLARECER: …]`.
5. Preencha a seção **Conformidade com o edital** com honestidade. Se a funcionalidade tocar em algo proibido pela Seção 8.4, pare e avise o usuário.
6. Mostre um resumo da spec ao usuário e peça revisão. Não avance para o plano sem aprovação.
7. Lembre o usuário de rodar `/registrar-uso-ia` (categoria: Documentação / Definição de tema).

## Regras

- Spec não fala de tecnologia, biblioteca ou estrutura de código.
- Critérios de aceite devem ser verificáveis (Dado / Quando / Então).
- Linguagem sem estigma, conforme o guia de tom de voz.
