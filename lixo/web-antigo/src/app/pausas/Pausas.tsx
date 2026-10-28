/**
 * Pausas pra cabeça: três minijogos calmos para distração ativa.
 * Regras de design (edital 8.4, docs/02-produto/matriz-conceito-funcionalidade.md):
 *   sem pontuação, sem cronômetro, sem sorte, sem moedas, sem efeito de vitória; nada sai do aparelho.
 * Fica fora do fluxo do SOS (spec 003 exclui minigames do SOS) e é aberto pela tela inicial.
 * REVISÃO CLÍNICA PENDENTE dos textos (web/src/content/pausas.json).
 */
import { useState } from 'react'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { conteudoPausas } from '@/content/conteudo'
import { formatarReais } from '@/domain/progresso'

type Jogo = 'aterramento' | 'pensamentos' | 'contas'

interface PausasProps {
  aoVoltar: () => void
}

export function Pausas({ aoVoltar }: PausasProps) {
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const voltarAoMenu = () => setJogo(null)

  if (jogo === 'aterramento') return <Aterramento aoTerminar={voltarAoMenu} />
  if (jogo === 'pensamentos') return <PensamentoOuFato aoTerminar={voltarAoMenu} />
  if (jogo === 'contas') return <ArrumaOMes aoTerminar={voltarAoMenu} />

  const jogos: Jogo[] = ['aterramento', 'pensamentos', 'contas']
  return (
    <section className="tela" aria-labelledby="pausas-titulo">
      <h1 id="pausas-titulo">{conteudoPausas.titulo}</h1>
      <p className="tela__lead">{conteudoPausas.lead}</p>
      {jogos.map((id) => (
        <Cartao key={id} titulo={conteudoPausas[id].nome}>
          <p>{conteudoPausas[id].descricao}</p>
          <Botao onClick={() => setJogo(id)}>Começar</Botao>
        </Cartao>
      ))}
      <Botao variante="secundario" onClick={aoVoltar}>
        Voltar pro início
      </Botao>
    </section>
  )
}

interface JogoProps {
  aoTerminar: () => void
}

function Fim({ texto, fonte, aoTerminar }: { texto: string; fonte: string; aoTerminar: () => void }) {
  return (
    <div className="pilha">
      <p role="status">{texto}</p>
      {fonte && <p className="nota">{fonte}</p>}
      <Botao onClick={aoTerminar}>Voltar pras pausas</Botao>
    </div>
  )
}

/** 1) 5 sentidos: aterramento 5-4-3-2-1. A pessoa marca cada coisa que notou; não há tempo nem erro. */
export function Aterramento({ aoTerminar }: JogoProps) {
  const { passos, fim, fonte, nome } = conteudoPausas.aterramento
  const [indice, setIndice] = useState(0)
  const [notados, setNotados] = useState(0)
  const passo = passos[indice]

  const notei = () => {
    if (notados + 1 < passo.quantidade) return setNotados(notados + 1)
    setNotados(0)
    setIndice(indice + 1)
  }

  return (
    <section className="tela" aria-labelledby="aterramento-titulo">
      <h1 id="aterramento-titulo">{nome}</h1>
      {!passo ? (
        <Fim texto={fim} fonte={fonte} aoTerminar={aoTerminar} />
      ) : (
        <div className="pilha">
          <p className="pausa__pedido">{passo.pedido}</p>
          <ol className="pausa__pontos" aria-label={`${notados} de ${passo.quantidade} notados`}>
            {Array.from({ length: passo.quantidade }, (_, i) => (
              <li key={i} className={i < notados ? 'pausa__ponto pausa__ponto--feito' : 'pausa__ponto'} />
            ))}
          </ol>
          <Botao grande onClick={notei}>
            Notei {notados + 1 === 1 ? 'uma' : 'mais uma'}
          </Botao>
          <Botao variante="secundario" onClick={aoTerminar}>
            Parar por aqui
          </Botao>
        </div>
      )}
    </section>
  )
}

/** 2) Pensamento ou fato?: escolher a leitura realista de frases típicas da vontade. Sem acerto/erro contado. */
export function PensamentoOuFato({ aoTerminar }: JogoProps) {
  const { cartas, fim, fonte, nome } = conteudoPausas.pensamentos
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState<number | null>(null)
  const carta = cartas[indice]

  const proxima = () => {
    setEscolha(null)
    setIndice(indice + 1)
  }

  return (
    <section className="tela" aria-labelledby="pensamentos-titulo">
      <h1 id="pensamentos-titulo">{nome}</h1>
      {!carta ? (
        <Fim texto={fim} fonte={fonte} aoTerminar={aoTerminar} />
      ) : (
        <div className="pilha">
          <p className="nota">
            Frase {indice + 1} de {cartas.length}
          </p>
          <blockquote className="cartao__pensamento">“{carta.frase}”</blockquote>
          <div className="pilha" role="group" aria-label="Qual leitura parece mais realista?">
            {carta.opcoes.map((opcao, i) => (
              <Botao
                key={opcao}
                variante="secundario"
                aria-pressed={escolha === i}
                disabled={escolha !== null}
                onClick={() => setEscolha(i)}
              >
                {opcao}
              </Botao>
            ))}
          </div>
          {/* Retorno igual para as duas escolhas: explica, não julga. */}
          <div role="status">
            {escolha !== null && (
              <>
                <p>
                  {escolha === carta.realista
                    ? 'Isso. Essa é a leitura mais próxima da realidade.'
                    : 'Essa frase é bem comum, e faz sentido ela aparecer. Olha a outra leitura:'}{' '}
                  <strong>{carta.opcoes[carta.realista]}</strong>
                </p>
                <p>{carta.explicacao}</p>
              </>
            )}
          </div>
          {escolha !== null && <Botao onClick={proxima}>Próxima</Botao>}
        </div>
      )}
    </section>
  )
}

type Categoria = (typeof conteudoPausas.contas.categorias)[number]['id']

/** 3) Arruma o mês: classificar gastos de um orçamento sintético. A pessoa decide; o app só sugere. */
export function ArrumaOMes({ aoTerminar }: JogoProps) {
  const { itens, categorias, renda, fim, fonte, nome } = conteudoPausas.contas
  const [escolhas, setEscolhas] = useState<Record<string, Categoria>>({})
  const [pronto, setPronto] = useState(false)
  const pendente = itens.find((item) => !escolhas[item.id])

  const total = (cat: string) =>
    itens.filter((item) => escolhas[item.id] === cat).reduce((soma, item) => soma + item.valor, 0)
  const sobra = renda - total('essencial') - total('divida')

  return (
    <section className="tela" aria-labelledby="contas-titulo">
      <h1 id="contas-titulo">{nome}</h1>
      {fonte && <p className="nota">{fonte}</p>}
      {pronto ? (
        <>
          <Cartao titulo="Seu mês de exemplo">
            <ul className="pausa__resumo">
              {categorias.map((cat) => (
                <li key={cat.id}>
                  {cat.nome}: <strong>{formatarReais(total(cat.id))}</strong>
                </li>
              ))}
            </ul>
            <p>
              Com renda de {formatarReais(renda)}, depois do essencial e das dívidas sobram{' '}
              <strong>{formatarReais(sobra)}</strong>.
            </p>
            {itens
              .filter((item) => escolhas[item.id] !== item.sugerida)
              .map((item) => (
                <p key={item.id} className="nota">
                  Você pôs “{item.nome}” em {categorias.find((c) => c.id === escolhas[item.id])?.nome}. Muita gente
                  colocaria em {categorias.find((c) => c.id === item.sugerida)?.nome}, e tudo bem pensar diferente.
                </p>
              ))}
          </Cartao>
          <Fim texto={fim} fonte="" aoTerminar={aoTerminar} />
        </>
      ) : pendente ? (
        <div className="pilha">
          <p className="pausa__pedido">
            {pendente.nome}: <strong>{formatarReais(pendente.valor)}</strong>
          </p>
          <div className="pilha" role="group" aria-label={`Onde entra ${pendente.nome}?`}>
            {categorias.map((cat) => (
              <Botao
                key={cat.id}
                variante="secundario"
                onClick={() => setEscolhas({ ...escolhas, [pendente.id]: cat.id })}
              >
                {cat.nome} <span className="nota">· {cat.dica}</span>
              </Botao>
            ))}
          </div>
          <p className="nota">
            {Object.keys(escolhas).length} de {itens.length} organizados
          </p>
        </div>
      ) : (
        <Botao onClick={() => setPronto(true)}>Ver como ficou</Botao>
      )}
    </section>
  )
}
