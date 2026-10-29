---
name: sdd-tarefas
description: Quebra o plano técnico aprovado em tarefas pequenas e verificáveis (tarefas.md) no fluxo SDD. Use depois que o plano.md de uma funcionalidade estiver aprovado, ou quando pedir /sdd-tarefas.
---

# SDD · Tarefas

Gera `specs/NNN-<slug>/tarefas.md`.

## Passos

1. Leia `spec.md` e `plano.md` da funcionalidade. Se o plano não estiver aprovado, pare.
2. Copie `specs/_modelo/tarefas.md` e quebre o plano em tarefas que:
   - levem **no máximo cerca de 1 hora** cada;
   - tenham um critério de pronto verificável;
   - indiquem os arquivos afetados;
   - indiquem dependências (`depende de: T00X`);
   - marquem `[P]` quando puderem ser feitas em paralelo, sem tocar nos mesmos arquivos.
3. Ordene: estrutura → fluxo principal (Must) → acessibilidade → polimento.
4. Toda tarefa deve apontar para pelo menos um critério de aceite da spec (`CA-x`).
5. Inclua sempre uma tarefa final de conformidade: checklist de `docs/07-conformidade/regras-de-conteudo.md` + registros de IA e assets.
6. Adicione as tarefas Must no backlog de `docs/02-produto/escopo-e-backlog.md`.
7. Sugira ao usuário uma divisão das tarefas `[P]` entre os integrantes.
