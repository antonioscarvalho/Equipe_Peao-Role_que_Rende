# Fluxo de trabalho e convenções

## Branches

| Branch | Uso |
|---|---|
| `main` | Versão estável, que vai para a Banca. Só recebe merge de `development`. |
| `development` | Integração do dia a dia. |
| `feat/<nome>` | Nova funcionalidade, criada a partir de `development`. |
| `fix/<nome>` | Correção. |
| `docs/<nome>` | Documentação. |

```
feat/x ─┐
fix/y  ─┼─► development ──► main (marcos e entrega final)
docs/z ─┘
```

Antes de criar branch ou começar tarefa, confira se ninguém já está nela: `node .claude/skills/orquestrar-branches/scripts/mapa-branches.mjs --spec NNN` (ou `/orquestrar-branches`). Quem começa uma spec põe o nome em "Responsável" no [índice das specs](../../specs/README.md) antes do código.

## Commits

Padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/), em português:

```
<tipo>: <descrição curta no imperativo>
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `asset`.

Exemplos:
- `feat: adiciona tela de respiração guiada`
- `asset: adiciona trilha sonora do menu (CC BY 4.0)`
- `docs: registra uso de IA na geração de textos`

Commits feitos com ajuda de IA levam a linha `Co-Authored-By:` da ferramenta, e o uso é registrado na [declaração](../07-conformidade/declaracao-de-uso-de-ia.md).

## Pull requests

- PR pequeno e frequente; merge em `development` depois de pelo menos uma revisão rápida de outro integrante.
- No checklist do PR:
  - [ ] Roda localmente
  - [ ] Novos assets e bibliotecas registrados em [licenças](../07-conformidade/licencas-e-assets.md)
  - [ ] Uso de IA registrado na [declaração](../07-conformidade/declaracao-de-uso-de-ia.md)
  - [ ] Textos novos seguem o [tom de voz](../03-design/conteudo-e-tom-de-voz.md)

## Rituais (curtos!)

| Quando | O quê | Duração |
|---|---|---|
| Início de cada dia | Alinhamento: o que cada um faz hoje | 10 min |
| Depois do almoço | Checkpoint: o que travou? | 5 min |
| Fim de cada dia | Demo interna + atualização do [diário](diario-de-bordo.md) | 15 min |
