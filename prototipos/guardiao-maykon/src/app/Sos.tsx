/**
 * Botão SOS de fissura (MVP #2), com cards "Pare e examine" (#3).
 * Conceito: a fissura é uma onda que sobe e passa (urge surfing, Marlatt); adiar a decisão;
 * reestruturação cognitiva com perguntas socráticas.
 * Skills: prevencao-recaida, tcc-reestruturacao-cognitiva, seguranca-e-crise.
 * Evidência: mindfulness para fissura (meta-análise, tentativa); Ladouceur 2001 (ECR).
 * Funciona offline. Pergunta direta e opcional de risco no fim → protocolo de crise.
 * REVISÃO CLÍNICA PENDENTE dos textos.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { Escala0a10 } from '@/components/Escala0a10'
import { Respiracao } from '@/components/Respiracao'
import { useDados } from '@/hooks/DadosContext'
import { fissuraPedeApoio } from '@/domain/risco'
import distorcoes from '@/content/distorcoes.json'
import apoio from '@/content/apoio.json'

type Passo = 'antes' | 'onda' | 'motivo' | 'acao' | 'depois' | 'fim'
const FRASES = ['A onda vai subir e vai passar.', 'Você não precisa decidir nada agora.', 'Só observe a vontade, sem brigar com ela.']

function formatarTempo(seg: number) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function Sos() {
  const { estado, atualizar } = useDados()
  const navegar = useNavigate()
  const [passo, setPasso] = useState<Passo>('antes')
  const [antes, setAntes] = useState<number | null>(null)
  const [depois, setDepois] = useState<number | null>(null)
  const [minutos, setMinutos] = useState(10)
  const [restante, setRestante] = useState(10 * 60)

  // Card escolhido em sequência (previsível), nunca sorteado.
  const card = distorcoes.cards[estado.episodiosSos.length % distorcoes.cards.length]
  const motivo = [estado.onboarding?.motivoTexto, ...(estado.onboarding?.motivos ?? [])].filter(Boolean)

  useEffect(() => {
    if (passo !== 'onda' || restante <= 0) return
    const t = setInterval(() => setRestante((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [passo, restante])

  function iniciarOnda(min: number) {
    setMinutos(min)
    setRestante(min * 60)
    setPasso('onda')
  }

  function finalizar() {
    atualizar((e) => ({
      ...e,
      episodiosSos: [...e.episodiosSos, { em: new Date().toISOString(), antes: antes ?? 0, depois }],
    }))
    setPasso('fim')
  }

  if (passo === 'antes') {
    return (
      <Pagina titulo="Vamos atravessar isso juntos" voltarPara="/" calma>
        <Escala0a10 pergunta="Quanto está a vontade de apostar agora?" valor={antes} aoMudar={setAntes} />
        <p>Quanto tempo você topa esperar antes de decidir qualquer coisa?</p>
        <div className="acoes">
          <Botao onClick={() => iniciarOnda(10)}>10 minutos</Botao>
          <Botao variante="secundario" onClick={() => iniciarOnda(15)}>15 minutos</Botao>
        </div>
      </Pagina>
    )
  }

  if (passo === 'onda') {
    const frase = FRASES[Math.floor((minutos * 60 - restante) / 40) % FRASES.length]
    return (
      <Pagina titulo="Deixe a onda passar" calma>
        <Respiracao />
        <p className="relogio" aria-live="off">
          <span className="sr-only">Tempo restante: </span>
          {formatarTempo(restante)}
        </p>
        <p className="frase-calma">{frase}</p>
        {restante === 0 && <p role="status">O tempo acabou. Como você está?</p>}
        <Botao larguraTotal onClick={() => setPasso('motivo')}>
          {restante === 0 ? 'Continuar' : 'Já estou melhor, continuar'}
        </Botao>
      </Pagina>
    )
  }

  if (passo === 'motivo') {
    return (
      <Pagina titulo="Lembra por que você está aqui" calma>
        {motivo.length > 0 && (
          <Cartao titulo="Seu motivo" destaque>
            <p className="motivo">{motivo.join(' · ')}</p>
          </Cartao>
        )}
        <Cartao titulo={`Pare e examine: ${card.titulo}`}>
          <p>{card.validacao}</p>
          <ul className="lista">
            {card.perguntas.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </Cartao>
        <Botao larguraTotal onClick={() => setPasso('acao')}>Continuar</Botao>
      </Pagina>
    )
  }

  if (passo === 'acao') {
    const contato = estado.contatos[0]
    return (
      <Pagina titulo="O que você combinou consigo" calma>
        {estado.plano.seEntao.length > 0 ? (
          <Cartao titulo="Seu plano">
            <ul className="lista">
              {estado.plano.seEntao.map((p, i) => (
                <li key={i}>
                  Se {p.se}, então {p.entao}.
                </li>
              ))}
            </ul>
          </Cartao>
        ) : (
          <p>
            Você ainda não tem um plano &quot;Se… então…&quot;. <Botao variante="discreto" para="/plano">Montar depois</Botao>
          </p>
        )}
        {contato ? (
          <Cartao titulo="Falar com alguém do seu círculo">
            <div className="acoes">
              <Botao href={`tel:${contato.telefone}`}>Ligar para {contato.nome}</Botao>
              <Botao
                variante="secundario"
                href={`https://wa.me/${contato.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(apoio.mensagemContato)}`}
              >
                Mandar mensagem
              </Botao>
            </div>
          </Cartao>
        ) : (
          <p>
            Falar com alguém ajuda. <Botao variante="discreto" para="/apoio">Ver contatos de apoio</Botao>
          </p>
        )}
        <Botao larguraTotal onClick={() => setPasso('depois')}>Continuar</Botao>
      </Pagina>
    )
  }

  if (passo === 'depois') {
    return (
      <Pagina titulo="E agora?" calma>
        <Escala0a10 pergunta="Quanto está a vontade de apostar agora?" valor={depois} aoMudar={setDepois} />
        <Botao larguraTotal desabilitado={depois === null} onClick={finalizar}>
          Continuar
        </Botao>
      </Pagina>
    )
  }

  const caiu = antes !== null && depois !== null && depois < antes
  return (
    <Pagina titulo="Você atravessou esse momento" calma>
      {caiu && (
        <p className="numero-grande">
          A vontade foi de {antes} para {depois}.
        </p>
      )}
      <p>{caiu ? 'Você esperou e a onda baixou. Isso é seu.' : 'Mesmo quando a onda demora, ficar aqui já é um passo.'}</p>
      {fissuraPedeApoio(depois) && (
        <Cartao titulo="A vontade ainda está muito forte">
          <p>Conversar com alguém agora pode ajudar.</p>
          <Botao href="tel:188">Ligar para o CVV (188)</Botao>
        </Cartao>
      )}
      <Cartao titulo="Uma pergunta, só se você quiser responder">
        <p>Neste momento, você pensa em se machucar ou em não estar mais aqui?</p>
        <div className="acoes">
          <Botao variante="secundario" onClick={() => navegar('/crise')}>Sim</Botao>
          <Botao variante="secundario" onClick={() => navegar('/')}>Não</Botao>
        </div>
      </Cartao>
      <Botao variante="discreto" para="/">Voltar ao início</Botao>
    </Pagina>
  )
}
