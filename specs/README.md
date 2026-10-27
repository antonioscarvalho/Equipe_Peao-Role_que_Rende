# `specs/` — Especificações (SDD)

Cada funcionalidade do produto tem uma pasta numerada, criada pelas skills de [`.claude/`](../.claude/README.md):

```
specs/
├── _modelo/              ← modelos usados pelas skills (não editar sem combinar)
│   ├── spec.md
│   ├── plano.md
│   └── tarefas.md
└── 001-nome-da-funcionalidade/
    ├── spec.md           ← /sdd-especificar
    ├── plano.md          ← /sdd-planejar
    ├── tarefas.md        ← /sdd-tarefas
    └── revisao.md        ← /sdd-revisar
```

## Índice de funcionalidades

| # | Funcionalidade | Pilar do desafio | Prioridade | Estado | Issue | Responsável |
|---|---|---|---|---|---|---|
| [001](001-onboarding-e-guardiao/spec.md) | Onboarding "Seu Motivo" e Companheiro Guardião | Enfrentar momentos de vontade de jogar | Must | 📝 spec | [#4](https://github.com/antonioscarvalho/equipepeao/issues/4) | Ian Costa Guimarães |
| [002](002-sos-fissura/spec.md) | Botão SOS de Fissura: Urge Surfing e Cards "Pare e Examine" | Enfrentar momentos de vontade de jogar | Must | 📝 spec | [#5](https://github.com/antonioscarvalho/equipepeao/issues/5) | Ian Costa Guimarães |
| [003](003-contador-e-dinheiro/spec.md) | Check-in Diário, Contador de Dias e Dinheiro Preservado | Reorganizar a vida financeira | Must | 📝 spec | [#7](https://github.com/antonioscarvalho/equipepeao/issues/7) | Danillo Meira |
| [004](004-prevencao-e-circulo/spec.md) | Prevenção de Recaída (Planos Se/Então) e Círculo de Confiança | Fortalecer redes de apoio | Should | 📝 spec | [#8](https://github.com/antonioscarvalho/equipepeao/issues/8) | Atyrson Souto |
| [005](005-protocolo-crise-e-hub/spec.md) | Protocolo de Crise, Hub de Apoio e Guia de Bloqueio | Acessar ajuda especializada | Must | 📝 spec | [#9](https://github.com/antonioscarvalho/equipepeao/issues/9) | Vanessa Ramos |

Estados: 📝 spec · 🗺️ plano · 📋 tarefas · 🔨 implementando · 🔍 revisão · ✅ pronto
