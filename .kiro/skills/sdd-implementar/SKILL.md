---
name: sdd-implementar
description: Implementa UMA tarefa de um tarefas.md do fluxo SDD, seguindo a spec e o plano. Use quando alguém quiser executar a próxima tarefa de uma funcionalidade, ou quando pedir /sdd-implementar.
---

# SDD · Implementar

Implementa **uma tarefa por vez**, para que um humano revise cada passo.

## Passos

1. Identifique a funcionalidade e a tarefa (se não for informada, pegue a primeira `⬜` sem dependências pendentes em `tarefas.md`).
2. Leia `spec.md`, `plano.md` e a tarefa. Leia os arquivos de código que serão alterados.
3. Confirme que está numa branch `feat/NNN-<slug>` (ou `fix/…`), criada a partir de `development`. Se não estiver, sugira criar.
4. Marque a tarefa como `🟨` em `tarefas.md`.
5. Implemente **só** o escopo da tarefa. Se perceber que a spec ou o plano estão errados, pare e avise, em vez de improvisar.
6. Verifique o critério de pronto (rodar, testar, abrir a tela). Comandos de build e teste: ver `docs/04-tecnico/setup-e-execucao.md`.
7. Marque a tarefa como `✅` e faça o commit no padrão de `docs/05-processo/fluxo-de-trabalho.md`, citando a tarefa (ex.: `feat: tela de respiração guiada (002/T003)`), com a linha `Co-Authored-By` do agente.
8. Registre o uso com `/registrar-uso-ia` (categoria: Geração de código) e, se entrou dependência ou asset novo, `/registrar-asset`.

## Regras

- Nunca coloque chaves de API no código. Use `.env` e atualize `.env.example`.
- Textos para o usuário seguem `docs/03-design/conteudo-e-tom-de-voz.md`.
- Dados de exemplo são sempre sintéticos.
- Nada de mecânica com dinheiro real, valor monetário ou que imite apostas (Seção 8.4).

> **TODO do responsável:** adicionar aqui os comandos reais de build, lint e teste quando a stack for definida.
