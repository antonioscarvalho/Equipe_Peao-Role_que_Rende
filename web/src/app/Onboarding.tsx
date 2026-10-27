/**
 * Onboarding "Seu motivo" (MVP #1).
 * Conceito: ambivalência e motivação própria; evocar "fala de mudança".
 * Skill: entrevista-motivacional (Miller & Rollnick). Evidência: Yakovenko et al., 2015 (meta-análise).
 * Regras: no máximo 5 telas; quem ainda não decidiu parar não é empurrado para um plano.
 * REVISÃO CLÍNICA PENDENTE dos textos.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Chips } from '@/components/Chips'
import { CampoTexto } from '@/components/CampoTexto'
import { Escala0a10 } from '@/components/Escala0a10'
import { Aviso } from '@/components/Aviso'
import { useDados } from '@/hooks/DadosContext'
import { hojeISO } from '@/domain/datas'
import motivos from '@/content/motivos.json'

const TOTAL = 4

export function Onboarding() {
  const { atualizar } = useDados()
  const navegar = useNavigate()
  const [passo, setPasso] = useState(0)
  const [aceite, setAceite] = useState(false)
  const [escolhidos, setEscolhidos] = useState<string[]>([])
  const [texto, setTexto] = useState('')
  const [importancia, setImportancia] = useState<number | null>(null)
  const [confianca, setConfianca] = useState<number | null>(null)
  const [gasto, setGasto] = useState('')
  const [meta, setMeta] = useState('')

  function concluir() {
    const valor = Number(gasto.replace(/\./g, '').replace(',', '.'))
    atualizar((e) => ({
      ...e,
      onboarding: {
        concluidoEm: new Date().toISOString(),
        inicio: hojeISO(),
        motivos: escolhidos,
        motivoTexto: texto.trim(),
        importancia: importancia ?? 0,
        confianca: confianca ?? 0,
        gastoSemanal: Number.isFinite(valor) && valor > 0 ? valor : null,
        metaConcreta: meta.trim(),
      },
    }))
    navegar('/', { replace: true })
  }

  const progresso = <p className="passo">Passo {passo + 1} de {TOTAL}</p>

  if (passo === 0) {
    return (
      <Pagina titulo="Oi. Este espaço é seu.">
        {progresso}
        <p>O Guardião ajuda você a atravessar a vontade de apostar, cuidar do seu dinheiro e encontrar apoio.</p>
        <ul className="lista">
          <li>Funciona sem internet e sem cadastro.</li>
          <li>O que você escrever fica <strong>só neste aparelho</strong>. Você pode apagar tudo quando quiser.</li>
          <li>Não é atendimento de saúde nem serviço de emergência. Em crise, ligue 188 (CVV) ou 192 (SAMU).</li>
        </ul>
        <Aviso>Se você tem menos de 18 anos, converse com um adulto de confiança e procure a unidade de saúde do seu bairro.</Aviso>
        <label className="confirmacao">
          <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
          <span>Entendi. Quero guardar minhas respostas neste aparelho.</span>
        </label>
        <Botao larguraTotal desabilitado={!aceite} onClick={() => setPasso(1)}>
          Começar
        </Botao>
      </Pagina>
    )
  }

  if (passo === 1) {
    return (
      <Pagina titulo={motivos.pergunta}>
        {progresso}
        <p>Não tem resposta certa. Escolha o que for seu, ou escreva do seu jeito.</p>
        <Chips legenda="Motivos comuns" opcoes={motivos.motivos} selecionados={escolhidos} aoMudar={setEscolhidos} />
        <CampoTexto rotulo="Com as suas palavras (opcional)" valor={texto} aoMudar={setTexto} multilinha />
        <div className="acoes">
          <Botao variante="secundario" onClick={() => setPasso(0)}>Voltar</Botao>
          <Botao onClick={() => setPasso(2)}>Continuar</Botao>
        </div>
      </Pagina>
    )
  }

  if (passo === 2) {
    return (
      <Pagina titulo="Como você está com essa mudança?">
        {progresso}
        <Escala0a10 pergunta="Quão importante é, para você, mudar sua relação com as apostas?" valor={importancia} aoMudar={setImportancia} />
        {importancia !== null && importancia > 0 && (
          <p className="reflexao">
            Você marcou {importancia}, e não 0. O que faz ser {importancia}? Guarde essa resposta: ela é sua.
          </p>
        )}
        <Escala0a10 pergunta="E quão confiante você está de que consegue?" valor={confianca} aoMudar={setConfianca} />
        <p className="dica">Tudo bem se ainda não decidiu parar. Você pode só observar por um tempo.</p>
        <div className="acoes">
          <Botao variante="secundario" onClick={() => setPasso(1)}>Voltar</Botao>
          <Botao onClick={() => setPasso(3)}>Continuar</Botao>
        </div>
      </Pagina>
    )
  }

  return (
    <Pagina titulo="Para onde vai o dinheiro preservado?">
      {progresso}
      <p>Isso é opcional. Serve para o Guardião mostrar quanto você deixou de gastar com apostas.</p>
      <CampoTexto
        rotulo="Quanto você costumava apostar por semana? (R$, estimativa)"
        valor={gasto}
        aoMudar={setGasto}
        tipo="text"
        modoTeclado="decimal"
        dica="Um valor aproximado já ajuda. Você pode mudar depois."
      />
      <CampoTexto
        rotulo="O que você quer fazer com esse dinheiro?"
        valor={meta}
        aoMudar={setMeta}
        dica="Algo concreto, como pagar a conta de luz ou comprar o botijão."
      />
      <div className="acoes">
        <Botao variante="secundario" onClick={() => setPasso(2)}>Voltar</Botao>
        <Botao onClick={concluir}>Concluir</Botao>
      </div>
    </Pagina>
  )
}
