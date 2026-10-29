#!/usr/bin/env node
// Auditoria estática de acessibilidade (WCAG 2.2) do web: TSX, HTML e CSS.
// Pega o que dá para pegar lendo o código; o resto é o teste manual de references/teste-manual.md.
// Sai com código 1 quando há BLOQUEIO, para poder entrar no CI ou num teste.
//
// Uso: node .claude/skills/acessibilidade-wcag/scripts/auditar.mjs [caminhos...] [--json] [--so-bloqueios]
//   caminhos: arquivos ou pastas (padrão: web/src e web/index.html)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname, sep } from 'node:path'

const args = process.argv.slice(2)
const JSON_SAIDA = args.includes('--json')
const SO_BLOQUEIOS = args.includes('--so-bloqueios')
const alvos = args.filter((a) => !a.startsWith('--'))
const raizes = alvos.length ? alvos : ['web/src', 'web/index.html']
const PROJETO = `projeto (${raizes.join(', ')})`

const IGNORAR = /(^|[\\/])(node_modules|dist|coverage)([\\/]|$)|\.(test|spec)\.[jt]sx?$/
function arquivos(caminho) {
  if (!existsSync(caminho) || IGNORAR.test(caminho)) return []
  if (statSync(caminho).isFile()) return [caminho]
  return readdirSync(caminho).flatMap((n) => arquivos(join(caminho, n)))
}
const todos = raizes.flatMap(arquivos).filter((f) => ['.tsx', '.jsx', '.html', '.css'].includes(extname(f)))

const achados = []
const achar = (gravidade, arquivo, linha, sc, mensagem) =>
  achados.push({ gravidade, arquivo: relative(process.cwd(), arquivo), linha, sc, mensagem })
const BLOQ = 'bloqueio'
const AVISO = 'aviso'

const linhaDe = (src, i) => src.slice(0, i).split('\n').length

/** Tags JSX/HTML com os atributos inteiros, respeitando `{}` e aspas (um `=>` no atributo não fecha a tag). */
function tags(src, nomes) {
  const re = new RegExp(`<(${nomes})(?=[\\s/>])`, 'g')
  const lista = []
  for (const m of src.matchAll(re)) {
    let i = m.index + m[0].length
    let prof = 0
    let aspa = null
    for (; i < src.length; i++) {
      const c = src[i]
      if (aspa) {
        if (c === '\\') i++
        else if (c === aspa) aspa = null
        continue
      }
      if (c === '"' || c === "'" || (c === '`' && prof > 0)) aspa = c
      else if (c === '{') prof++
      else if (c === '}') prof--
      else if (c === '>' && prof === 0) break
    }
    const attrs = src.slice(m.index + m[0].length, i)
    lista.push({ nome: m[1], attrs, inicio: m.index, fim: i, autoFecha: attrs.trimEnd().endsWith('/'), linha: linhaDe(src, m.index) })
  }
  return lista
}
const tem = (attrs, nome) => new RegExp(`(^|\\s)${nome}(?=[\\s=/>]|$)`).test(attrs)
function valor(attrs, nome) {
  const m = attrs.match(new RegExp(`(?:^|\\s)${nome}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{([^}]*)\\})`))
  return m ? (m[1] ?? m[2] ?? m[3]).trim() : undefined
}
const literal = (v) => v?.replace(/^['"`]|['"`]$/g, '')
const verdadeiro = (attrs, nome) => ['true', '"true"'].includes(valor(attrs, nome) ?? '') || /aria-hidden(?=[\s/>]|$)/.test(attrs) && nome === 'aria-hidden'

function auditarTsx(arq, src) {
  const ehTela = arq.split(sep).includes('app') || /[\\/]app[\\/]/.test(arq)
  const htmlFor = new Set([...src.matchAll(/htmlFor\s*=\s*(?:"([^"]+)"|\{\s*['"`]([^'"`]+)['"`]\s*\})/g)].map((m) => m[1] ?? m[2]))
  const idsLiterais = [...src.matchAll(/\bid\s*=\s*(?:"([^"]+)"|\{\s*['"`]([^'"`$]+)['"`]\s*\})/g)].map((m) => m[1] ?? m[2])

  for (const t of tags(src, 'img'))
    if (!tem(t.attrs, 'alt')) achar(BLOQ, arq, t.linha, '1.1.1', '<img> sem `alt`. Decorativa: `alt=""`. Informativa: o que ela comunica.')

  // Um ancestral com aria-hidden no mesmo arquivo já esconde o desenho.
  const escondidos = tags(src, '[A-Za-z][\\w.]*')
    .filter((t) => tem(t.attrs, 'aria-hidden') && !t.autoFecha)
    .map((t) => [t.inicio, src.indexOf(`</${t.nome}>`, t.fim)])
  const svgsSemNome = tags(src, 'svg').filter(
    (t) =>
      !/aria-hidden|aria-label|aria-labelledby|role\s*=\s*["{]?['"]?(img|presentation|none)/.test(t.attrs) &&
      !escondidos.some(([ini, fim]) => ini < t.inicio && fim > t.inicio),
  )
  if (svgsSemNome.length)
    achar(AVISO, arq, svgsSemNome[0].linha, '1.1.1', `${svgsSemNome.length} <svg> sem \`aria-hidden\` nem nome (linhas ${svgsSemNome.map((t) => t.linha).join(', ')}). Confirme que um ancestral tem \`aria-hidden="true"\`; se o desenho informa algo, \`role="img"\` + \`aria-label\`.`)

  for (const t of tags(src, 'div|span|li|p|img|section|article|td|tr|svg|i|header|footer|main|ul'))
    if (tem(t.attrs, 'onClick')) {
      const papel = valor(t.attrs, 'role')
      if (!papel) achar(BLOQ, arq, t.linha, '2.1.1 · 4.1.2', `<${t.nome}> clicável não é controle: teclado e leitor de tela não chegam nele. Use <button>.`)
      else if (!tem(t.attrs, 'onKeyDown') && !tem(t.attrs, 'onKeyUp')) achar(BLOQ, arq, t.linha, '2.1.1', `<${t.nome} role=${papel}> sem tratar Enter/Espaço. Use <button>.`)
      else if (!tem(t.attrs, 'tabIndex')) achar(BLOQ, arq, t.linha, '2.1.1', `<${t.nome} role=${papel}> sem \`tabIndex={0}\`: o Tab não para nele.`)
    }

  for (const m of src.matchAll(/tabIndex\s*=\s*(?:\{\s*([1-9]\d*)\s*\}|"([1-9]\d*)")/g))
    achar(BLOQ, arq, linhaDe(src, m.index), '2.4.3', '`tabIndex` positivo embaralha a ordem do foco. Use 0 ou -1 e acerte a ordem no DOM.')

  for (const t of tags(src, 'input|textarea|select')) {
    const tipo = literal(valor(t.attrs, 'type'))
    if (['hidden', 'submit', 'button', 'reset', 'image'].includes(tipo)) continue
    if (tem(t.attrs, 'aria-label') || tem(t.attrs, 'aria-labelledby')) continue
    const id = valor(t.attrs, 'id')
    const idLit = id && !/[{}$]/.test(literal(id)) ? literal(id) : null
    const abreLabel = src.lastIndexOf('<label', t.inicio)
    const dentroDeLabel = abreLabel >= 0 && src.lastIndexOf('</label>', t.inicio) < abreLabel
    if (dentroDeLabel || (idLit && htmlFor.has(idLit))) continue
    if (id && !idLit) achar(AVISO, arq, t.linha, '1.3.1 · 3.3.2', `<${t.nome}> com \`id\` dinâmico: confira que existe <label htmlFor> para ele.`)
    else achar(BLOQ, arq, t.linha, '1.3.1 · 3.3.2 · 4.1.2', `<${t.nome}> sem rótulo: falta <label htmlFor="${idLit ?? '…'}">.${tem(t.attrs, 'placeholder') ? ' Placeholder não é rótulo: some ao digitar.' : ''}`)
  }

  for (const t of tags(src, 'button')) {
    if (t.autoFecha || tem(t.attrs, 'aria-label') || tem(t.attrs, 'aria-labelledby')) continue
    const fim = src.indexOf('</button>', t.fim)
    if (fim < 0) continue
    const dentro = src.slice(t.fim + 1, fim).replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    const texto = dentro.replace(/<[^>]*>/g, '').trim()
    if (!texto) achar(BLOQ, arq, t.linha, '4.1.2 · 2.5.3', '<button> sem texto nem `aria-label`: o leitor de tela anuncia só "botão".')
    else if (/^\{[^}]*\}$/.test(texto) && /<(svg|Icone|Animacao|img)\b/.test(dentro)) achar(AVISO, arq, t.linha, '4.1.2', '<button> com ícone e texto só por expressão: confirme que a expressão nunca é vazia.')
  }

  for (const t of tags(src, 'button|a|input|select|textarea|Botao'))
    if (verdadeiro(t.attrs, 'aria-hidden')) achar(BLOQ, arq, t.linha, '4.1.2', `<${t.nome}> com \`aria-hidden\` continua focável: o leitor cai num controle mudo.`)

  for (const t of tags(src, 'a')) {
    const href = valor(t.attrs, 'href')
    if (!href && tem(t.attrs, 'onClick')) achar(BLOQ, arq, t.linha, '2.1.1 · 4.1.2', '<a> sem `href` com `onClick` não é link nem botão. Ação é <button>; navegação é <a href>.')
    else if (literal(href) === '#') achar(AVISO, arq, t.linha, '2.4.4', '<a href="#"> não leva a lugar nenhum. Se é ação, use <button>.')
    if (literal(valor(t.attrs, 'target')) === '_blank') achar(AVISO, arq, t.linha, '3.2.5', 'Link abre em nova aba: diga isso no texto ("abre em outra aba") ou não abra.')
  }

  for (const t of tags(src, '[A-Za-z][\\w.]*')) {
    const a = t.attrs
    if (tem(a, 'autoFocus')) achar(AVISO, arq, t.linha, '2.4.3 · 3.2.1', '`autoFocus` pula o contexto para quem usa leitor de tela. Foco programático só no título da tela nova.')
    if (literal(valor(a, 'aria-live')) === 'assertive' || literal(valor(a, 'role')) === 'alert')
      achar(AVISO, arq, t.linha, '4.1.3', '`assertive`/`alert` interrompe o leitor. Reserve para risco e crise; o resto é `role="status"`.')
    if (literal(valor(a, 'role')) === 'button' && t.nome !== 'button') achar(AVISO, arq, t.linha, '4.1.2', `role="button" em <${t.nome}>: prefira <button>, que já traz teclado e foco.`)
    if (literal(valor(a, 'role')) === 'img' && !tem(a, 'aria-label') && !tem(a, 'aria-labelledby')) achar(BLOQ, arq, t.linha, '1.1.1', '`role="img"` sem `aria-label`: imagem sem nome.')
    if (tem(a, 'onPaste')) achar(BLOQ, arq, t.linha, '3.3.8', '`onPaste` em campo: bloquear colar impede gerenciador de senha e quem copia o PIN. Não bloqueie.')
    if (/(type\s*=\s*["{]?['"]?password|pin)/i.test(a) && literal(valor(a, 'autoComplete')) === 'off')
      achar(BLOQ, arq, t.linha, '3.3.8', 'PIN/senha com `autoComplete="off"`: o gerenciador não preenche. Use `current-password`/`one-time-code`.')
    if ((tem(a, 'onMouseEnter') || tem(a, 'onMouseOver')) && !tem(a, 'onFocus')) achar(BLOQ, arq, t.linha, '2.1.1 · 1.4.13', 'Comportamento no hover sem equivalente no foco do teclado.')
    if (tem(a, 'onDoubleClick')) achar(AVISO, arq, t.linha, '2.5.1', 'Duplo clique precisa de alternativa de um toque só.')
    if (tem(a, 'draggable') || tem(a, 'onDragStart')) achar(AVISO, arq, t.linha, '2.5.7', 'Arrastar precisa de alternativa sem arrasto (botões).')
    if (tem(a, 'accessKey')) achar(AVISO, arq, t.linha, '2.1.4', '`accessKey` colide com atalhos do leitor de tela.')
  }

  for (const t of tags(src, 'video')) {
    const fim = src.indexOf('</video>', t.fim)
    if (!/<track[^>]*kind=["']?(captions|subtitles)/.test(src.slice(t.fim, fim < 0 ? t.fim : fim))) achar(BLOQ, arq, t.linha, '1.2.2', '<video> sem legenda (`<track kind="captions">`).')
  }
  for (const t of tags(src, 'video|audio'))
    if (tem(t.attrs, 'autoPlay') && !tem(t.attrs, 'muted')) achar(BLOQ, arq, t.linha, '1.4.2', `<${t.nome}> tocando sozinho com som.`)

  if (/devicemotion|deviceorientation/.test(src)) achar(AVISO, arq, 1, '2.5.4', 'Ação por movimento do aparelho precisa de alternativa por botão e de jeito de desligar.')

  const niveis = [...src.matchAll(/<h([1-6])\b/g)].map((m) => ({ n: Number(m[1]), linha: linhaDe(src, m.index) }))
  for (let i = 1; i < niveis.length; i++)
    if (niveis[i].n > niveis[i - 1].n + 1) achar(AVISO, arq, niveis[i].linha, '1.3.1', `Título pula de h${niveis[i - 1].n} para h${niveis[i].n}.`)
  if (ehTela && /export function [A-Z]/.test(src) && /<section|<main/.test(src) && !niveis.some((h) => h.n === 1))
    achar(BLOQ, arq, 1, '1.3.1 · 2.4.6', 'Tela sem <h1>: o leitor de tela não tem como anunciar onde a pessoa está.')

  for (const m of src.matchAll(/aria-(?:describedby|labelledby|controls)\s*=\s*"([^"]+)"/g))
    for (const ref of m[1].split(/\s+/))
      if (!idsLiterais.includes(ref)) achar(AVISO, arq, linhaDe(src, m.index), '1.3.1', `\`${ref}\` é referenciado mas não há \`id="${ref}"\` neste arquivo. Confira se existe na tela.`)
}

function auditarHtml(arq, src) {
  if (!/<html[^>]*\blang\s*=\s*["'][a-z]/i.test(src)) achar(BLOQ, arq, 1, '3.1.1', '<html> sem `lang="pt-BR"`: o leitor lê em inglês.')
  const vp = src.match(/<meta[^>]*name=["']viewport["'][^>]*>/i)?.[0] ?? ''
  if (/user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*(0?\.\d+|1(\.0+)?)\b/i.test(vp))
    achar(BLOQ, arq, linhaDe(src, src.indexOf(vp)), '1.4.4', 'Viewport impede zoom (`user-scalable=no`/`maximum-scale`).')
  if (!/<title>\s*\S/.test(src)) achar(BLOQ, arq, 1, '2.4.2', 'Página sem <title>.')
}

function regrasCss(src) {
  const regras = []
  const limpo = src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
  const re = /([^{}]+)\{([^{}]*)\}/g
  for (const m of limpo.matchAll(re)) regras.push({ seletor: m[1].trim(), corpo: m[2], linha: linhaDe(limpo, m.index + m[0].indexOf(m[1].trim())) })
  return regras
}

const usoCss = { animacoes: [], pxFonte: [], temReduzMedia: false, temForced: false, fixos: [], temScrollPadding: false }
function auditarCss(arq, src) {
  if (/@media[^{]*prefers-reduced-motion/.test(src)) usoCss.temReduzMedia = true
  if (/@media[^{]*forced-colors/.test(src)) usoCss.temForced = true
  for (const r of regrasCss(src)) {
    const s = r.seletor.replace(/\s+/g, ' ')
    if (/^(from|to|\d+%)/.test(s) || s.startsWith('@')) continue
    if (/outline\s*:\s*(none|0)\b/.test(r.corpo)) {
      const soTitulos = s.split(',').every((p) => /^\s*h[1-6]\b|tabindex=["']?-1/.test(p))
      if (/:focus(?!-within)/.test(s) && !soTitulos) achar(BLOQ, arq, r.linha, '2.4.7', `\`${s}\` tira o contorno do foco. Foco visível é obrigatório; troque por outro indicador com 3:1.`)
      else if (!soTitulos && /(button|\ba\b|input|select|textarea|\.botao|\.chip|\[role)/.test(s)) achar(AVISO, arq, r.linha, '2.4.7', `\`${s}\` zera o outline de um controle: confirme que :focus-visible devolve um indicador.`)
    }
    if (/animation\s*:[^;]*\binfinite\b/.test(r.corpo)) usoCss.animacoes.push(s)
    if (/font-size\s*:\s*\d+(\.\d+)?px/.test(r.corpo)) usoCss.pxFonte.push(`${relative(process.cwd(), arq)}:${r.linha}`)
    if (/user-select\s*:\s*none/.test(r.corpo)) achar(AVISO, arq, r.linha, '1.3.1', `\`${s}\` impede selecionar texto (atrapalha copiar telefone, ampliar, ler em voz alta).`)
    if (!/sr-only|visually-hidden/.test(s) && /white-space\s*:\s*nowrap/.test(r.corpo) && /overflow\s*:\s*hidden|text-overflow/.test(r.corpo))
      achar(AVISO, arq, r.linha, '1.4.10 · 1.4.12', `\`${s}\` corta texto numa linha só: com fonte grande ou espaçamento maior, parte do texto some.`)
    if (/:hover/.test(s) && !/:focus/.test(s) && /(display\s*:\s*(block|flex|grid|inline)|visibility\s*:\s*visible|opacity\s*:\s*1\b)/.test(r.corpo))
      achar(AVISO, arq, r.linha, '1.4.13 · 2.1.1', `\`${s}\` revela conteúdo só no hover. Inclua :focus-visible/:focus-within no mesmo seletor.`)
    if (/position\s*:\s*(fixed|sticky)/.test(r.corpo)) usoCss.fixos.push(`${relative(process.cwd(), arq)}:${r.linha} \`${s}\``)
    if (/scroll-padding/.test(r.corpo)) usoCss.temScrollPadding = true
  }
}

let fontesTsx = ''
for (const arq of todos) {
  const src = readFileSync(arq, 'utf8')
  const ext = extname(arq)
  if (ext === '.tsx' || ext === '.jsx') {
    fontesTsx += src
    auditarTsx(arq, src)
  } else if (ext === '.html') auditarHtml(arq, src)
  else if (ext === '.css') auditarCss(arq, src)
}

// Regras do projeto inteiro: só fazem sentido olhando tudo junto.
const temTsx = todos.some((f) => /\.[jt]sx$/.test(f))
const leReducaoDoSistema = /prefers-reduced-motion/.test(fontesTsx)
if (temTsx && !usoCss.temReduzMedia && !leReducaoDoSistema)
  achar(BLOQ, PROJETO, 0, '2.3.3 · 2.2.2', 'Ninguém lê `prefers-reduced-motion`: quem pediu menos movimento no aparelho recebe tudo animado. O "reduzir animações" do app precisa nascer do `matchMedia`, e o CSS precisa do `@media`.')
if (usoCss.animacoes.length)
  achar(usoCss.temReduzMedia || leReducaoDoSistema ? AVISO : BLOQ, PROJETO, 0, '2.2.2', `${usoCss.animacoes.length} animação(ões) infinita(s). Movimento que dura mais de 5 s ao lado de conteúdo precisa parar com "reduzir animações" e ter como pausar: ${usoCss.animacoes.slice(0, 6).map((a) => `\`${a}\``).join(', ')}${usoCss.animacoes.length > 6 ? '…' : ''}`)
if (temTsx && !/document\.title/.test(fontesTsx))
  achar(BLOQ, PROJETO, 0, '2.4.2', 'As rotas não mudam `document.title`: toda tela é anunciada com o mesmo nome. Cada rota precisa de título próprio ("Bateu a vontade · Guardião").')
if (usoCss.fixos.length && !usoCss.temScrollPadding)
  achar(AVISO, PROJETO, 0, '2.4.11', `Há elemento fixo (${usoCss.fixos[0]}${usoCss.fixos.length > 1 ? ` e mais ${usoCss.fixos.length - 1}` : ''}) e nenhum \`scroll-padding\`: o foco do teclado pode parar escondido atrás dele.`)
if (todos.some((f) => f.endsWith('.css')) && !usoCss.temForced)
  achar(AVISO, PROJETO, 0, '1.4.11 · 2.4.7', 'Sem `@media (forced-colors: active)`: confira no modo de alto contraste do Windows se bordas, foco e ícones continuam visíveis.')
if (usoCss.pxFonte.length)
  achar(AVISO, PROJETO, 0, '1.4.4', `${usoCss.pxFonte.length} \`font-size\` em px: não acompanha o tamanho de fonte escolhido no navegador. Prefira rem (ex.: ${usoCss.pxFonte.slice(0, 3).join(', ')}).`)

const lista = SO_BLOQUEIOS ? achados.filter((a) => a.gravidade === BLOQ) : achados
const bloqueios = achados.filter((a) => a.gravidade === BLOQ).length

if (JSON_SAIDA) {
  console.log(JSON.stringify({ arquivos: todos.length, bloqueios, avisos: achados.length - bloqueios, achados: lista }, null, 2))
} else {
  console.log(`# Auditoria de acessibilidade (WCAG 2.2) · ${todos.length} arquivos\n`)
  const porArquivo = {}
  for (const a of lista) (porArquivo[a.arquivo] ??= []).push(a)
  for (const [arq, itens] of Object.entries(porArquivo)) {
    console.log(`## ${arq}`)
    for (const a of itens.sort((x, y) => (x.gravidade === y.gravidade ? x.linha - y.linha : x.gravidade === BLOQ ? -1 : 1)))
      console.log(`- ${a.gravidade === BLOQ ? '🔴 BLOQUEIO' : '🟡 aviso'} · ${a.linha ? `linha ${a.linha} · ` : ''}SC ${a.sc} · ${a.mensagem}`)
    console.log()
  }
  console.log(`**${bloqueios} bloqueio(s), ${achados.length - bloqueios} aviso(s).** Passar aqui não é estar acessível: faltam contraste (\`contraste.mjs\`) e o teste manual.`)
}
process.exit(bloqueios ? 1 : 0)
