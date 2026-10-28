/**
 * SOS "Bateu a vontade?" (fluxo F2).
 * Conceitos: fissura como onda (urge surfing, Marlatt); adiar a decisão; reestruturação cognitiva
 *   com perguntas socráticas; autoeficácia pela medida antes/depois.
 * Skills: prevencao-recaida · tcc-reestruturacao-cognitiva · seguranca-e-crise · design-etico-saude-digital.
 * Fontes: Maynard et al. 2015 (mindfulness em jogo, meta-análise); Cowlishaw et al. 2012 (Cochrane, TCC);
 *   Ladouceur et al. 2001 (correção cognitiva) — ver docs/pesquisa/02-intervencoes.md.
 * REVISÃO CLÍNICA PENDENTE dos textos (web/src/content/sos.json).
 */
import { useCallback, useState } from 'react'
import { AcoesDoPlano } from '@/components/AcoesDoPlano'
import { Botao } from '@/components/Botao'
import { LinkTelefone } from '@/components/LinkTelefone'
import { ReguaVontade } from '@/components/ReguaVontade'
import { TimerOnda } from '@/components/TimerOnda'
import { canal, conteudoSos, type CardExame } from '@/content/conteudo'
import { episodiosSos } from '@/lib/episodiosSos'

type Passo = 'vontade' | 'onda' | 'motivo' | 'card' | 'acoes' | 'depois'

/** A partir deste nível no fim do SOS, o app oferece ajuda humana em destaque. */
export const LIMIAR_AJUDA = 9

interface SosProps {
  motivo?: string | null
  aoPedirAjuda: () => void
  aoTerminar: () => void
  /** Duração da onda; o padrão vem do conteúdo. Os testes usam um valor curto. */
  duracaoOnda?: number
}

function sortearCard(anterior?: CardExame): CardExame {
  const opcoes = conteudoSos.cards.filter((c) => c.id !== anterior?.id)
  return opcoes[Math.floor(Math.random() * opcoes.length)]
}

export function Sos({ motivo, aoPedirAjuda, aoTerminar, duracaoOnda = conteudoSos.duracaoOndaSegundos }: SosProps) {
  const [passo, setPasso] = useState<Passo>('vontade')
  const [antes, setAntes] = useState<number | null>(null)
  const [depois, setDepois] = useState<number | null>(null)
  const [episodioId, setEpisodioId] = useState<string | null>(null)
  const [card, setCard] = useState<CardExame>(() => sortearCard())

  // Salvar é melhor esforço: se o IndexedDB falhar (ex.: navegação anônima), o SOS segue funcionando.
  const salvar = (acao: () => Promise<unknown>) => {
    acao().catch(() => undefined)
  }

  const escolherAntes = (valor: number) => {
    setAntes(valor)
    salvar(async () => setEpisodioId((await episodiosSos.iniciar(valor)).id))
    setPasso('onda')
  }

  const pedirAjuda = () => {
    if (episodioId) salvar(() => episodiosSos.atualizar(episodioId, { foiParaCrise: true }))
    aoPedirAjuda()
  }

  const depoisDaOnda = useCallback(() => setPasso(motivo ? 'motivo' : 'card'), [motivo])

  const escolherDepois = (valor: number) => {
    setDepois(valor)
    if (episodioId) salvar(() => episodiosSos.atualizar(episodioId, { vontadeDepois: valor }))
  }

  return (
    <section className="tela tela--sos" aria-labelledby="sos-titulo">
      {passo === 'vontade' && (
        <>
          <h1 id="sos-titulo">Quanto tá a vontade agora?</h1>
          <ReguaVontade rotulo="De 0 a 10" valor={antes} aoEscolher={escolherAntes} />
          <Botao variante="alerta" onClick={pedirAjuda}>
            Não tô aguentando
          </Botao>
        </>
      )}

      {passo === 'onda' && (
        <>
          <h1 id="sos-titulo">Respira. A gente passa por esse momento junto.</h1>
          <TimerOnda segundos={duracaoOnda} frases={conteudoSos.frasesOnda} aoTerminar={depoisDaOnda} />
          <Botao variante="secundario" onClick={depoisDaOnda}>
            Ir pro próximo passo
          </Botao>
        </>
      )}

      {passo === 'motivo' && (
        <>
          <h1 id="sos-titulo">Lembra do seu motivo</h1>
          <blockquote className="motivo">“{motivo}”</blockquote>
          <Botao onClick={() => setPasso('card')}>Próximo</Botao>
        </>
      )}

      {passo === 'card' && (
        <>
          <h1 id="sos-titulo">Pare e examine</h1>
          <article className="cartao cartao--exame" aria-label={card.titulo}>
            <p className="cartao__validacao">{conteudoSos.validacaoCard}</p>
            <p className="cartao__pensamento">“{card.pensamento}”</p>
            <ul className="cartao__perguntas">
              {card.perguntas.map((pergunta) => (
                <li key={pergunta}>{pergunta}</li>
              ))}
            </ul>
          </article>
          <div className="linha">
            <Botao variante="secundario" onClick={() => setCard(sortearCard(card))}>
              Outro card
            </Botao>
            <Botao onClick={() => setPasso('acoes')}>Próximo</Botao>
          </div>
        </>
      )}

      {passo === 'acoes' && (
        <>
          <h1 id="sos-titulo">O que dá pra fazer agora?</h1>
          <AcoesDoPlano acoes={conteudoSos.acoes} />
          <Botao onClick={() => setPasso('depois')}>Próximo</Botao>
        </>
      )}

      {passo === 'depois' && (
        <>
          <h1 id="sos-titulo">E agora, quanto tá a vontade?</h1>
          <ReguaVontade rotulo="De 0 a 10" valor={depois} aoEscolher={escolherDepois} />
          {depois !== null && <Resultado antes={antes} depois={depois} aoPedirAjuda={pedirAjuda} />}
          <Botao variante="secundario" onClick={aoTerminar}>
            Voltar pro início
          </Botao>
        </>
      )}
    </section>
  )
}

interface ResultadoProps {
  antes: number | null
  depois: number
  aoPedirAjuda: () => void
}

function Resultado({ antes, depois, aoPedirAjuda }: ResultadoProps) {
  const cvv = canal('cvv')
  const caiu = antes !== null && depois < antes

  if (caiu && depois < LIMIAR_AJUDA) {
    return (
      <p className="resultado" role="status">
        Começou em {antes}, agora tá em {depois}. Você atravessou essa onda.
      </p>
    )
  }

  return (
    <div className="resultado" role="status">
      <p>Tá difícil hoje. Quer falar com alguém agora?</p>
      <LinkTelefone telefone={cvv.telefone!} rotulo={cvv.rotulo} destaque={depois >= LIMIAR_AJUDA} />
      <Botao variante="alerta" onClick={aoPedirAjuda}>
        Ver mais formas de ajuda
      </Botao>
    </div>
  )
}
