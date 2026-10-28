/**
 * Seu plano pros momentos difíceis (fluxo F5, spec 005).
 * Conceito: intenções de implementação ("Se [gatilho], então [ação]") como parte da prevenção de recaída
 *   (Marlatt & Gordon). Para apostas, a evidência específica ainda é opinião de especialista.
 * Skills: prevencao-recaida · design-etico-saude-digital.
 * REVISÃO CLÍNICA PENDENTE dos textos (web/src/content/prevencao.json).
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Botao } from '@/components/Botao'
import { Chips } from '@/components/Chips'
import { conteudoPrevencao, preencher } from '@/content/conteudo'
import type { PlanoSeEntao } from '@/lib/db'
import { LIMITE_PLANOS, LimiteAtingido, prevencao } from '@/lib/prevencao'

export interface PlanoProps {
  /** Gatilhos já marcados ao abrir (ex.: vindos do pós-lapso). Vêm só em memória, nunca pela URL. */
  gatilhosIniciais?: string[]
  aoAbrirCirculo: () => void
  aoVoltar: () => void
}

const textos = conteudoPrevencao.plano
const OUTRO = conteudoPrevencao.gatilhoOutro

type Modo = { tipo: 'lista' } | { tipo: 'editor'; plano?: PlanoSeEntao }

export function Plano({ gatilhosIniciais = [], aoAbrirCirculo, aoVoltar }: PlanoProps) {
  const [modo, setModo] = useState<Modo>({ tipo: 'lista' })
  const [gatilhos, setGatilhos] = useState<string[]>(gatilhosIniciais)
  const [outro, setOutro] = useState('')
  const [planos, setPlanos] = useState<PlanoSeEntao[] | null>(null)
  const [aviso, setAviso] = useState('')
  const titulo = useRef<HTMLHeadingElement>(null)

  // A cada troca de passo (lista ↔ editor) o foco vai para o título, para o leitor de tela anunciar.
  useEffect(() => titulo.current?.focus(), [modo])

  useEffect(() => {
    let ativo = true
    Promise.all([prevencao.lerGatilhos(), prevencao.listarPlanos()])
      .then(([salvos, lista]) => {
        if (!ativo) return
        const juntos = [...new Set([...(salvos?.selecionados ?? []), ...gatilhosIniciais])]
        setGatilhos(juntos)
        setOutro(salvos?.outro ?? '')
        setPlanos(lista)
        if (gatilhosIniciais.some((g) => !salvos?.selecionados.includes(g))) {
          prevencao.salvarGatilhos(juntos, salvos?.outro).catch(() => undefined)
        }
      })
      .catch(() => {
        if (!ativo) return
        setPlanos([])
        setAviso(conteudoPrevencao.erroSalvar)
      })
    return () => {
      ativo = false
    }
    // Os gatilhos iniciais só valem na abertura da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const salvarGatilhos = (selecionados: string[], textoOutro: string) => {
    prevencao.salvarGatilhos(selecionados, selecionados.includes(OUTRO) ? textoOutro : undefined).catch(() =>
      setAviso(conteudoPrevencao.erroSalvar),
    )
  }

  const mudarGatilhos = (selecionados: string[]) => {
    setGatilhos(selecionados)
    salvarGatilhos(selecionados, outro)
  }

  const recarregar = async (mensagem: string) => {
    setPlanos(await prevencao.listarPlanos())
    setAviso(mensagem)
    setModo({ tipo: 'lista' })
  }

  const apagar = async (plano: PlanoSeEntao) => {
    try {
      await prevencao.apagarPlano(plano.id)
      await recarregar(textos.apagado)
    } catch {
      setAviso(conteudoPrevencao.erroSalvar)
    }
  }

  const carregarExemplo = async () => {
    try {
      await prevencao.salvarPlano(conteudoPrevencao.demo.plano)
      await recarregar(textos.salvo)
    } catch (erro) {
      setAviso(erro instanceof LimiteAtingido ? textos.limite : conteudoPrevencao.erroSalvar)
    }
  }

  if (modo.tipo === 'editor') {
    return (
      <section className="tela tela--plano" aria-labelledby="plano-titulo">
        <h1 id="plano-titulo" ref={titulo} tabIndex={-1}>
          {modo.plano ? textos.tituloEditar : textos.tituloNovo}
        </h1>
        <EditorPlano
          plano={modo.plano}
          aoSalvar={() => recarregar(textos.salvo)}
          aoCancelar={() => {
            setAviso('')
            setModo({ tipo: 'lista' })
          }}
        />
      </section>
    )
  }

  const noLimite = planos !== null && planos.length >= LIMITE_PLANOS

  return (
    <section className="tela tela--plano" aria-labelledby="plano-titulo">
      <h1 id="plano-titulo" ref={titulo} tabIndex={-1}>
        {textos.titulo}
      </h1>
      <p className="aviso" role="status">
        {aviso}
      </p>

      {planos === null ? (
        <div className="esqueleto" role="status" aria-label="Carregando seu plano" />
      ) : (
        <Chips
          legenda={textos.perguntaGatilhos}
          dica={textos.dicaGatilhos}
          opcoes={conteudoPrevencao.gatilhos}
          selecionados={gatilhos}
          aoMudar={mudarGatilhos}
        />
      )}
      {planos !== null && gatilhos.includes(OUTRO) && (
        <div className="campo">
          <label htmlFor="plano-outro">{textos.rotuloOutro}</label>
          <input
            id="plano-outro"
            type="text"
            maxLength={80}
            value={outro}
            onChange={(e) => setOutro(e.target.value)}
            onBlur={() => salvarGatilhos(gatilhos, outro)}
          />
        </div>
      )}

      <h2>{textos.tituloPlanos}</h2>
      {planos !== null && planos.length === 0 && <p>{textos.vazio}</p>}
      {planos !== null && planos.length > 0 && (
        <ul className="lista-cartoes">
          {planos.map((plano) => (
            <li key={plano.id} className="cartao cartao--item">
              <p id={`plano-${plano.id}`}>{preencher(textos.modelo, { se: plano.se, entao: plano.entao })}</p>
              <div className="linha">
                <Botao
                  variante="secundario"
                  aria-describedby={`plano-${plano.id}`}
                  onClick={() => {
                    setAviso('')
                    setModo({ tipo: 'editor', plano })
                  }}
                >
                  {textos.editar}
                </Botao>
                <Botao variante="secundario" aria-describedby={`plano-${plano.id}`} onClick={() => apagar(plano)}>
                  {textos.apagar}
                </Botao>
              </div>
            </li>
          ))}
        </ul>
      )}

      {noLimite ? (
        <p className="aviso">{textos.limite}</p>
      ) : (
        planos !== null && (
          <Botao
            onClick={() => {
              setAviso('')
              setModo({ tipo: 'editor' })
            }}
          >
            {textos.novo}
          </Botao>
        )
      )}

      {import.meta.env.DEV && !noLimite && planos !== null && (
        <Botao variante="secundario" onClick={carregarExemplo}>
          {conteudoPrevencao.demo.botao}
        </Botao>
      )}

      <div className="linha">
        <Botao variante="secundario" onClick={aoAbrirCirculo}>
          {textos.irCirculo}
        </Botao>
        <Botao variante="secundario" onClick={aoVoltar}>
          {textos.voltar}
        </Botao>
      </div>
    </section>
  )
}

interface EditorPlanoProps {
  plano?: PlanoSeEntao
  aoSalvar: () => void
  aoCancelar: () => void
}

/** Dois campos e um botão salvar (CA-2). */
function EditorPlano({ plano, aoSalvar, aoCancelar }: EditorPlanoProps) {
  const [se, setSe] = useState(plano?.se ?? '')
  const [entao, setEntao] = useState(plano?.entao ?? '')
  const [erros, setErros] = useState<{ se?: string; entao?: string; geral?: string }>({})
  const campoSe = useRef<HTMLInputElement>(null)
  const campoEntao = useRef<HTMLInputElement>(null)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    const novos = {
      se: se.trim() ? undefined : textos.erroSe,
      entao: entao.trim() ? undefined : textos.erroEntao,
    }
    setErros(novos)
    if (novos.se) return campoSe.current?.focus()
    if (novos.entao) return campoEntao.current?.focus()

    try {
      await prevencao.salvarPlano({ id: plano?.id, se, entao })
      aoSalvar()
    } catch (erro) {
      setErros({ geral: erro instanceof LimiteAtingido ? textos.limite : conteudoPrevencao.erroSalvar })
    }
  }

  const descricao = (id: string, erro?: string) => (erro ? `${id}-dica ${id}-erro` : `${id}-dica`)

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor="plano-se">{textos.rotuloSe}</label>
        <p id="plano-se-dica" className="campo__dica">
          {textos.dicaSe}
        </p>
        <input
          id="plano-se"
          ref={campoSe}
          type="text"
          maxLength={120}
          value={se}
          onChange={(e) => setSe(e.target.value)}
          aria-invalid={Boolean(erros.se)}
          aria-describedby={descricao('plano-se', erros.se)}
        />
        {erros.se && (
          <p id="plano-se-erro" className="campo__erro">
            {erros.se}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="plano-entao">{textos.rotuloEntao}</label>
        <p id="plano-entao-dica" className="campo__dica">
          {textos.dicaEntao}
        </p>
        <input
          id="plano-entao"
          ref={campoEntao}
          type="text"
          maxLength={120}
          value={entao}
          onChange={(e) => setEntao(e.target.value)}
          aria-invalid={Boolean(erros.entao)}
          aria-describedby={descricao('plano-entao', erros.entao)}
        />
        {erros.entao && (
          <p id="plano-entao-erro" className="campo__erro">
            {erros.entao}
          </p>
        )}
      </div>

      <div className="exemplos" role="group" aria-labelledby="plano-ideias">
        <p id="plano-ideias" className="campo__dica">
          {textos.ideias}
        </p>
        <div className="linha">
          {textos.exemplos.map((exemplo) => (
            <button
              key={exemplo}
              type="button"
              className="chip"
              onClick={() => {
                setEntao(exemplo)
                campoEntao.current?.focus()
              }}
            >
              {exemplo}
            </button>
          ))}
        </div>
      </div>

      <p className="aviso" role="status">
        {erros.geral ?? ''}
      </p>
      <div className="linha">
        <Botao type="submit">{textos.salvar}</Botao>
        <Botao variante="secundario" onClick={aoCancelar}>
          {textos.cancelar}
        </Botao>
      </div>
    </form>
  )
}
