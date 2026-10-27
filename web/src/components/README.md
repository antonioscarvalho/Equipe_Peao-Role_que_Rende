# Catálogo de componentes (web)

Antes de criar uma peça, procure aqui (skill `ui-ux-designer`). Peça nova é genérica: recebe tudo por prop e não conhece regra de negócio.

| Componente | Para que serve | Props principais |
|---|---|---|
| `Botao` | Botão padrão, com alvo ≥ 48 px | `variante` (`principal` · `secundario` · `alerta`), `grande`, props de `<button>` |
| `ReguaVontade` | Escolha de 0 a 10 com botões grandes (melhor que slider no toque e no leitor de tela) | `rotulo`, `valor`, `aoEscolher` |
| `TimerOnda` | Contagem regressiva com círculo de respiração e frases que trocam a cada 20 s | `segundos`, `frases`, `aoTerminar` |
| `LinkTelefone` | Link `tel:` com cara de botão, funciona offline | `telefone`, `rotulo`, `descricao`, `destaque` |
