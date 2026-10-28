/**
 * Dinheiro preservado (spec 004, CA-5 e CA-6). O Open Finance é a spec 007, fora desta tela por enquanto.
 * Skills: controle-estimulos-financas · design-etico-saude-digital.
 * O valor é sempre estimativa, a partir do que a pessoa informou (CDC); nada vem de conta real.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Aproximado } from '@/components/Aproximado'
import { Botao } from '@/components/Botao'
import { conteudoDinheiro as t, metasConfirmadas, preencher } from '@/content/conteudo'
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

  const desde = progresso.inicio && preencher(t.desde, { data: dataPorExtenso(progresso.inicio, dia) })
  const pedindoValor = estado === 'pronto' && (gastoSemanal === null || editando)

  const salvar = (evento: FormEvent) => {
    evento.preventDefault()
    const valor = lerValor(texto)
    if (valor === null) {
      setErro(t.erroGasto)
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
        {t.titulo}
      </h1>

      {estado === 'carregando' && (
        <div className="esqueleto esqueleto--valor" role="status" aria-label={t.carregando} />
      )}

      {pedindoValor && (
        <form className="pilha" onSubmit={salvar} noValidate>
          {gastoSemanal === null && <p className="tela__lead">{t.convite}</p>}
          <label htmlFor="gasto-semanal">{t.campoGasto}</label>
          <p className="nota" id="gasto-dica">
            {t.dicaGasto}
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
          <label htmlFor="meta">{t.campoMeta}</label>
          <p className="nota" id="meta-dica">
            {t.dicaMeta}
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
          <Botao type="submit">{t.salvar}</Botao>
        </form>
      )}

      {estado === 'pronto' && !pedindoValor && valor !== null && (
        <>
          {metasConfirmadas.length > 0 && (
            <div className="linha" role="group" aria-label={t.mostrarEm}>
              <Botao variante="secundario" aria-pressed={visao === 'reais'} onClick={() => setVisao('reais')}>
                {t.emReais}
              </Botao>
              <Botao variante="secundario" aria-pressed={visao === 'metas'} onClick={() => setVisao('metas')}>
                {t.emCoisas}
              </Botao>
            </div>
          )}

          {/* CA-5: a palavra "estimativa" vale para as duas visões, não só para a de reais. */}
          {visao === 'reais' || metasConfirmadas.length === 0 ? (
            <p className="valor">
              <span className="valor__rotulo">{[t.rotuloReais, desde].filter(Boolean).join(' ')}</span>
              <span className="valor__numero">
                <Aproximado />
                {formatarReais(valor)}
              </span>
            </p>
          ) : (
            <div className="valor">
              <span className="valor__rotulo">{[t.rotuloCoisas, desde].filter(Boolean).join(', ')}</span>
              <ul className="metas">
                {metas.length === 0 && <li>{t.nenhumaMetaInteira}</li>}
                {metas.map(({ meta: referencia, quantidade }) => (
                  <li key={referencia.id}>
                    {preencher(t.daPraPagar, {
                      n: quantidade,
                      coisa: quantidade === 1 ? referencia.nome : referencia.plural,
                    })}
                  </li>
                ))}
              </ul>
              <p className="nota">
                {preencher(t.referencias, { fontes: metasConfirmadas.map((m) => m.rotuloFonte ?? m.fonte).join('; ') })}
              </p>
            </div>
          )}
          {meta && <p className="valor__meta">{preencher(t.suaMeta, { meta })}</p>}

          <p className="nota">
            {preencher(t.conta, {
              valor: formatarReais(gastoSemanal ?? 0),
              dias: `${progresso.totalSemApostar} ${progresso.totalSemApostar === 1 ? 'dia' : 'dias'}`,
            })}
          </p>
          <Botao
            variante="secundario"
            onClick={() => {
              setTexto(String(gastoSemanal ?? '').replace('.', ','))
              setTextoMeta(meta ?? '')
              setEditando(true)
            }}
          >
            {t.mudar}
          </Botao>
        </>
      )}

      <Botao variante="secundario" onClick={aoVoltar}>
        {t.voltar}
      </Botao>
    </section>
  )
}
