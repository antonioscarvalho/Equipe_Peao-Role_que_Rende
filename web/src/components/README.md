# Catálogo de componentes (web)

Procure aqui antes de criar uma peça nova (skill `ui-ux-designer`). Peça genérica: recebe tudo por prop e não conhece regra de negócio.

| Componente | Para que serve | Props principais |
|---|---|---|
| `Botao` | Ação ou link. Variantes: `primario`, `secundario`, `sos` (amarelo, grande), `discreto` | `variante`, `para` (rota), `href` (tel:/https:), `onClick`, `larguraTotal` |
| `Cartao` | Bloco de conteúdo com título opcional | `titulo`, `destaque`, `nivelTitulo` |
| `Aviso` | Caixa "Saiba:" ou "Atenção:" (texto, não só cor) | `tipo` |
| `Escala0a10` | Régua 0–10 (fissura, importância, confiança) como grupo de rádio | `pergunta`, `valor`, `aoMudar`, `rotuloMin`, `rotuloMax` |
| `Chips` | Seleção múltipla (motivos, gatilhos) com `aria-pressed` | `legenda`, `opcoes`, `selecionados`, `aoMudar` |
| `CampoTexto` | Campo com rótulo e dica ligados | `rotulo`, `valor`, `aoMudar`, `multilinha`, `tipo` |
| `Guardiao` | Personagem SVG por estágio (0–3), com descrição para leitor de tela | `estagio`, `humor`, `tamanho` |
| `Respiracao` | Respiração guiada 4 s / 6 s, respeita movimento reduzido | `ativa` |
| `Pagina` | Moldura de tela: `h1` único com foco, link de voltar, modo calmo | `titulo`, `voltarPara`, `calma` |
| `BarraCrise` | Atalho fixo "Preciso de ajuda agora" (some só na própria tela de crise) | — |

Tokens de cor, fonte e espaço vêm de `.claude/skills/guia-estilo-role-que-rende/assets/tokens.css` (alias `@guia`), importados em `src/theme/app.css`.
