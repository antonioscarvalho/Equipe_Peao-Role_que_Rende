---
name: sdd-planejar
description: Gera o plano técnico (plano.md) a partir de uma spec aprovada no fluxo SDD. Use quando a spec de uma funcionalidade estiver aprovada e for preciso decidir como implementá-la, ou quando pedir /sdd-planejar.
---

# SDD · Planejar

Gera `specs/NNN-<slug>/plano.md`, que descreve **como** implementar a spec.

## Passos

1. Pergunte qual spec planejar, se não estiver claro. Leia `specs/NNN-<slug>/spec.md` inteira.
2. Se a spec tiver `[PRECISA ESCLARECER]` em aberto ou não tiver sido aprovada, pare e peça para resolver primeiro.
3. Leia:
   - `docs/04-tecnico/arquitetura.md` (stack e decisões já tomadas)
   - `docs/04-tecnico/integracoes-externas.md`
   - `docs/07-conformidade/dados-e-privacidade.md`
   - o código existente que a funcionalidade vai tocar
4. Copie `specs/_modelo/plano.md` e preencha. Reaproveite a stack definida; só proponha tecnologia nova com justificativa.
5. Para cada dependência, asset ou API nova, liste na seção correspondente e lembre de rodar `/registrar-asset`.
6. Se o plano usar IA dentro do produto, descreva as salvaguardas (ver seção 3.1 da declaração de uso de IA).
7. Se houver decisão técnica relevante, registre também uma linha em "Decisões técnicas" de `docs/04-tecnico/arquitetura.md`.
8. Peça revisão humana antes de seguir para `/sdd-tarefas`.

## Regras

- Priorize o que cabe no tempo do Game Jam (ver marcos em `docs/02-produto/escopo-e-backlog.md`).
- Prefira armazenamento local e dados sintéticos.
- Inclua um plano B para a demo se houver dependência de rede.
