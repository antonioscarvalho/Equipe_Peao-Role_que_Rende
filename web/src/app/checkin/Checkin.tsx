/**
 * Pós-lapso do check-in diário (fluxo F4).
 * Conceito: efeito de violação da abstinência; o lapso é informação, não placar (Marlatt & Gordon).
 * Skills: prevencao-recaida · entrevista-motivacional · seguranca-e-crise · design-etico-saude-digital.
 * REVISÃO CLÍNICA PENDENTE dos textos (web/src/content/checkin.json).
 */
import { useEffect, useRef, useState } from 'react'
import { Botao } from '@/components/Botao'
import { Chips } from '@/components/Chips'
import { conteudoCheckin } from '@/content/conteudo'
import { textoSugereRisco } from '@/domain/risco'
import { useProgresso } from '@/hooks/useProgresso'

type Passo = 'agradecimento' | 'gatilho' | 'plano' | 'retomar'

interface CheckinProps {
  aoPedirAjuda: () => void
  aoTerminar: () => void
  hoje?: string
}

const textos = conteudoCheckin.posLapso

export function Checkin({ aoPedirAjuda, aoTerminar, hoje }: CheckinProps) {
  const { progresso, registrar } = useProgresso(hoje)
  const [passo, setPasso] = useState<Passo>('agradecimento')
  const [gatilhos, setGatilhos] = useState<string[]>([])
  const [relato, setRelato] = useState('')
  const titulo = useRef<HTMLHeadingElement>(null)

  // A cada passo o foco vai para o título, para o leitor de tela anunciar a troca.
  useEffect(() => titulo.current?.focus(), [passo])

  const depoisDoGatilho = () => {
    if (gatilhos.length || relato.trim()) registrar(true, { gatilhos, relato })
    setPasso('plano')
  }

  return (
    <section className="tela tela--checkin" aria-labelledby="checkin-titulo">
      {passo === 'agradecimento' && (
        <>
          <h1 id="checkin-titulo" ref={titulo} tabIndex={-1}>
            {textos.agradecimentoTitulo}
          </h1>
          <p className="tela__lead">{textos.agradecimento}</p>
          <Botao onClick={() => setPasso('gatilho')}>{textos.proximo}</Botao>
        </>
      )}

      {passo === 'gatilho' && (
        <>
          <h1 id="checkin-titulo" ref={titulo} tabIndex={-1}>
            {textos.perguntaGatilho}
          </h1>
          <Chips
            legenda={textos.perguntaGatilho}
            dica={textos.dicaGatilho}
            opcoes={conteudoCheckin.gatilhos}
            selecionados={gatilhos}
            aoMudar={setGatilhos}
          />
          <label htmlFor="relato">{textos.perguntaRelato}</label>
          <p className="nota" id="relato-dica">
            {textos.dicaRelato}
          </p>
          <textarea
            id="relato"
            className="campo"
            rows={3}
            maxLength={500}
            value={relato}
            onChange={(e) => setRelato(e.target.value)}
            aria-describedby="relato-dica"
          />
          {/* Só oferece: o "Próximo" continua valendo e nada é anotado como risco. */}
          {textoSugereRisco(relato, conteudoCheckin.sinaisDeRisco) && (
            <div className="aviso" role="status">
              <p>{textos.ofertaAjuda}</p>
              <Botao variante="alerta" onClick={aoPedirAjuda}>
                {textos.botaoAjuda}
              </Botao>
            </div>
          )}
          <Botao onClick={depoisDoGatilho}>{textos.proximo}</Botao>
        </>
      )}

      {passo === 'plano' && (
        <>
          <h1 id="checkin-titulo" ref={titulo} tabIndex={-1}>
            {textos.perguntaPlano}
          </h1>
          {/* "Editar meu plano" entra quando a spec 005 existir (decisão 4 do plano 004). */}
          <Botao variante="secundario" onClick={() => setPasso('retomar')}>
            {textos.agoraNao}
          </Botao>
        </>
      )}

      {passo === 'retomar' && (
        <>
          <h1 id="checkin-titulo" ref={titulo} tabIndex={-1}>
            {textos.retomar.replace('{n} dias', progresso.totalSemApostar === 1 ? '1 dia' : `${progresso.totalSemApostar} dias`)}
          </h1>
          <Botao onClick={aoTerminar}>{textos.voltar}</Botao>
        </>
      )}

      <Botao variante="alerta" onClick={aoPedirAjuda}>
        {textos.toMal}
      </Botao>
    </section>
  )
}
