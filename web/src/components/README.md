# Catálogo de componentes (web)

Antes de criar uma peça, procure aqui (skill `ui-ux-designer`). Peça nova é genérica: recebe tudo por prop e não conhece regra de negócio.

| Componente | Para que serve | Props principais |
|---|---|---|
| `Botao` | Botão padrão, com alvo ≥ 48 px | `variante` (`principal` · `secundario` · `alerta`), `grande`, props de `<button>` |
| `ReguaVontade` | Escolha de 0 a 10 com botões grandes (melhor que slider no toque e no leitor de tela) | `rotulo`, `valor`, `aoEscolher` |
| `TimerOnda` | Contagem regressiva com círculo de respiração e frases que trocam a cada 20 s | `segundos`, `frases`, `aoTerminar` |
| `LinkTelefone` | Link `tel:` com cara de botão, funciona offline | `telefone`, `rotulo`, `descricao`, `destaque` |
| `Chips` | Seleção múltipla de opções curtas (gatilhos, motivos), cada uma um botão com `aria-pressed` | `legenda`, `opcoes`, `selecionados`, `aoMudar`, `dica` |
| `Cartao` | Bloco com título e conteúdo, que entra na hierarquia de títulos da tela | `titulo`, `nivel` (2 ou 3), `children` |
| `Contador` | Número grande com a frase inteira para o leitor de tela, detalhe do mês e da sequência em texto pequeno; mostra sem cobrança os dias sem registro | `dias`, `desde`, `noMes`, `sequencia`, `diasSemRegistro` |
| `Aproximado` | Prefixo "≈" de valor estimado, lido como "cerca de" pelo leitor de tela | — |
