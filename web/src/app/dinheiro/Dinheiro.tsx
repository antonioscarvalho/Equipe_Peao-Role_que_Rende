/**
 * Dinheiro preservado e simulação de Open Finance (spec 004, CA-5 a CA-7).
 * Skills: controle-estimulos-financas · design-etico-saude-digital.
 * O valor é sempre estimativa, a partir do que a pessoa informou (CDC); nada vem de conta real.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { metasConfirmadas } from '@/content/conteudo'
import demo from '@/content/open-finance-demo.json'
import { nomeDoMes } from '@/domain/datas'
import { analisarExtrato } from '@/domain/openFinance'
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
  const { estado, progresso, gastoSemanal, salvarGastoSemanal, hoje: dia } = useProgresso(hoje)
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [visao, setVisao] = useState<'reais' | 'metas'>('reais')
  const [simulacaoAberta, setSimulacaoAberta] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => titulo.current?.focus(), [])

  const mes = nomeDoMes(dia)
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
    salvarGastoSemanal(valor)
  }

  const valor = progresso.dinheiroPreservado
  const metas = valor === null ? [] : emMetas(valor, metasConfirmadas)
  const analise = analisarExtrato(demo.transacoes, demo.dataReferencia)

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
              <span className="valor__rotulo">Estimativa de dinheiro preservado em {mes}</span>
              <span className="valor__numero">{formatarReais(valor)}</span>
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
            {progresso.diasSemApostar} {progresso.diasSemApostar === 1 ? 'dia' : 'dias'} sem apostar.
          </p>
          <Botao
            variante="secundario"
            onClick={() => {
              setTexto(String(gastoSemanal ?? '').replace('.', ','))
              setEditando(true)
            }}
          >
            Mudar o valor por semana
          </Botao>
        </>
      )}

      <Cartao titulo="Simulação de Open Finance">
        <p>{demo.aviso}</p>
        <p>
          Com a sua autorização, o Open Finance poderia mostrar isto sozinho, sem você precisar anotar nada. Por
          enquanto, tudo funciona no modo manual.
        </p>
        <Botao variante="secundario" aria-expanded={simulacaoAberta} onClick={() => setSimulacaoAberta((a) => !a)}>
          {simulacaoAberta ? 'Esconder a simulação' : 'Ver a simulação'}
        </Botao>
        {simulacaoAberta && (
          <dl className="simulacao">
            <div>
              <dt>Pix para intermediadoras de apostas em {nomeDoMes(analise.mesAnterior.mes + '-01')}</dt>
              <dd>
                {analise.mesAnterior.quantidade}, somando {formatarReais(analise.mesAnterior.total)}
              </dd>
            </div>
            <div>
              <dt>Em {nomeDoMes(analise.mesAtual.mes + '-01')}</dt>
              <dd>
                {analise.mesAtual.quantidade}, somando {formatarReais(analise.mesAtual.total)}
              </dd>
            </div>
            {analise.diasSemPix !== null && (
              <div>
                <dt>Sem nenhum Pix desse tipo há</dt>
                <dd>{analise.diasSemPix} dias</dd>
              </div>
            )}
            <div>
              <dt>Dinheiro preservado na simulação</dt>
              <dd>{formatarReais(analise.aMenosQueMesAnterior)} a menos que no mês anterior</dd>
            </div>
          </dl>
        )}
      </Cartao>

      <Botao variante="secundario" onClick={aoVoltar}>
        Voltar pro início
      </Botao>
    </section>
  )
}
