---
name: orquestrar-branches
description: Mapa de quem está mexendo em quê no repositório. Lista as branches remotas com trabalho fora da development, cruza spec, arquivos e conflito real (git merge-tree) e aponta quando dois devs estão fazendo a mesma coisa, mexendo no mesmo arquivo ou numa spec que tem outro responsável. Use ANTES de criar branch ou começar tarefa, antes de abrir PR, no alinhamento do dia, e sempre que alguém perguntar "tem alguém fazendo isso?", "posso pegar a spec X?" ou "por que deu conflito?".
---

# Orquestrar branches

Seis pessoas e vários agentes de IA trabalham em paralelo, cada um na sua branch. O jeito mais caro de errar é **dois fazerem a mesma coisa sem saber**: aconteceu na spec 007, com duas branches de pessoas diferentes mexendo nos mesmos arquivos, e só apareceria no PR, com conflito em cinco arquivos e um dos dois trabalhos jogado fora.

A skill não decide nada sozinha. Ela mostra a sobreposição cedo, enquanto combinar ainda é barato.

## O mapa

```bash
node .claude/skills/orquestrar-branches/scripts/mapa-branches.mjs
```

Precisa de Node 22 (o mesmo do `web/`) e git 2.38 ou mais novo. Ele faz `git fetch` e **só lê**: não troca de branch, não faz merge, não apaga nada.

| Opção | Para quê |
|---|---|
| `--spec 007` | só o que toca a spec 007 (pelo nome da branch ou por arquivo em `specs/007-*`) |
| `--arquivo web/src/app/dinheiro` | quem mais está mexendo neste arquivo ou nesta pasta |
| `--base origin/main` | comparar com outra base (padrão: `origin/development`) |
| `--sem-fetch` | sem rede: usa as referências que já estão na máquina |
| `--json` | saída para outro agente ler |

O que sai na sua máquina e ainda não subiu (commits locais, arquivos alterados e arquivos novos) entra como `<branch> (local)`. É ali que a sobreposição nasce, antes de qualquer push.

## Quando rodar

1. **Antes de criar branch ou começar tarefa**: `--spec NNN` da spec que você vai pegar. Se aparecer branch de outra pessoa, fale com ela antes de escrever a primeira linha.
2. **Antes de mexer num arquivo central** (`App.tsx`, `index.css`, `conteudo.ts`, `db.ts`): `--arquivo <caminho>`.
3. **Antes de abrir PR**: sem filtro. Resolva os 🔴 e os "conflita com a base" antes de pedir revisão.
4. **No alinhamento do dia** (`docs/05-processo/fluxo-de-trabalho.md`): sem filtro, e o mapa vai para a conversa da equipe.

## O que fazer com cada alerta

| Alerta | O que significa | O que fazer |
|---|---|---|
| 🔴 **Spec em mais de uma branch** | duas pessoas na mesma funcionalidade | Parar e combinar **quem segue**. A outra branch vira fonte de ideias, ou é dividida por tarefa do `tarefas.md`. Nunca as duas em paralelo. |
| 🔴 **Conflito real** | as duas branches alteraram as mesmas linhas | Combinar a **ordem dos PRs**: entra uma, a outra traz a `development` para dentro e resolve. Quem resolve é o dono da segunda, falando com o da primeira. |
| 🟠 **Spec tem outro responsável** | a branch é de alguém que não está no índice | Avisar o responsável. Se a troca foi combinada, atualizar a coluna "Responsável" em `specs/README.md`. |
| 🟠 **Spec sem responsável** | alguém começou uma spec que ninguém assumiu | Pôr o nome no índice **agora**: é a única forma de o próximo saber que ela já tem dono. |
| 🟠 **Já conflita com a base** | a `development` andou por cima do que a branch mudou | `git merge origin/development` na branch, resolver e testar antes do PR. |
| 🟡 **Conflito só nos registros** | os dois acrescentaram linha na declaração de IA, nas licenças ou no lockfile | No merge, manter as linhas das duas. O lockfile se regenera com `npm install`. |
| 🟡 **Mesmo arquivo** | as duas mexem no arquivo, mas o git junta sozinho | Nada urgente. Vale um aviso, porque a próxima mudança pode virar conflito. |
| 🟡 **Atrasada** | mais de 20 commits atrás da base | Trazer a base para dentro logo: quanto mais espera, mais caro fica. |

## Como reservar uma spec (para o próximo não pegar a mesma)

O mapa só enxerga o que já está no git. Por isso, quem começa:

1. Põe o nome na coluna "Responsável" de `specs/README.md` e sobe isso **antes** do código (commit `docs: assume a spec NNN`).
2. Cria a branch com o número da spec no nome, `feat/NNN-<slug>`, e faz push logo no primeiro commit. Sem o número, o mapa só reconhece a spec pelos arquivos em `specs/NNN-*`.
3. Se for trabalho de mais de algumas horas, abre o PR como **rascunho** já no primeiro push. É o aviso mais visível para a equipe.

## Regras

- **Nunca** faça push, rebase, merge ou exclusão na branch de outra pessoa sem ela pedir. A skill aponta a sobreposição; quem resolve é quem é dono da branch.
- A resposta ao usuário traz o mapa e, para cada 🔴 e 🟠, **quem precisa falar com quem**. Não basta dizer "há conflito".
- Branch que já entrou inteira na base não aparece no mapa. Apagar a branch remota continua sendo decisão do dono.
- `main` só recebe merge de `development` (`docs/05-processo/fluxo-de-trabalho.md`). Para conferir o que ainda não chegou à Banca, rode com `--base origin/main`.
