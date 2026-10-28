import { useEffect, useState } from 'react'
import { Animacao } from './Animacao'
import { Bichinho } from './Bichinho'
import { Icone } from './Icone'

const fases = [
  { nome: 'Inspire', seg: 4, classe: 'inspira' },
  { nome: 'Segure', seg: 4, classe: 'segura' },
  { nome: 'Solte devagar', seg: 6, classe: 'expira' },
] as const

const CICLOS = 3

interface RespiracaoProps {
  aoFechar: () => void
  aoIrParaSos?: () => void
  reduzir?: boolean
}

/** Momento de crise/vontade: respiração guiada 4-4-6 com o bichinho. Apoio complementar, com canais reais de ajuda. */
export function Respiracao({ aoFechar, aoIrParaSos, reduzir = false }: RespiracaoProps) {
  const [ciclo, setCiclo] = useState(0)
  const [fase, setFase] = useState(0)
  const [resta, setResta] = useState<number>(fases[0].seg)
  const terminou = ciclo >= CICLOS

  // Começa "vazio" e cresce na primeira inspiração, para a transição aparecer desde o início.
  const [montado, setMontado] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMontado(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (terminou) return
    const id = window.setTimeout(() => {
      if (resta > 1) return setResta(resta - 1)
      const prox = (fase + 1) % fases.length
      if (prox === 0) setCiclo((c) => c + 1)
      setFase(prox)
      setResta(fases[prox].seg)
    }, 1000)
    return () => window.clearTimeout(id)
  }, [resta, fase, terminou])

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [aoFechar])

  const f = fases[fase]

  return (
    <div className="crise-modal" role="dialog" aria-modal="true" aria-labelledby="respiracao-titulo">
      <button type="button" className="crise-modal__fechar" onClick={aoFechar} aria-label="Fechar">
        ×
      </button>
      {!terminou ? (
        <>
          <h2 id="respiracao-titulo" className="crise-modal__titulo">
            A vontade vem em onda.
            <br />
            Vamos atravessar juntos.
          </h2>
          <div
            className={`onda onda--${montado ? f.classe : 'expira'}`}
            style={{ ['--dur' as string]: `${f.seg}s` }}
          >
            <span className="onda__anel onda__anel--1" />
            <span className="onda__anel onda__anel--2" />
            <div className="onda__centro">
              <Bichinho humor="apoio" nivel={1} tamanho={150} />
            </div>
          </div>
          <p className="crise-modal__fase" aria-live="polite">
            {f.nome} <b>{resta}</b>
          </p>
          <div className="crise-modal__ciclos" aria-label={`Ciclo ${ciclo + 1} de ${CICLOS}`}>
            {Array.from({ length: CICLOS }, (_, i) => (
              <span key={i} className={i < ciclo ? 'ok' : i === ciclo ? 'agora' : ''} />
            ))}
          </div>
          {aoIrParaSos && (
            <button type="button" className="crise-modal__atalho-sos" onClick={aoIrParaSos}>
              Ir pro apoio passo a passo (SOS) →
            </button>
          )}
        </>
      ) : (
        <div className="crise-modal__fim rqr-escalonado">
          <div className="crise-modal__alivio">
            <Bichinho humor="feliz" nivel={2} tamanho={130} />
            <Animacao nome="aliviado" tamanho={84} reduzir={reduzir} rotulo="Rosto aliviado" />
          </div>
          <h2 id="respiracao-titulo" className="crise-modal__titulo">
            Você atravessou essa onda.
          </h2>
          <p>Se a vontade continuar forte, conversar com alguém ou seguir o passo a passo ajuda.</p>
          {aoIrParaSos && (
            <button type="button" className="rqr-botao" onClick={aoIrParaSos}>
              Seguir pro passo a passo (SOS)
            </button>
          )}
          <a className="ajuda-link" href="tel:188">
            <Icone nome="phone" /> CVV · ligar 188 (24h, gratuito)
          </a>
          <a
            className="ajuda-link"
            href="https://www.gov.br/pt-br/servicos/plataforma-centralizada-de-autoexclusao-apostas"
            target="_blank"
            rel="noreferrer"
          >
            <Icone nome="shieldCheck" /> Autoexclusão de apostas (gov.br)
          </a>
          <button type="button" className="rqr-botao rqr-botao--escuro" onClick={aoFechar}>
            Voltar pro meu rolê
          </button>
          <small>Este app é um apoio complementar e não substitui atendimento profissional.</small>
        </div>
      )}
    </div>
  )
}
