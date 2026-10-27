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
| [001](001-base-sos-crise/spec.md) | Base do app, SOS de fissura e protocolo de crise | Vontade de jogar · Ajuda especializada | Must | 🔍 revisão (clínica pendente) | — | Antonio Carvalho |
| [002](002-onboarding-e-guardiao/spec.md) | Onboarding "Seu Motivo" e Companheiro Guardião | Enfrentar momentos de vontade de jogar | Must | 📝 spec 🔄 reaprovar | [#4](https://github.com/antonioscarvalho/equipepeao/issues/4) | Ian Costa Guimarães |
| [003](003-sos-fissura/spec.md) | Botão SOS de Fissura: Urge Surfing e Cards "Pare e Examine" | Enfrentar momentos de vontade de jogar | Must | 📝 spec 🔄 reaprovar (base do SOS já implementada na 001) | [#5](https://github.com/antonioscarvalho/equipepeao/issues/5) | Ian Costa Guimarães |
| [004](004-contador-e-dinheiro/spec.md) | Check-in Diário, Contador de Dias e Dinheiro Preservado | Reorganizar a vida financeira | Must | 📝 spec 🔄 reaprovar | [#7](https://github.com/antonioscarvalho/equipepeao/issues/7) | Danillo Meira |
| [005](005-prevencao-e-circulo/spec.md) | Prevenção de Recaída (Planos Se/Então) e Círculo de Confiança | Fortalecer redes de apoio | Should | 📝 spec 🔄 reaprovar | [#8](https://github.com/antonioscarvalho/equipepeao/issues/8) | Atyrson Souto |
| [006](006-protocolo-crise-e-hub/spec.md) | Protocolo de Crise, Hub de Apoio e Guia de Bloqueio | Acessar ajuda especializada | Must | 📝 spec 🔄 reaprovar (protocolo de crise já implementado na 001) | [#9](https://github.com/antonioscarvalho/equipepeao/issues/9) | Vanessa Ramos |
| [007](007-open-finance-demo/spec.md) | Demonstração de Open Finance com dados sintéticos | Reorganizar a vida financeira | Could | 📝 rascunho | [#15](https://github.com/antonioscarvalho/equipepeao/issues/15) | _a definir_ |
| [008](008-configuracoes-privacidade-acessibilidade/spec.md) | Configurações, privacidade e acessibilidade | Vontade de jogar · Ajuda especializada | Must | 📝 rascunho | [#16](https://github.com/antonioscarvalho/equipepeao/issues/16) | Maykon Júnio |

> As specs do PR #11 foram renumeradas de 001–005 para 002–006 porque a `001-base-sos-crise` já existia e já estava implementada. As 003 e 006 detalham partes que a 001 começou.

> **Revisão de 27/10/2026:** as specs 002–006 foram corrigidas (fontes, critérios verificáveis, lacunas e dependências) e precisam ser **reaprovadas**; o Open Finance saiu da 004 e virou a 007 (Could); o fluxo F10 ganhou a 008. Cada spec diz no topo o que mudou.

Estados: 📝 spec · 🔄 reaprovar · 🗺️ plano · 📋 tarefas · 🔨 implementando · 🔍 revisão · ✅ pronto
