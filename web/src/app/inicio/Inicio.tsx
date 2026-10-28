import { useCallback, useState } from 'react'
import { Animacao } from '@/components/Animacao'
import { Aproximado } from '@/components/Aproximado'
import { Bairro } from '@/components/Bairro'
import { Bichinho, type Humor } from '@/components/Bichinho'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { Chips } from '@/components/Chips'
import { Contador } from '@/components/Contador'
import { ContadorAnimado } from '@/components/ContadorAnimado'
import { Icone } from '@/components/Icone'
import type { NomeIcone } from '@/components/icones-data'
import { Respiracao } from '@/components/Respiracao'
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

type Missao = { id: number; texto: string; icone: NomeIcone; valor: number }

// Dados sintéticos para as missões diárias da prova visual (edital 8.5).
const missoes: Missao[] = [
  { id: 1, texto: 'Caminhar 15 minutos', icone: 'sprout', valor: 20 },
  { id: 2, texto: 'Mandar mensagem pra alguém de confiança', icone: 'heartHandshake', valor: 30 },
  { id: 3, texto: 'Anotar os gastos de hoje', icone: 'piggyBank', valor: 50 },
  { id: 4, texto: 'Jogar bola ou ir na praça', icone: 'house', valor: 40 },
]

const humoresDemo: { id: Humor; rotulo: string }[] = [
  { id: 'calmo', rotulo: 'Calmo' },
  { id: 'feliz', rotulo: 'Feliz' },
  { id: 'orgulhoso', rotulo: 'Orgulhoso' },
  { id: 'cansado', rotulo: 'Dia difícil' },
]

const humor = conteudoCheckin.humor

const falas: Record<Humor, string> = {
  calmo: 'Bora cuidar do nosso rolê hoje?',
  feliz: 'Boa! Cada passo conta.',
  orgulhoso: 'Olha quanto você já protegeu!',
  cansado: 'Dia difícil acontece. Tô aqui, nada do que construímos sumiu.',
  apoio: 'Respira comigo.',
}

/** Tela inicial integrando a prova visual completa e a lógica de domínio. */
export function Inicio({
  aoAbrirSos,
  aoApostar,
  aoAbrirDinheiro,
  aoAbrirPlano,
  aoAbrirCirculo,
  hoje,
  reduzir = false,
}: InicioProps) {
  const { estado, progresso, registroDeHoje, gastoSemanal, meta, registrar, registrarHumor, hoje: dia } = useProgresso(hoje)
  const [anotado, setAnotado] = useState(false)
  const [feitas, setFeitas] = useState<number[]>([])
  const [humorManual, setHumorManual] = useState<Humor | null>(null)
  const [moedaKey, setMoedaKey] = useState(0)
  const [avisoMissao, setAvisoMissao] = useState('')
  const [respirandoCrise, setRespirandoCrise] = useState(false)

  const naoApostei = () => {
    registrar(false)
    setAnotado(true)
    setMoedaKey((k) => k + 1)
    setHumorManual('feliz')
    window.setTimeout(() => setHumorManual((h) => (h === 'feliz' ? null : h)), 2600)
  }

  // Um humor só: o chip recém-tocado substitui o anterior, e tocar no marcado desmarca.
  const escolherHumor = (marcados: string[]) => {
    const novo = marcados.find((m) => m !== humor.opcoes[(registroDeHoje?.humor ?? 0) - 1])
    registrarHumor(novo ? humor.opcoes.indexOf(novo) + 1 : null)
  }

  const apostei = () => {
    registrar(true)
    setHumorManual('cansado')
    aoApostar()
  }

  const concluirMissao = useCallback(
    (m: Missao) => {
      if (feitas.includes(m.id)) return
      setFeitas((f) => [...f, m.id])
      setMoedaKey((k) => k + 1)
      setHumorManual('feliz')
      setAvisoMissao(`Missão concluída: ${m.texto}. Mais um lugar do bairro foi reconstruído.`)
      window.setTimeout(() => setHumorManual((h) => (h === 'feliz' ? null : h)), 2600)
    },
    [feitas],
  )

  const reiniciarMissoes = () => {
    setFeitas([])
    setHumorManual('calmo')
    setAvisoMissao('')
  }

  const humorBicho: Humor = (() => {
    if (humorManual) return humorManual
    if (anotado) return 'feliz'
    if (registroDeHoje?.apostou === true) return 'cansado'
    if (progresso.sequenciaAtual >= 7 || feitas.length === missoes.length) return 'orgulhoso'
    return 'calmo'
  })()

  const nivelBase = estagioGuardiao(progresso.totalSemApostar)
  const nivel = Math.min(3, nivelBase + feitas.length)
  const baseConstruidas = Math.max(2, Math.min(6, progresso.diasSemApostarNoMes || 2))
  const construidas = Math.min(6, baseConstruidas + feitas.length)

  const bonusMissoes = feitas.reduce((acc, id) => {
    const item = missoes.find((m) => m.id === id)
    return acc + (item?.valor ?? 0)
  }, 0)
  const baseProtegido = progresso.dinheiroPreservado ?? 1240
  const valorProtegido = baseProtegido + bonusMissoes

  return (
    <section className="tela tela--inicio" aria-labelledby="inicio-titulo">
      <div className="inicio-saudacao">
        <p className="topo__oi">Oi, Lucas</p>
        <h1 id="inicio-titulo" className="topo__titulo">
          <span className="rqr-realce rqr-anim-marca-texto">Seu rolê</span> de hoje
        </h1>
      </div>

      {/* Cena Viva do Bichinho e Bairro reconstruído */}
      <section className="cena" aria-label="Seu bichinho">
        <div className="balao" key={humorBicho}>
          {falas[humorBicho]}
        </div>
        <Bichinho humor={humorBicho} nivel={nivel} tamanho={200} />
        <Bairro construidas={construidas} />
        {(anotado || (moedaKey > 0 && humorBicho === 'feliz')) && (
          <div className="cena__brilho" key={moedaKey}>
            <Animacao nome="brilho" tamanho={120} repetir={false} reduzir={reduzir} />
          </div>
        )}
      </section>

      {/* Seletores interativos de humor do Bichinho (prova visual) */}
      <div className="humores" role="group" aria-label="Ver humores do bichinho (demonstração)">
        {humoresDemo.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`chip-humor ${humorBicho === h.id ? 'is-on' : ''}`}
            aria-pressed={humorBicho === h.id}
            onClick={() => setHumorManual(h.id)}
          >
            {h.rotulo}
          </button>
        ))}
      </div>

      {/* Cards de Resumo Rápido com entrada escalonada e moeda giratória */}
      <div className="cards-mini rqr-escalonado">
        <article className="card-mini">
          <span className="card-mini__icone card-mini__icone--broto">
            <Animacao nome="broto" tamanho={34} reduzir={reduzir} />
          </span>
          <div>
            <p className="card-mini__rotulo">Dias de cuidado</p>
            <p className="card-mini__valor">
              {progresso.totalSemApostar} {progresso.totalSemApostar === 1 ? 'dia' : 'dias'}
            </p>
            <p className="card-mini__nota">Dia difícil não zera nada.</p>
          </div>
        </article>

        <button type="button" className="card-mini" onClick={aoAbrirDinheiro}>
          <span className="card-mini__icone card-mini__icone--moeda" key={moedaKey}>
            <span className={moedaKey ? 'moeda-badge rqr-anim-moeda' : 'moeda-badge'} aria-hidden="true">
              R$
            </span>
          </span>
          <div>
            <p className="card-mini__rotulo">Dinheiro protegido</p>
            <p className="card-mini__valor">
              <ContadorAnimado valor={valorProtegido} reduzir={reduzir} />
            </p>
            <p className="card-mini__nota">Ver Open Finance →</p>
          </div>
        </button>
      </div>

      {/* Missões do Dia (prova visual) */}
      <section aria-labelledby="missoes-titulo">
        <div className="secao-missoes">
          <h2 id="missoes-titulo">Missões do dia</h2>
          <span className="progresso-barra" aria-label={`${feitas.length} de ${missoes.length} missões`}>
            <span style={{ transform: `scaleX(${feitas.length / missoes.length})` }} />
          </span>
        </div>
        <ul className="missoes rqr-escalonado">
          {missoes.map((m) => {
            const ok = feitas.includes(m.id)
            return (
              <li key={m.id}>
                <button
                  type="button"
                  className={`missao ${ok ? 'is-ok' : ''}`}
                  onClick={() => concluirMissao(m)}
                  aria-pressed={ok}
                >
                  <span className="missao__icone">
                    <Icone nome={ok ? 'check' : m.icone} />
                  </span>
                  <span className="missao__texto">{m.texto}</span>
                  <span className="missao__valor">+ R$ {m.valor}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {feitas.length > 0 && (
          <button type="button" className="link-reiniciar" onClick={reiniciarMissoes}>
            Reiniciar demonstração
          </button>
        )}
      </section>

      {/* Botões de SOS e Respiração com pulso rqr-anim-on */}
      <div className="sos-acoes">
        <button type="button" className="botao--sos rqr-anim-on" onClick={() => setRespirandoCrise(true)}>
          <Icone nome="wind" tamanho={28} /> Deu vontade · Respirar
        </button>
        <Botao variante="secundario" onClick={aoAbrirSos}>
          Bateu a vontade?
        </Botao>
      </div>

      <Cartao titulo={conteudoCheckin.pergunta}>
        <div className="linha" role="group" aria-label={conteudoCheckin.pergunta}>
          <Botao variante="secundario" aria-pressed={registroDeHoje?.apostou === false} onClick={naoApostei}>
            {conteudoCheckin.naoApostei}
          </Botao>
          <Botao variante="secundario" aria-pressed={registroDeHoje?.apostou === true} onClick={apostei}>
            {conteudoCheckin.apostei}
          </Botao>
        </div>
        {/* Resposta serena (CA-2): só texto, sem som. */}
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

      <p className="sr-only" aria-live="polite">
        {avisoMissao}
      </p>

      {respirandoCrise && (
        <Respiracao
          aoFechar={() => setRespirandoCrise(false)}
          aoIrParaSos={() => {
            setRespirandoCrise(false)
            aoAbrirSos()
          }}
          reduzir={reduzir}
        />
      )}
    </section>
  )
}
