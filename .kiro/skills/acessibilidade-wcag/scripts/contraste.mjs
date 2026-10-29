#!/usr/bin/env node
// Contraste WCAG medido nos tokens de verdade: resolve os var() do CSS em cada tema
// (o :root e cada `html[...]` que redefine token) e confere texto (1.4.3/1.4.6),
// contorno de controle (1.4.11) e anel de foco (2.4.7/1.4.11).
// O que não dá para medir (translúcido, gradiente, color-mix, token inexistente) sai em
// "fora da conta" e NUNCA conta como aprovado.
//
// Uso: node .claude/skills/acessibilidade-wcag/scripts/contraste.mjs [arquivo.css...] [opções]
//   padrão: web/src/index.css (segue os @import locais)
//   --par <corA> <corB>   mede um par avulso em todos os temas (token `--x` ou hex)
//   --minimo <n>          exige n:1 do texto normal em todos os temas (ex.: 7 para tela de crise)
//   --json
//
// Anotações aceitas dentro de uma regra CSS:
//   /* contraste-fundo: var(--rqr-azul-escuro) */  o fundo real é outro (ex.: herdado do pai)
//   /* contraste: ignorar <motivo> */             fora da medição, com o motivo no relatório
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'

const args = process.argv.slice(2)
const opcao = (nome, n = 1) => {
  const i = args.indexOf(nome)
  return i >= 0 ? args.slice(i + 1, i + 1 + n) : null
}
const PAR = opcao('--par', 2)
const MINIMO = Number(opcao('--minimo')?.[0] ?? 0)
const JSON_SAIDA = args.includes('--json')
const usados = new Set([...(PAR ?? []), ...(opcao('--minimo') ?? [])])
const entradas = args.filter((a) => !a.startsWith('--') && !usados.has(a))
const arquivos = entradas.length ? entradas : ['web/src/index.css']

// ---------- leitura do CSS, seguindo @import local ----------
const fontes = []
function ler(caminho, vistos = new Set()) {
  const abs = resolve(caminho)
  if (vistos.has(abs) || !existsSync(abs)) return
  vistos.add(abs)
  const src = readFileSync(abs, 'utf8')
  for (const m of src.matchAll(/@import\s+(?:url\()?['"]([^'"]+\.css)['"]\)?/g))
    if (!/^https?:/.test(m[1])) ler(resolve(dirname(abs), m[1]), vistos)
  fontes.push({ arquivo: relative(process.cwd(), abs), src })
}
for (const a of arquivos) ler(a)
if (!fontes.length) {
  console.error(`Nenhum CSS encontrado em: ${arquivos.join(', ')}`)
  process.exit(2)
}

/** Regras planas (o conteúdo de @media entra; @keyframes sai). Comentários de anotação ficam no corpo. */
function regras({ arquivo, src }) {
  const lista = []
  let i = 0
  const pilha = []
  let inicioSeletor = 0
  while (i < src.length) {
    if (src.startsWith('/*', i)) {
      i = src.indexOf('*/', i + 2) + 2 || src.length
      continue
    }
    const c = src[i]
    if (c === '{') {
      const cabeca = src.slice(inicioSeletor, i).replace(/\/\*[\s\S]*?\*\//g, '').trim()
      if (/^@keyframes|^@font-face/.test(cabeca)) {
        let prof = 1
        let j = i + 1
        while (j < src.length && prof) {
          if (src[j] === '{') prof++
          else if (src[j] === '}') prof--
          j++
        }
        i = j
        inicioSeletor = i
        continue
      }
      if (cabeca.startsWith('@')) {
        pilha.push(cabeca)
        i++
        inicioSeletor = i
        continue
      }
      const fim = src.indexOf('}', i)
      lista.push({ arquivo, seletor: cabeca.replace(/\s+/g, ' '), corpo: src.slice(i + 1, fim), linha: src.slice(0, i).split('\n').length, media: pilha.join(' ') })
      i = fim + 1
      inicioSeletor = i
      continue
    }
    if (c === '}') {
      pilha.pop()
      inicioSeletor = i + 1
    }
    // `@import …;` e afins no nível de cima terminam aqui, e não podem virar parte do próximo seletor.
    if (c === ';') inicioSeletor = i + 1
    i++
  }
  return lista
}
const todas = fontes.flatMap(regras)

const declaracoes = (corpo) => {
  const d = {}
  for (const m of corpo.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([\w-]+)\s*:\s*([^;]+)/g)) d[m[1].trim()] = m[2].trim()
  return d
}

// ---------- temas: :root é a base; `html[...]`/`:root[...]`/`html.x` que só redefinem token são temas ----------
const base = {}
const temas = {}
for (const r of todas) {
  const d = declaracoes(r.corpo)
  const props = Object.entries(d).filter(([k]) => k.startsWith('--'))
  if (!props.length) continue
  if (r.seletor === ':root' && !r.media) Object.assign(base, Object.fromEntries(props))
  else if (/^(html|:root)[[.]/.test(r.seletor)) Object.assign((temas[r.seletor] ??= {}), Object.fromEntries(props))
}
const listaTemas = [['padrão', base], ...Object.entries(temas).map(([sel, props]) => [sel, { ...base, ...props }])]

// ---------- cores ----------
const NOMES = { white: '#ffffff', black: '#000000' }
class ForaDaConta extends Error {}
function resolverVar(valor, vars, prof = 0) {
  if (prof > 20) throw new ForaDaConta('var() circular')
  return valor.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, nome, reserva) => {
    if (vars[nome] !== undefined) return resolverVar(vars[nome], vars, prof + 1)
    if (reserva !== undefined) return resolverVar(reserva.trim(), vars, prof + 1)
    throw new ForaDaConta(`token ${nome} não existe`)
  })
}
function rgb(valor, vars) {
  let v = resolverVar(valor, vars).trim().toLowerCase()
  if (/gradient|url\(/.test(v)) throw new ForaDaConta('gradiente ou imagem')
  if (/color-mix|currentcolor|inherit|initial|unset|revert/.test(v)) throw new ForaDaConta(`valor relativo (${v.slice(0, 30)})`)
  if (v === 'transparent' || v === 'none') throw new ForaDaConta('transparente')
  v = NOMES[v] ?? v
  let m = v.match(/#([0-9a-f]{3,8})\b/)
  if (m) {
    let h = m[1]
    if (h.length <= 4) h = [...h].map((c) => c + c).join('')
    if (h.length === 8 && parseInt(h.slice(6), 16) < 255) throw new ForaDaConta('translúcido (alfa)')
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  }
  m = v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/)
  if (m) {
    if (m[4] !== undefined && parseFloat(m[4]) < (m[4].endsWith('%') ? 100 : 1)) throw new ForaDaConta('translúcido (alfa)')
    return [m[1], m[2], m[3]].map(Number)
  }
  throw new ForaDaConta(`cor não reconhecida (${v.slice(0, 30)})`)
}
const hex = (c) => '#' + c.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()
function luminancia([r, g, b]) {
  const canal = (n) => {
    const c = n / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}
function razao(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
/** A cor de fundo de um `background:` só quando ele é uma cor lisa. */
function corDoFundo(d) {
  if (d['background-color']) return d['background-color']
  const bg = d.background
  if (!bg) return undefined
  if (/gradient|url\(/.test(bg)) return bg
  return bg.match(/var\([^)]*\)|#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(white|black|transparent)\b/)?.[0] ?? bg
}
const corDaBorda = (d) => d['border-color'] ?? d.border?.match(/var\([^)]*\)|#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(white|black)\b/)?.[0]
const corDoContorno = (d) => d['outline-color'] ?? d.outline?.match(/var\([^)]*\)|#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(white|black)\b/)?.[0]

function pixels(valor, vars) {
  if (!valor) return null
  let v
  try {
    v = resolverVar(valor, vars)
  } catch {
    return null
  }
  const clamp = v.match(/clamp\(\s*([^,]+),/)
  if (clamp) v = clamp[1]
  const m = v.match(/([\d.]+)(px|rem|em)/)
  return m ? Number(m[1]) * (m[2] === 'px' ? 1 : 16) : null
}
function textoGrande(d, vars) {
  const px = pixels(d['font-size'], vars)
  const negrito = /^(bold|bolder|[7-9]00)$/.test((d['font-weight'] ?? '').trim())
  return px !== null && (px >= 24 || (px >= 18.66 && negrito))
}

// ---------- par avulso ----------
if (PAR) {
  const [a, b] = PAR.map((v) => (v.startsWith('--') ? `var(${v})` : v))
  for (const [nome, vars] of listaTemas) {
    try {
      const r = razao(rgb(a, vars), rgb(b, vars))
      const nota = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'só texto grande / não-texto' : 'reprova'
      console.log(`${nome.padEnd(32)} ${hex(rgb(a, vars))} × ${hex(rgb(b, vars))}  ${r.toFixed(2)}:1  ${nota}`)
    } catch (e) {
      console.log(`${nome.padEnd(32)} fora da conta: ${e.message}`)
    }
  }
  process.exit(0)
}

// ---------- medição ----------
const CONTROLE = /(^|[\s>+~,])(button|input|select|textarea)\b|\.botao\b|\.chip\b|\.campo\b|\[role=/
/** `.botao--secundario` herda a borda de `.botao` (BEM): a borda da regra-base conta para o modificador. */
const bordaDaBase = (seletor, vars) => {
  const m = seletor.match(/^(\.[\w-]+?)--[\w-]+$/)
  if (!m) return undefined
  const baseRegra = todas.find((r) => r.seletor === m[1] || r.seletor.split(',').map((p) => p.trim()).includes(m[1]))
  return baseRegra && corDaBorda(declaracoes(baseRegra.corpo))
}
const resultados = []
const foraDaConta = []
const dispensados = []

for (const [tema, vars] of listaTemas) {
  const corpo = todas.find((r) => r.seletor === 'body')
  const db = corpo ? declaracoes(corpo.corpo) : {}
  let fundoPagina, textoPagina
  try {
    fundoPagina = rgb(corDoFundo(db) ?? '#ffffff', vars)
    textoPagina = rgb(db.color ?? '#000000', vars)
  } catch (e) {
    foraDaConta.push({ tema, onde: 'body', motivo: e.message })
    continue
  }
  const alto = tema !== 'padrão'
  const minimoTexto = (grande) => Math.max(MINIMO || 0, alto ? (grande ? 4.5 : 7) : grande ? 3 : 4.5)
  const fundosVistos = new Map()

  for (const r of todas) {
    if (/^(html|:root)/.test(r.seletor) && !/\s/.test(r.seletor)) continue
    const ignorar = r.corpo.match(/contraste:\s*ignorar\s*([^*]*)\*\//)
    if (ignorar) {
      if (tema === 'padrão') dispensados.push({ onde: `${r.arquivo}:${r.linha} ${r.seletor}`, motivo: ignorar[1].trim() || '(sem motivo: escreva um)' })
      continue
    }
    const d = declaracoes(r.corpo)
    const anotado = r.corpo.match(/contraste-fundo:\s*([^*]+?)\s*\*\//)?.[1]
    const onde = `${r.arquivo}:${r.linha}`
    const medir = (tipo, frente, fundo, minimo, origem) => {
      try {
        const [cf, cb] = [rgb(frente, vars), rgb(fundo, vars)]
        const v = razao(cf, cb)
        resultados.push({ tema, tipo, seletor: r.seletor, onde, frente: hex(cf), fundo: hex(cb), razao: v, minimo, passa: v >= minimo, origem, media: r.media })
      } catch (e) {
        if (e instanceof ForaDaConta) foraDaConta.push({ tema, onde: `${onde} ${r.seletor}`, tipo, motivo: e.message })
        else throw e
      }
    }

    const bg = anotado ?? corDoFundo(d)
    if (bg && !/gradient|url\(/.test(bg))
      try {
        fundosVistos.set(hex(rgb(bg, vars)), r.seletor)
      } catch {}
    const grande = textoGrande(d, vars)
    const pagina = hex(fundoPagina)
    if (d.color) medir(grande ? 'texto grande' : 'texto', d.color, bg ?? pagina, minimoTexto(grande), bg ? (anotado ? 'fundo anotado' : 'mesma regra') : 'fundo presumido: o da página')
    else if (bg && !/^\s*(transparent|none)\s*$/.test(bg)) medir(grande ? 'texto grande' : 'texto', hex(textoPagina), bg, minimoTexto(grande), 'texto presumido: o herdado do body')

    // 1.4.11: o controle tem que se separar do fundo por borda OU pelo próprio fundo.
    if (CONTROLE.test(r.seletor) && !/:focus|:hover|:active|:disabled|\[disabled\]|\[aria-disabled/.test(r.seletor)) {
      const borda = corDaBorda(d) ?? bordaDaBase(r.seletor, vars)
      const candidatos = [borda, bg].filter((x) => x && !/^\s*(transparent|none|0)\s*$/.test(x))
      if (candidatos.length) {
        const medidas = candidatos.flatMap((c) => {
          try {
            return [{ c, v: razao(rgb(c, vars), fundoPagina) }]
          } catch (e) {
            foraDaConta.push({ tema, onde: `${onde} ${r.seletor}`, tipo: 'contorno de controle', motivo: e.message })
            return []
          }
        })
        if (medidas.length) {
          const melhor = medidas.sort((a, b) => b.v - a.v)[0]
          resultados.push({ tema, tipo: 'contorno de controle', seletor: r.seletor, onde, frente: hex(rgb(melhor.c, vars)), fundo: pagina, razao: melhor.v, minimo: 3, passa: melhor.v >= 3, origem: 'borda ou fundo × página', media: r.media })
        }
      }
    }

    // 2.4.7 + 1.4.11: o anel de foco precisa aparecer sobre a página.
    if (/:focus/.test(r.seletor) && corDoContorno(d)) medir('anel de foco', corDoContorno(d), pagina, 3, 'contorno × página')
  }

  // O anel de foco passa por cima dos outros fundos também (cartão, faixa, botão vizinho).
  for (const r of todas.filter((x) => /:focus/.test(x.seletor))) {
    const c = corDoContorno(declaracoes(r.corpo))
    if (!c) continue
    try {
      const anel = rgb(c, vars)
      for (const [fundo, seletor] of fundosVistos) {
        const v = razao(anel, rgb(fundo, vars))
        if (v < 3) resultados.push({ tema, tipo: 'anel de foco sobre outro fundo', seletor: `${r.seletor} sobre ${seletor}`, onde: `${r.arquivo}:${r.linha}`, frente: hex(anel), fundo, razao: v, minimo: 3, passa: false, origem: 'aviso: só falha se o controle focável fica sobre esse fundo', aviso: true })
      }
    } catch {}
  }
}

const falhas = resultados.filter((r) => !r.passa && !r.aviso)
const avisosFoco = resultados.filter((r) => r.aviso)

if (JSON_SAIDA) {
  console.log(JSON.stringify({ temas: listaTemas.map(([n]) => n), medidos: resultados.length, falhas, avisos: avisosFoco, foraDaConta, dispensados }, null, 2))
  process.exit(falhas.length ? 1 : 0)
}

const fmt = (r) => `| \`${r.seletor.slice(0, 60)}\` | ${r.onde} | ${r.tipo} | ${r.frente} × ${r.fundo} | **${r.razao.toFixed(2)}:1** | ${r.minimo}:1 | ${r.origem}${r.media ? ` · ${r.media}` : ''} |`
console.log(`# Contraste WCAG · temas: ${listaTemas.map(([n]) => n).join(', ')}\n`)
for (const [tema] of listaTemas) {
  const doTema = falhas.filter((f) => f.tema === tema)
  const medidos = resultados.filter((r) => r.tema === tema && !r.aviso).length
  console.log(`## ${tema}: ${medidos} pares medidos, ${doTema.length} reprovados\n`)
  const presumido = (r) => r.origem.includes('presumido')
  for (const [titulo, grupo] of [
    ['Reprovados com o par declarado (defeito)', doTema.filter((r) => !presumido(r))],
    ['Reprovados com par presumido (corrija, ou anote o fundo real e meça de novo)', doTema.filter(presumido)],
  ]) {
    if (!grupo.length) continue
    console.log(`### ${titulo}\n\n| Seletor | Onde | Tipo | Par | Razão | Mínimo | Como foi pareado |\n|---|---|---|---|---|---|---|`)
    grupo.sort((a, b) => a.razao - b.razao).forEach((r) => console.log(fmt(r)))
    console.log()
  }
}
if (avisosFoco.length) {
  console.log(`## Anel de foco que some sobre algum fundo (${avisosFoco.length})\n`)
  console.log('Só é falha se um controle focável fica sobre esse fundo. Confira com Tab.\n')
  const unicos = [...new Map(avisosFoco.map((a) => [`${a.tema}|${a.fundo}`, a])).values()]
  unicos.forEach((a) => console.log(`- ${a.tema}: anel ${a.frente} sobre ${a.fundo} (\`${a.seletor.split(' sobre ')[1]}\`) = ${a.razao.toFixed(2)}:1`))
  console.log()
}
if (dispensados.length) {
  console.log(`## Dispensados por anotação (${dispensados.length})\n`)
  dispensados.forEach((d) => console.log(`- ${d.onde}: ${d.motivo}`))
  console.log()
}
const motivos = {}
for (const f of foraDaConta) motivos[f.motivo.replace(/\(.*\)/, '').trim()] = (motivos[f.motivo.replace(/\(.*\)/, '').trim()] ?? 0) + 1
console.log(`**Fora da conta: ${foraDaConta.length}** (${Object.entries(motivos).map(([m, n]) => `${n} ${m}`).join(', ') || 'nenhum'}). Não foram medidos: confira à mão ou anote o fundo real com \`/* contraste-fundo: … */\`.`)
console.log(`**${falhas.length} reprovado(s)** em ${resultados.filter((r) => !r.aviso).length} pares. Par "presumido" usa o fundo da página; se o fundo real é outro, anote e meça de novo.`)
if (JSON_SAIDA === false && foraDaConta.length) {
  console.log('\n<details><summary>Lista do fora da conta</summary>\n')
  foraDaConta.forEach((f) => console.log(`- ${f.tema} · ${f.onde}${f.tipo ? ` (${f.tipo})` : ''}: ${f.motivo}`))
  console.log('\n</details>')
}
process.exit(falhas.length ? 1 : 0)
