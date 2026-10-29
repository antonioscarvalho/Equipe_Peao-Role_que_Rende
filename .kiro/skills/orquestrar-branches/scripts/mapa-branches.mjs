#!/usr/bin/env node
// Mapa de quem está mexendo em quê: lista as branches remotas com trabalho fora da base,
// cruza spec, arquivos e conflito real (git merge-tree) e aponta onde dois devs se sobrepõem.
// Só lê o git: nada é alterado, nem local nem remoto (o `fetch` só atualiza as referências).
//
// Uso: node .claude/skills/orquestrar-branches/scripts/mapa-branches.mjs [opções]
//   --base <ref>      base de comparação (padrão: origin/development)
//   --spec <NNN>      só o que toca a spec NNN
//   --arquivo <path>  só as branches que mexem neste arquivo ou pasta
//   --sem-fetch       não roda `git fetch` antes (offline)
//   --json            saída em JSON, para outro agente ler
import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'

const args = process.argv.slice(2)
const opcao = (nome) => {
  const i = args.indexOf(nome)
  return i >= 0 ? args[i + 1] : undefined
}
const BASE = opcao('--base') ?? 'origin/development'
const SPEC = opcao('--spec')?.padStart(3, '0')
const ARQUIVO = opcao('--arquivo')?.replace(/^\.\//, '')
const JSON_SAIDA = args.includes('--json')

// Branches que não são trabalho de ninguém em andamento.
const IGNORADAS = new Set(['HEAD', 'main', 'development'])
// Arquivos que todo mundo toca e que o git resolve ou regenera: entram no conflito, não na sobreposição.
const RUIDO = [/package-lock\.json$/, /^specs\/README\.md$/, /^docs\/02-produto\/escopo-e-backlog\.md$/, /declaracao-de-uso-de-ia\.md$/, /licencas-e-assets\.md$/]
// Mais que isso atrás da base, a branch provavelmente vai conflitar no PR.
const MUITO_ATRAS = 20

const git = (...a) =>
  execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
const linhas = (texto) => texto.split('\n').filter(Boolean)

const normalizar = (nome) =>
  nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/\s+/).filter(Boolean)
/** "Danillo Meira" e "Danillo Meira do Nascimento Silva" são a mesma pessoa: o nome curto cabe no longo. */
function mesmaPessoa(a, b) {
  const [curto, longo] = [normalizar(a), normalizar(b)].sort((x, y) => x.length - y.length)
  return curto.length > 0 && curto.every((t) => longo.includes(t))
}

function donosDasSpecs() {
  const caminho = 'specs/README.md'
  if (!existsSync(caminho)) return {}
  const donos = {}
  for (const linha of readFileSync(caminho, 'utf8').split('\n')) {
    const m = linha.match(/^\|\s*\[(\d{3})\]/)
    if (!m) continue
    const colunas = linha.split('|').map((c) => c.trim())
    const responsavel = colunas[colunas.length - 2]
    donos[m[1]] = /a definir|^_?—?_?$/.test(responsavel) ? null : responsavel
  }
  return donos
}

function specsDa(branch, arquivos) {
  const specs = new Set()
  for (const m of branch.matchAll(/(?:^|[/-])(\d{3})(?=-|$)/g)) specs.add(m[1])
  for (const a of arquivos) {
    const m = a.match(/^specs\/(\d{3})-/)
    if (m) specs.add(m[1])
  }
  return [...specs].sort()
}

/** Conflito de verdade entre duas pontas, sem tocar na árvore de trabalho (git ≥ 2.38). */
function conflito(a, b) {
  const r = spawnSync('git', ['merge-tree', '--write-tree', '--name-only', '--no-messages', a, b], { encoding: 'utf8' })
  if (r.status === 0) return []
  if (r.status === 1) return linhas(r.stdout).slice(1)
  return null
}

if (!args.includes('--sem-fetch')) {
  try {
    git('fetch', '--prune', '--quiet', 'origin')
  } catch {
    console.error('Aviso: o fetch falhou; o mapa usa as referências que já estavam aqui.')
  }
}

const branches = []
for (const ref of linhas(git('for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin'))) {
  const nome = ref.replace(/^origin\//, '')
  if (IGNORADAS.has(nome) || ref === 'origin') continue
  const [atras, frente] = git('rev-list', '--left-right', '--count', `${BASE}...${ref}`).split(/\s+/).map(Number)
  if (frente === 0) continue
  const autores = [...new Set(linhas(git('log', '--format=%an', `${BASE}..${ref}`)))]
  const arquivos = linhas(git('diff', '--name-only', `${BASE}...${ref}`))
  branches.push({
    ref,
    nome,
    frente,
    atras,
    autores,
    ultimo: git('log', '-1', '--format=%cr · %s', ref),
    ultimoEm: Number(git('log', '-1', '--format=%ct', ref)),
    arquivos,
    specs: specsDa(nome, arquivos),
  })
}

// O que está na sua máquina e ainda não subiu também conta: é onde a sobreposição nasce.
const local = (() => {
  const atual = git('rev-parse', '--abbrev-ref', 'HEAD')
  const arquivos = new Set([
    ...linhas(git('diff', '--name-only', `${BASE}...HEAD`)),
    ...linhas(git('diff', '--name-only', 'HEAD')),
    ...linhas(git('ls-files', '--others', '--exclude-standard')),
  ])
  const autor = git('config', 'user.name')
  return { ref: 'HEAD', nome: `${atual} (local)`, autores: [autor], arquivos: [...arquivos], specs: specsDa(atual, arquivos) }
})()

const filtra = (b) =>
  (!SPEC || b.specs.includes(SPEC)) && (!ARQUIVO || b.arquivos.some((a) => a === ARQUIVO || a.startsWith(`${ARQUIVO}/`)))
const visiveis = branches.filter(filtra).sort((a, b) => b.ultimoEm - a.ultimoEm)
const comLocal = local.arquivos.length && filtra(local) && !branches.some((b) => b.nome === local.nome.replace(' (local)', '')) ? [...visiveis, local] : visiveis

const donos = donosDasSpecs()
const alertas = []

// 1. Mesma spec em branches de pessoas diferentes.
const porSpec = {}
for (const b of comLocal) for (const s of b.specs) (porSpec[s] ??= []).push(b)
for (const [spec, lista] of Object.entries(porSpec)) {
  const pessoas = new Set(lista.flatMap((b) => b.autores.map((a) => normalizar(a).slice(0, 2).join(' '))))
  if (lista.length > 1 && pessoas.size > 1)
    alertas.push({ tipo: 'mesma-spec', gravidade: 'alta', spec, branches: lista.map((b) => b.nome), autores: [...new Set(lista.flatMap((b) => b.autores))] })
}

// 2. Branch numa spec que tem outro responsável no índice.
for (const b of comLocal)
  for (const s of b.specs) {
    const dono = donos[s]
    if (dono && !b.autores.some((a) => mesmaPessoa(a, dono)))
      alertas.push({ tipo: 'fora-do-dono', gravidade: 'media', spec: s, branch: b.nome, autores: b.autores, responsavel: dono })
    if (dono === null) alertas.push({ tipo: 'spec-sem-dono', gravidade: 'media', spec: s, branch: b.nome, autores: b.autores })
  }

// 3. Mesmo arquivo em duas branches, e se isso já é conflito de verdade.
// Só conta conflito em arquivo que as DUAS alteraram: o resto é a branch velha brigando com a base (item 4).
for (let i = 0; i < comLocal.length; i++)
  for (let j = i + 1; j < comLocal.length; j++) {
    const [a, b] = [comLocal[i], comLocal[j]]
    const tocadosPelasDuas = a.arquivos.filter((f) => b.arquivos.includes(f))
    const comuns = tocadosPelasDuas.filter((f) => !RUIDO.some((r) => r.test(f)))
    if (!comuns.length) continue
    const emConflito =
      a.ref === 'HEAD' || b.ref === 'HEAD' ? null : conflito(a.ref, b.ref)?.filter((f) => tocadosPelasDuas.includes(f))
    const soRegistros = emConflito?.length > 0 && emConflito.every((f) => RUIDO.some((r) => r.test(f)))
    alertas.push({
      tipo: soRegistros ? 'conflito-registros' : emConflito?.length ? 'conflito' : 'mesmo-arquivo',
      gravidade: emConflito?.length && !soRegistros ? 'alta' : 'baixa',
      branches: [a.nome, b.nome],
      arquivos: comuns,
      conflitos: emConflito ?? undefined,
    })
  }

// 4. Branch velha: quanto mais atrás, mais caro o PR. Se já conflita com a base, o PR não entra sem ajuste.
for (const b of visiveis) {
  const comBase = conflito(BASE, b.ref)
  if (comBase?.length) alertas.push({ tipo: 'conflita-com-base', gravidade: 'media', branch: b.nome, atras: b.atras, conflitos: comBase })
  else if (b.atras > MUITO_ATRAS) alertas.push({ tipo: 'atrasada', gravidade: 'baixa', branch: b.nome, atras: b.atras })
}

const ordem = { alta: 0, media: 1, baixa: 2 }
alertas.sort((x, y) => ordem[x.gravidade] - ordem[y.gravidade])

if (JSON_SAIDA) {
  console.log(JSON.stringify({ base: BASE, branches: comLocal.map(({ ultimoEm, ...b }) => b), alertas, donos }, null, 2))
  process.exit(0)
}

const icone = { alta: '🔴', media: '🟠', baixa: '🟡' }
const resumo = (lista, n = 4) => (lista.length > n ? `${lista.slice(0, n).join(', ')} e mais ${lista.length - n}` : lista.join(', '))

console.log(`# Mapa de branches (base: ${BASE})\n`)
console.log('| Branch | Quem | Spec | À frente / atrás | Último commit |')
console.log('|---|---|---|---|---|')
for (const b of comLocal)
  console.log(`| \`${b.nome}\` | ${b.autores.join(', ')} | ${b.specs.join(', ') || '—'} | ${b.frente ?? '—'} / ${b.atras ?? '—'} | ${b.ultimo ?? 'não enviado'} |`)

console.log(`\n## Alertas (${alertas.length})\n`)
if (!alertas.length) console.log('Nenhuma sobreposição: cada branch está mexendo num pedaço diferente.')
for (const a of alertas) {
  const g = icone[a.gravidade]
  if (a.tipo === 'mesma-spec') console.log(`${g} **Spec ${a.spec} em mais de uma branch** — ${a.branches.map((b) => `\`${b}\``).join(', ')} (${a.autores.join(', ')}). Combinem quem segue antes de escrever mais código.`)
  if (a.tipo === 'fora-do-dono') console.log(`${g} **Spec ${a.spec} tem outro responsável** — \`${a.branch}\` é de ${a.autores.join(', ')}, mas o índice diz ${a.responsavel}. Avise, ou atualize o índice.`)
  if (a.tipo === 'spec-sem-dono') console.log(`${g} **Spec ${a.spec} sem responsável** — \`${a.branch}\` (${a.autores.join(', ')}) já está nela. Ponha o nome no índice das specs.`)
  if (a.tipo === 'conflito') console.log(`${g} **Conflito real** entre \`${a.branches[0]}\` e \`${a.branches[1]}\`: ${resumo(a.conflitos)}. Quem fizer o segundo PR resolve; melhor combinar a ordem agora.`)
  if (a.tipo === 'conflito-registros') console.log(`${g} **Conflito só nos registros** entre \`${a.branches[0]}\` e \`${a.branches[1]}\`: ${resumo(a.conflitos)}. No merge, mantenha as linhas das duas.`)
  if (a.tipo === 'mesmo-arquivo') console.log(`${g} **Mesmo arquivo** em \`${a.branches[0]}\` e \`${a.branches[1]}\`: ${resumo(a.arquivos)}${a.conflitos ? ' (o git junta sozinho, por enquanto)' : ''}.`)
  if (a.tipo === 'conflita-com-base') console.log(`${g} **\`${a.branch}\` já conflita com a base** (${a.atras} commits atrás): ${resumo(a.conflitos)}. Traga a base para dentro e resolva antes do PR.`)
  if (a.tipo === 'atrasada') console.log(`${g} **\`${a.branch}\` está ${a.atras} commits atrás** da base. Traga a base para dentro antes do PR.`)
}
