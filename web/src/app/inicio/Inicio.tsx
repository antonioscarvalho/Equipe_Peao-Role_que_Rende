import { useState } from 'react'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { Contador } from '@/components/Contador'
import { conteudoCheckin } from '@/content/conteudo'
import { dataPorExtenso } from '@/domain/datas'
import { formatarReais } from '@/domain/progresso'
import { useProgresso } from '@/hooks/useProgresso'

interface InicioProps {
  aoAbrirSos: () => void
  aoApostar: () => void
  aoAbrirDinheiro: () => void
  /** Os testes passam um dia fixo; no app vale o dia de hoje do aparelho. */
  hoje?: string
}

/** Tela inicial: o SOS continua sendo a ação principal; o check-in vem logo abaixo (fluxo F4). */
export function Inicio({ aoAbrirSos, aoApostar, aoAbrirDinheiro, hoje }: InicioProps) {
  const { estado, progresso, registroDeHoje, gastoSemanal, meta, registrar, hoje: dia } = useProgresso(hoje)
  const [anotado, setAnotado] = useState(false)

  const naoApostei = () => {
    registrar(false)
    setAnotado(true)
  }

  const apostei = () => {
    registrar(true)
    aoApostar()
  }

  return (
    <section className="tela tela--inicio" aria-labelledby="inicio-titulo">
      <h1 id="inicio-titulo">Bora construir uma vida sem apostas? Um passo de cada vez.</h1>
      <Botao grande onClick={aoAbrirSos}>
        Bateu a vontade?
      </Botao>

      <Cartao titulo={conteudoCheckin.pergunta}>
        <div className="linha" role="group" aria-label={conteudoCheckin.pergunta}>
          <Botao variante="secundario" aria-pressed={registroDeHoje?.apostou === false} onClick={naoApostei}>
            {conteudoCheckin.naoApostei}
          </Botao>
          <Botao variante="secundario" aria-pressed={registroDeHoje?.apostou === true} onClick={apostei}>
            {conteudoCheckin.apostei}
          </Botao>
        </div>
        {/* Resposta serena (CA-2): só texto, sem som, sem animação de comemoração. */}
        <p role="status" className="checkin__resposta">
          {anotado ? conteudoCheckin.respostaNaoApostei : ''}
        </p>
        {estado === 'carregando' ? (
          <div className="esqueleto esqueleto--contador" role="status" aria-label="Carregando seus registros" />
        ) : (
          <Contador
            dias={progresso.totalSemApostar}
            desde={progresso.inicio && dataPorExtenso(progresso.inicio, dia)}
            noMes={progresso.diasSemApostarNoMes}
            sequencia={progresso.sequenciaAtual}
            diasSemRegistro={progresso.diasSemRegistroNoMes}
          />
        )}
        {/* CA-6: sem gasto informado, o card convida em vez de mostrar R$ 0. */}
        {estado === 'pronto' && progresso.dinheiroPreservado !== null && (
          <p className="checkin__dinheiro">
            Grana preservada (estimativa): <strong>≈ {formatarReais(progresso.dinheiroPreservado)}</strong>
            {meta && ` — ${meta}`}
          </p>
        )}
        <Botao variante="secundario" onClick={aoAbrirDinheiro}>
          {gastoSemanal === null ? 'Quer ver quanto você preservou?' : 'Ver dinheiro preservado'}
        </Botao>
      </Cartao>

      <p className="nota">
        Este app é um apoio. Ele não substitui atendimento profissional. Seus registros ficam só neste celular.
      </p>
    </section>
  )
}
