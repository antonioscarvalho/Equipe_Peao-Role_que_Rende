/**
 * Registro diário simples + fluxo pós-lapso (MVP #4).
 * Conceito: efeito de violação da abstinência; lapso é informação, não fracasso (Marlatt & Gordon).
 * Skills: prevencao-recaida, entrevista-motivacional, seguranca-e-crise.
 * Regras: "Obrigado por registrar", sem destaque negativo; texto livre só OFERECE ajuda se houver sinal de risco.
 * REVISÃO CLÍNICA PENDENTE dos textos.
 */
import { useState } from 'react'
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { CampoTexto } from '@/components/CampoTexto'
import { Chips } from '@/components/Chips'
import { useDados } from '@/hooks/DadosContext'
import { hojeISO } from '@/domain/datas'
import { textoSugereRisco } from '@/domain/risco'
import { LIMITE_SE_ENTAO, type Registro as TRegistro } from '@/domain/tipos'
import gatilhos from '@/content/gatilhos.json'
import apoio from '@/content/apoio.json'

const HUMORES = [
  { v: 1, rotulo: 'Muito mal' },
  { v: 2, rotulo: 'Mal' },
  { v: 3, rotulo: 'Mais ou menos' },
  { v: 4, rotulo: 'Bem' },
  { v: 5, rotulo: 'Muito bem' },
]

export function Registro() {
  const { estado, atualizar } = useDados()
  const hoje = hojeISO()
  const existente = estado.registros.find((r) => r.data === hoje)
  const [apostou, setApostou] = useState<boolean | null>(existente?.apostou ?? null)
  const [humor, setHumor] = useState<number | undefined>(existente?.humor)
  const [antes, setAntes] = useState(existente?.posLapso?.antes ?? '')
  const [gatilhosMarcados, setGatilhosMarcados] = useState<string[]>([])
  const [ajuste, setAjuste] = useState(existente?.posLapso?.ajuste ?? '')
  const [salvo, setSalvo] = useState(false)

  function salvar() {
    if (apostou === null) return
    const gatilho = gatilhosMarcados.join(', ')
    const novo: TRegistro = {
      data: hoje,
      apostou,
      humor,
      ...(apostou ? { posLapso: { antes: antes.trim(), gatilho, ajuste: ajuste.trim() } } : {}),
    }
    atualizar((e) => {
      const registros = [...e.registros.filter((r) => r.data !== hoje), novo]
      const seEntao =
        apostou && ajuste.trim() && gatilho && e.plano.seEntao.length < LIMITE_SE_ENTAO
          ? [...e.plano.seEntao, { se: gatilho.toLowerCase(), entao: ajuste.trim() }]
          : e.plano.seEntao
      const gatilhosPlano = Array.from(new Set([...e.plano.gatilhos, ...gatilhosMarcados]))
      return { ...e, registros, plano: { gatilhos: gatilhosPlano, seEntao } }
    })
    setSalvo(true)
  }

  const risco = textoSugereRisco(`${antes} ${ajuste}`, apoio.palavrasRisco)

  if (salvo) {
    return (
      <Pagina titulo="Obrigado por registrar" voltarPara="/">
        {apostou ? (
          <>
            <p>Isso não apaga o que você já conquistou. Os seus dias sem apostar continuam contando.</p>
            <p>O que você anotou agora é informação para o seu plano, não um placar.</p>
          </>
        ) : (
          <p>Você cuidou de você hoje. Como se sente com isso?</p>
        )}
        {risco && (
          <Cartao titulo="Você não precisa passar por isso sozinho(a)">
            <p>Pelo que você escreveu, este pode ser um momento pesado. Quer ver opções de ajuda agora?</p>
            <Botao para="/crise">Ver opções de ajuda</Botao>
          </Cartao>
        )}
        <Botao larguraTotal para="/">Voltar ao início</Botao>
      </Pagina>
    )
  }

  return (
    <Pagina titulo="Como foi hoje?" voltarPara="/">
      <div className="acoes acoes--empilhadas" role="group" aria-label="Você apostou hoje?">
        <button type="button" className="opcao-grande" aria-pressed={apostou === false} onClick={() => setApostou(false)}>
          Não apostei
        </button>
        <button type="button" className="opcao-grande" aria-pressed={apostou === true} onClick={() => setApostou(true)}>
          Apostei
        </button>
      </div>

      <fieldset className="chips">
        <legend className="chips__legenda">Como você está se sentindo? (opcional)</legend>
        <div className="chips__lista">
          {HUMORES.map((h) => (
            <button key={h.v} type="button" className="chip" aria-pressed={humor === h.v} onClick={() => setHumor(humor === h.v ? undefined : h.v)}>
              {h.rotulo}
            </button>
          ))}
        </div>
      </fieldset>

      {apostou && (
        <Cartao titulo="Obrigado por contar">
          <p>Um lapso é informação, não fracasso. Se quiser, entenda o que aconteceu:</p>
          <CampoTexto rotulo="O que aconteceu antes? (opcional)" valor={antes} aoMudar={setAntes} multilinha />
          <Chips legenda="O que puxou a vontade? (opcional)" opcoes={gatilhos.gatilhos} selecionados={gatilhosMarcados} aoMudar={setGatilhosMarcados} />
          <CampoTexto
            rotulo="Da próxima vez, o que você pode fazer diferente? (opcional)"
            valor={ajuste}
            aoMudar={setAjuste}
            dica="Se você marcar o que puxou a vontade e escrever aqui, isso vira um plano Se… então…"
            multilinha
          />
        </Cartao>
      )}

      <Botao larguraTotal desabilitado={apostou === null} onClick={salvar}>
        Salvar
      </Botao>
    </Pagina>
  )
}
