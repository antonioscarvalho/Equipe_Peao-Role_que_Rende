/**
 * Plano de prevenção de recaída (MVP #3): mapa de gatilhos + até 5 planos "Se… então…".
 * Conceito: situações de alto risco e intenções de implementação.
 * Skill: prevencao-recaida (Marlatt & Gordon). REVISÃO CLÍNICA PENDENTE dos exemplos.
 */
import { useState } from 'react'
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { Chips } from '@/components/Chips'
import { CampoTexto } from '@/components/CampoTexto'
import { useDados } from '@/hooks/DadosContext'
import { LIMITE_SE_ENTAO } from '@/domain/tipos'
import gatilhos from '@/content/gatilhos.json'

export function Plano() {
  const { estado, atualizar } = useDados()
  const [se, setSe] = useState('')
  const [entao, setEntao] = useState('')
  const opcoes = Array.from(new Set([...gatilhos.gatilhos, ...estado.plano.gatilhos]))
  const cheio = estado.plano.seEntao.length >= LIMITE_SE_ENTAO

  function adicionar() {
    if (!se.trim() || !entao.trim() || cheio) return
    atualizar((e) => ({ ...e, plano: { ...e.plano, seEntao: [...e.plano.seEntao, { se: se.trim(), entao: entao.trim() }] } }))
    setSe('')
    setEntao('')
  }

  function remover(i: number) {
    atualizar((e) => ({ ...e, plano: { ...e.plano, seEntao: e.plano.seEntao.filter((_, j) => j !== i) } }))
  }

  return (
    <Pagina titulo="Meu plano" voltarPara="/">
      <Cartao titulo="O que costuma puxar a vontade?">
        <Chips
          legenda="Marque os seus gatilhos"
          opcoes={opcoes}
          selecionados={estado.plano.gatilhos}
          aoMudar={(g) => atualizar((e) => ({ ...e, plano: { ...e.plano, gatilhos: g } }))}
        />
      </Cartao>

      <Cartao titulo="Se… então…">
        <p>Combine com você mesmo(a) o que fazer quando o gatilho aparecer. Até {LIMITE_SE_ENTAO} planos.</p>
        {estado.plano.seEntao.length === 0 ? (
          <p className="dica">
            Ainda não há planos. Exemplo: se {gatilhos.exemplosSeEntao[0].se}, então {gatilhos.exemplosSeEntao[0].entao}.
          </p>
        ) : (
          <ul className="lista lista--acoes">
            {estado.plano.seEntao.map((p, i) => (
              <li key={i}>
                <span>
                  Se {p.se}, então {p.entao}.
                </span>
                <Botao variante="discreto" onClick={() => remover(i)} rotuloAcessivel={`Remover plano: se ${p.se}`}>
                  Remover
                </Botao>
              </li>
            ))}
          </ul>
        )}
        {cheio ? (
          <p className="dica">Você chegou a {LIMITE_SE_ENTAO} planos. Remova um para criar outro.</p>
        ) : (
          <>
            <CampoTexto rotulo="Se…" valor={se} aoMudar={setSe} dica="Ex.: der vontade durante o jogo" />
            <CampoTexto rotulo="Então eu vou…" valor={entao} aoMudar={setEntao} dica="Ex.: abrir o SOS e esperar a onda passar" />
            <Botao onClick={adicionar} desabilitado={!se.trim() || !entao.trim()}>
              Adicionar plano
            </Botao>
          </>
        )}
      </Cartao>
    </Pagina>
  )
}
