/**
 * Dinheiro preservado (spec 004, CA-5 e CA-6). O Open Finance é a spec 007, fora desta tela por enquanto.
 * Skills: controle-estimulos-financas · design-etico-saude-digital.
 * O valor é sempre estimativa, a partir do que a pessoa informou (CDC); nada vem de conta real.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Botao } from '@/components/Botao'
import { metasConfirmadas } from '@/content/conteudo'
import { dataPorExtenso } from '@/domain/datas'
import { emMetas, formatarReais } from '@/domain/progresso'
import { useProgresso } from '@/hooks/useProgresso'

interface DinheiroProps {
  aoVoltar: () => void
  hoje?: string
}

const LIMITE_SEMANAL = 100_000

function lerValor(texto: string): number | null {
  const numero = Number(texto.replace(/\./g, '').replace(',', '.').trim())
  return Number.isFinite(numero) && numero > 0 && numero <= LIMITE_SEMANAL ? numero : null
}

export function Dinheiro({ aoVoltar, hoje }: DinheiroProps) {
  const { estado, progresso, gastoSemanal, meta, salvarFinancas, hoje: dia } = useProgresso(hoje)
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState('')
  const [textoMeta, setTextoMeta] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [visao, setVisao] = useState<'reais' | 'metas'>('reais')
  const titulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => titulo.current?.focus(), [])

  const desde = progresso.inicio && dataPorExtenso(progresso.inicio, dia)
  const pedindoValor = estado === 'pronto' && (gastoSemanal === null || editando)

  const salvar = (evento: FormEvent) => {
    evento.preventDefault()
    const valor = lerValor(texto)
    if (valor === null) {
      setErro('Digite um valor em reais maior que zero, por exemplo 50 ou 120,50.')
      return
    }
    setErro(null)
    setEditando(false)
    salvarFinancas({ gastoSemanalEstimado: valor, meta: textoMeta.trim() || null })
  }

  const valor = progresso.dinheiroPreservado
  const metas = valor === null ? [] : emMetas(valor, metasConfirmadas)

  return (
    <section className="tela tela--dinheiro" aria-labelledby="dinheiro-titulo">
      <h1 id="dinheiro-titulo" ref={titulo} tabIndex={-1}>
        Dinheiro preservado
      </h1>

      {estado === 'carregando' && (
        <div className="esqueleto esqueleto--valor" role="status" aria-label="Carregando sua estimativa" />
      )}

      {pedindoValor && (
        <form className="pilha" onSubmit={salvar} noValidate>
          {gastoSemanal === null && <p className="tela__lead">Quer ver quanto você preservou?</p>}
          <label htmlFor="gasto-semanal">Quanto você costumava gastar com apostas por semana?</label>
          <p className="nota" id="gasto-dica">
            É só para a estimativa. O valor fica guardado neste celular.
          </p>
          <input
            id="gasto-semanal"
            className="campo"
            inputMode="decimal"
            autoComplete="off"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-describedby={erro ? 'gasto-dica gasto-erro' : 'gasto-dica'}
            aria-invalid={erro ? true : undefined}
          />
          {erro && (
            <p id="gasto-erro" className="campo__erro">
              {erro}
            </p>
          )}
          <label htmlFor="meta">Pra onde você quer levar esse dinheiro?</label>
          <p className="nota" id="meta-dica">
            Se quiser. Por exemplo: conta de luz, compras da semana.
          </p>
          <input
            id="meta"
            className="campo"
            autoComplete="off"
            maxLength={60}
            value={textoMeta}
            onChange={(e) => setTextoMeta(e.target.value)}
            aria-describedby="meta-dica"
          />
          <Botao type="submit">Salvar</Botao>
        </form>
      )}

      {estado === 'pronto' && !pedindoValor && valor !== null && (
        <>
          {metasConfirmadas.length > 0 && (
            <div className="linha" role="group" aria-label="Mostrar em">
              <Botao variante="secundario" aria-pressed={visao === 'reais'} onClick={() => setVisao('reais')}>
                Em reais
              </Botao>
              <Botao variante="secundario" aria-pressed={visao === 'metas'} onClick={() => setVisao('metas')}>
                Em coisas do dia a dia
              </Botao>
            </div>
          )}

          {visao === 'reais' || metasConfirmadas.length === 0 ? (
            <p className="valor">
              <span className="valor__rotulo">Estimativa de dinheiro preservado{desde && ` desde ${desde}`}</span>
              <span className="valor__numero">≈ {formatarReais(valor)}</span>
              {meta && <span>Sua meta: {meta}</span>}
            </p>
          ) : (
            <ul className="metas">
              {metas.length === 0 && <li>Ainda não dá uma meta inteira. Cada dia conta.</li>}
              {metas.map(({ meta, quantidade }) => (
                <li key={meta.id}>
                  Isso dá {quantidade} {quantidade === 1 ? meta.nome : meta.plural}
                </li>
              ))}
            </ul>
          )}

          <p className="nota">
            Conta feita com o que você informou: {formatarReais(gastoSemanal ?? 0)} por semana, em{' '}
            {progresso.totalSemApostar} {progresso.totalSemApostar === 1 ? 'dia' : 'dias'} sem apostar.
          </p>
          <Botao
            variante="secundario"
            onClick={() => {
              setTexto(String(gastoSemanal ?? '').replace('.', ','))
              setTextoMeta(meta ?? '')
              setEditando(true)
            }}
          >
            Mudar o valor ou a meta
          </Botao>
        </>
      )}

      <Botao variante="secundario" onClick={aoVoltar}>
        Voltar pro início
      </Botao>
    </section>
  )
}
