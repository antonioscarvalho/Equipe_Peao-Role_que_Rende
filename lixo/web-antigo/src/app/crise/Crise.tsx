/**
 * Protocolo de crise (fluxo F3).
 * Conceito: encaminhamento imediato a ajuda humana; estabilização só depois das opções de ajuda.
 * Skill: seguranca-e-crise (obrigatória) · design-etico-saude-digital.
 * Fontes: CVV (https://cvv.org.br, conferido em 27/10/2026); risco de suicídio elevado no transtorno do jogo
 *   (Karlsson & Håkansson 2018, J Behav Addict) — ver docs/pesquisa/01-transtorno-do-jogo.md.
 * REVISÃO CLÍNICA PENDENTE dos textos.
 */
import { useEffect, useRef, useState } from 'react'
import { Botao } from '@/components/Botao'
import { LinkTelefone } from '@/components/LinkTelefone'
import { TimerOnda } from '@/components/TimerOnda'
import { canal } from '@/content/conteudo'

interface CriseProps {
  aoVoltar: () => void
}

const FRASES_RESPIRAR = ['Inspira contando até 4.', 'Segura um pouquinho.', 'Solta o ar devagar, contando até 6.']

export function Crise({ aoVoltar }: CriseProps) {
  const [respirando, setRespirando] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)
  const cvv = canal('cvv')
  const samu = canal('samu')
  const caps = canal('caps')

  useEffect(() => titulo.current?.focus(), [])

  return (
    <section className="tela tela--crise" aria-labelledby="crise-titulo">
      <h1 id="crise-titulo" ref={titulo} tabIndex={-1}>
        Parece que você tá passando por um momento muito difícil.
      </h1>
      <p className="tela__lead">Você não tá só nessa. Tem gente pronta pra conversar agora.</p>

      <div className="pilha">
        <LinkTelefone telefone={cvv.telefone!} rotulo={cvv.rotulo} descricao={cvv.descricao} destaque />
        <LinkTelefone telefone={samu.telefone!} rotulo={samu.rotulo} descricao={samu.descricao} />
        <div className="cartao">
          <p className="cartao__titulo">{caps.rotulo}</p>
          <p>{caps.descricao}</p>
        </div>
      </div>

      {respirando ? (
        <TimerOnda segundos={120} frases={FRASES_RESPIRAR} aoTerminar={() => setRespirando(false)} />
      ) : (
        <Botao variante="secundario" onClick={() => setRespirando(true)}>
          Quer respirar um pouco comigo enquanto isso?
        </Botao>
      )}

      <p className="aviso">Este app não é um serviço de emergência. Em perigo, ligue 192.</p>
      <p className="nota">Informação conferida em {formatarData(cvv.verificado_em)}.</p>

      <Botao variante="secundario" onClick={aoVoltar}>
        Voltar quando eu quiser
      </Botao>
    </section>
  )
}

function formatarData(iso: string | null): string {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}
