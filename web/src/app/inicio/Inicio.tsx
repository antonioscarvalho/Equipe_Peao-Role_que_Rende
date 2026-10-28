import { useState } from 'react'
import { Animacao } from '@/components/Animacao'
import { Aproximado } from '@/components/Aproximado'
import { Bairro } from '@/components/Bairro'
import { Bichinho, type Humor } from '@/components/Bichinho'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { Chips } from '@/components/Chips'
import { Contador } from '@/components/Contador'
import { Icone } from '@/components/Icone'
import { conteudoCheckin, conteudoDinheiro, conteudoPrevencao } from '@/content/conteudo'
import { dataPorExtenso } from '@/domain/datas'
import { estagioGuardiao, formatarReais } from '@/domain/progresso'
import { useProgresso } from '@/hooks/useProgresso'

interface InicioProps {
  aoAbrirSos: () => void
  aoApostar: () => void
  aoAbrirDinheiro: () => void
  aoAbrirPlano: () => void
  aoAbrirCirculo: () => void
  /** Os testes passam um dia fixo; no app vale o dia de hoje do aparelho. */
  hoje?: string
  reduzir?: boolean
}

const humor = conteudoCheckin.humor

const falas: Record<Humor, string> = {
  calmo: 'Bora cuidar do nosso rolê hoje?',
  feliz: 'Boa! Cada passo conta.',
  orgulhoso: 'Olha quanto você já protegeu!',
  cansado: 'Dia difícil acontece. Tô aqui, nada do que construímos sumiu.',
  apoio: 'Respira comigo.',
}

/** Tela inicial: o SOS continua sendo a ação principal; o check-in vem logo abaixo (fluxo F4). */
export function Inicio({ aoAbrirSos, aoApostar, aoAbrirDinheiro, aoAbrirPlano, aoAbrirCirculo, hoje, reduzir = false }: InicioProps) {
  const { estado, progresso, registroDeHoje, gastoSemanal, meta, registrar, registrarHumor, hoje: dia } = useProgresso(hoje)
  const [anotado, setAnotado] = useState(false)

  const naoApostei = () => {
    registrar(false)
    setAnotado(true)
  }

  // Um humor só: o chip recém-tocado substitui o anterior, e tocar no marcado desmarca.
  const escolherHumor = (marcados: string[]) => {
    const novo = marcados.find((m) => m !== humor.opcoes[(registroDeHoje?.humor ?? 0) - 1])
    registrarHumor(novo ? humor.opcoes.indexOf(novo) + 1 : null)
  }

  const apostei = () => {
    registrar(true)
    aoApostar()
  }

  const humorBicho: Humor = (() => {
    if (anotado) return 'feliz'
    if (registroDeHoje?.apostou === true) return 'cansado'
    if (progresso.sequenciaAtual >= 7) return 'orgulhoso'
    return 'calmo'
  })()

  const nivel = estagioGuardiao(progresso.totalSemApostar)
  const construidas = Math.min(6, Math.max(1, Math.min(6, progresso.diasSemApostarNoMes)))

  return (
    <section className="tela tela--inicio" aria-labelledby="inicio-titulo">
      <h1 id="inicio-titulo">Bora construir uma vida sem apostas? Um passo de cada vez.</h1>

      {/* Cena Viva do Bichinho e Bairro reconstruído */}
      <section className="cena" aria-label="Seu bichinho">
        <div className="balao" key={humorBicho}>
          {falas[humorBicho]}
        </div>
        <Bichinho humor={humorBicho} nivel={nivel} tamanho={160} />
        <Bairro construidas={construidas} />
        {anotado && (
          <div className="cena__brilho">
            <Animacao nome="brilho" tamanho={110} repetir={false} reduzir={reduzir} />
          </div>
        )}
      </section>

      {/* Cards de Resumo Rápido */}
      <div className="cards-mini">
        <div className="card-mini">
          <span className="card-mini__icone card-mini__icone--broto">
            <Animacao nome="broto" tamanho={26} reduzir={reduzir} />
          </span>
          <div>
            <p className="card-mini__rotulo">Dias de cuidado</p>
            <p className="card-mini__valor">
              {progresso.totalSemApostar} {progresso.totalSemApostar === 1 ? 'dia' : 'dias'}
            </p>
            <p className="card-mini__nota">Dia difícil não zera nada.</p>
          </div>
        </div>

        <button type="button" className="card-mini" onClick={aoAbrirDinheiro}>
          <span className="card-mini__icone card-mini__icone--moeda">
            <span className="moeda-badge" aria-hidden="true">R$</span>
          </span>
          <div>
            <p className="card-mini__rotulo">Dinheiro protegido</p>
            <p className="card-mini__valor">
              {progresso.dinheiroPreservado !== null ? formatarReais(progresso.dinheiroPreservado) : 'Calcular'}
            </p>
            <p className="card-mini__nota">Ver Open Finance →</p>
          </div>
        </button>
      </div>

      <Botao grande onClick={aoAbrirSos} className="botao--sos">
        <Icone nome="wind" tamanho={26} /> Bateu a vontade?
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
        {registroDeHoje && (
          <Chips
            legenda={humor.legenda}
            dica={humor.dica}
            opcoes={humor.opcoes}
            selecionados={registroDeHoje.humor ? [humor.opcoes[registroDeHoje.humor - 1]] : []}
            aoMudar={escolherHumor}
          />
        )}
        {estado === 'carregando' ? (
          <div className="esqueleto esqueleto--contador" role="status" aria-label="Carregando seus registros" />
        ) : (
          <div className="jornada">
            <div className="jornada__info">
              <Contador
                dias={progresso.totalSemApostar}
                desde={progresso.inicio && dataPorExtenso(progresso.inicio, dia)}
                noMes={progresso.diasSemApostarNoMes}
                sequencia={progresso.sequenciaAtual}
                diasSemRegistro={progresso.diasSemRegistroNoMes}
              />
            </div>
          </div>
        )}
        {/* CA-6: sem gasto informado, o card convida em vez de mostrar R$ 0. */}
        {estado === 'pronto' && progresso.dinheiroPreservado !== null && (
          <p className="checkin__dinheiro">
            {conteudoDinheiro.resumoInicio}{' '}
            <strong>
              <Aproximado />
              {formatarReais(progresso.dinheiroPreservado)}
            </strong>
            {meta && ` — ${meta}`}
          </p>
        )}
        <Botao variante="secundario" onClick={aoAbrirDinheiro}>
          {gastoSemanal === null ? conteudoDinheiro.convite : conteudoDinheiro.verDinheiro}
        </Botao>
      </Cartao>

      <nav className="linha grade-atalhos" aria-label="Prepare-se pros momentos difíceis">
        <Botao variante="secundario" onClick={aoAbrirPlano}>
          {conteudoPrevencao.atalhos.plano}
        </Botao>
        <Botao variante="secundario" onClick={aoAbrirCirculo}>
          {conteudoPrevencao.atalhos.circulo}
        </Botao>
      </nav>
      <p className="nota">
        Este app é um apoio. Ele não substitui atendimento profissional. Seus registros ficam só neste celular.
      </p>
    </section>
  )
}
