/**
 * Dinheiro preservado (spec 004, CA-5 e CA-6) e demonstração de Open Finance com dados sintéticos (spec 007).
 * Skills: controle-estimulos-financas · design-etico-saude-digital.
 * O valor é sempre estimativa, a partir do que a pessoa informou (CDC); nada vem de conta real.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Aproximado } from '@/components/Aproximado'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { conteudoDinheiro as t, conteudoOpenFinanceDemo as demo, metasConfirmadas, preencher } from '@/content/conteudo'
import { dataPorExtenso, nomeDoMes } from '@/domain/datas'
import { analisarExtrato } from '@/domain/openFinance'
import { emMetas, formatarReais } from '@/domain/progresso'
import { useProgresso } from '@/hooks/useProgresso'

interface DinheiroProps {
  aoVoltar: () => void
  aoAbrirCheckin?: () => void
  hoje?: string
}

const LIMITE_SEMANAL = 100_000

function lerValor(texto: string): number | null {
  const numero = Number(texto.replace(/\./g, '').replace(',', '.').trim())
  return Number.isFinite(numero) && numero > 0 && numero <= LIMITE_SEMANAL ? numero : null
}

export function Dinheiro({ aoVoltar, aoAbrirCheckin, hoje }: DinheiroProps) {
  const { estado, progresso, gastoSemanal, meta, salvarFinancas, hoje: dia } = useProgresso(hoje)
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState('')
  const [textoMeta, setTextoMeta] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [visao, setVisao] = useState<'reais' | 'metas'>('reais')
  const [modoDemo, setModoDemo] = useState<'inativo' | 'confirmando' | 'ativo'>('inativo')
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
  const analiseDemo = analisarExtrato(demo.transacoes, demo.dataReferencia)

  return (
    <section className="tela tela--dinheiro" aria-labelledby="dinheiro-titulo">
      {/* CA-3: Toda a tela mostra o selo DEMONSTRAÇÃO quando a demo estiver ativa */}
      {modoDemo === 'ativo' && (
        <aside className="selo-demo" role="status" aria-label="Modo de demonstração ativo">
          {demo.selo}
        </aside>
      )}

      <h1 id="dinheiro-titulo" ref={titulo} tabIndex={-1}>
        {t.titulo}
      </h1>

      {estado === 'carregando' && (
        <div className="esqueleto esqueleto--valor" role="status" aria-label={t.carregando} />
      )}

      {pedindoValor && modoDemo === 'inativo' && (
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

      {/* Visão Normal do Dinheiro Preservado (Modo Manual - CA-1) */}
      {estado === 'pronto' && !pedindoValor && valor !== null && modoDemo !== 'ativo' && (
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

      {/* CA-2: Confirmação prévia de até 3 linhas antes de entrar na demonstração */}
      {modoDemo === 'confirmando' && (
        <Cartao titulo={demo.confirmacao.titulo}>
          <div className="pilha">
            <p>{demo.confirmacao.linha1}</p>
            <p>{demo.confirmacao.linha2}</p>
            <p>{demo.confirmacao.linha3}</p>
            <div className="linha">
              <Botao onClick={() => setModoDemo('ativo')}>
                {demo.confirmacao.confirmar}
              </Botao>
              <Botao variante="secundario" onClick={() => setModoDemo('inativo')}>
                {demo.confirmacao.cancelar}
              </Botao>
            </div>
          </div>
        </Cartao>
      )}

      {/* CA-3 e CA-4: Demonstração ativa com dados sintéticos */}
      {modoDemo === 'ativo' && (
        <Cartao titulo={demo.extrato.titulo}>
          <p className="nota">{demo.extrato.subtitulo}</p>
          <div className="valor">
            <span className="valor__rotulo">{demo.extrato.comparativo}</span>
            <span className="valor__numero">
              <Aproximado />
              {formatarReais(analiseDemo.aMenosQueMesAnterior)}
            </span>
            <span className="nota">
              {formatarReais(analiseDemo.aMenosQueMesAnterior)} {demo.extrato.aMenos} de{' '}
              {nomeDoMes(analiseDemo.mesAnterior.mes + '-01')}
            </span>
          </div>

          {analiseDemo.diasSemTransacao !== null && (
            <p className="nota">
              Sem novas saídas desse tipo há <strong>{analiseDemo.diasSemTransacao} dias</strong>.
            </p>
          )}

          {/* CA-4: Sugestão neutra sem julgamento */}
          <div className="sugestao-demo">
            <p>{demo.extrato.sugestao}</p>
            {aoAbrirCheckin && (
              <Botao variante="secundario" onClick={aoAbrirCheckin}>
                {demo.extrato.botaoCheckin}
              </Botao>
            )}
          </div>

          <div className="transacoes-demo">
            <h3>{demo.extrato.transacoesTitulo}</h3>
            <ul className="lista-transacoes">
              {demo.transacoes.slice(0, 5).map((tr, idx) => (
                <li key={idx} className="item-transacao">
                  <span>
                    {dataPorExtenso(tr.data, demo.dataReferencia)} · {tr.destinatario}
                  </span>
                  <strong>{formatarReais(tr.valor)}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* CA-5: Sair da demonstração volta ao modo manual */}
          <Botao variante="secundario" onClick={() => setModoDemo('inativo')}>
            {demo.botaoSair}
          </Botao>
        </Cartao>
      )}

      {/* CA-1: Convidativo para a demonstração quando inativo */}
      {modoDemo === 'inativo' && (
        <Cartao titulo="Demonstração com Open Finance">
          <p>
            No futuro, com o Open Finance, você poderá acompanhar sua estimativa de forma automática e integrada à sua
            conta com total segurança. Por enquanto, tudo funciona no modo manual.
          </p>
          <Botao variante="secundario" onClick={() => setModoDemo('confirmando')}>
            {demo.botaoAbrir}
          </Botao>
        </Cartao>
      )}

      <Botao variante="secundario" onClick={aoVoltar}>
        {t.voltar}
      </Botao>
    </section>
  )
}
