/**
 * Seu Círculo de Confiança (fluxo F8, spec 005).
 * Conceito: rede de apoio pessoal reduz o isolamento (ver docs/pesquisa/02-intervencoes.md).
 * Privacidade: nome e telefone são dado de terceiro (LGPD). Ficam só neste aparelho, nunca vão para a rede.
 * O app só abre o WhatsApp/SMS da pessoa com o texto pronto; quem envia é ela.
 * Skills: prevencao-recaida · design-etico-saude-digital · conformidade-legal-br.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Botao } from '@/components/Botao'
import { EnviarMensagem } from '@/components/EnviarMensagem'
import { conteudoPrevencao } from '@/content/conteudo'
import { formatarTelefone, normalizarTelefone } from '@/domain/mensagem'
import { circulo, LIMITE_CONTATOS, LimiteAtingido } from '@/lib/circulo'
import type { ContatoCirculo } from '@/lib/db'

export interface CirculoProps {
  aoAbrirPlano: () => void
  aoVoltar: () => void
}

const textos = conteudoPrevencao.circulo

type Modo = { tipo: 'lista' } | { tipo: 'editor'; contato?: ContatoCirculo }

export function Circulo({ aoAbrirPlano, aoVoltar }: CirculoProps) {
  const [modo, setModo] = useState<Modo>({ tipo: 'lista' })
  const [contatos, setContatos] = useState<ContatoCirculo[] | null>(null)
  const [mensagem, setMensagem] = useState(textos.mensagens[0])
  const [aviso, setAviso] = useState('')
  const titulo = useRef<HTMLHeadingElement>(null)

  // A cada troca de passo (lista ↔ editor) o foco vai para o título, para o leitor de tela anunciar.
  useEffect(() => titulo.current?.focus(), [modo])

  useEffect(() => {
    let ativo = true
    circulo
      .listar()
      .then((lista) => ativo && setContatos(lista))
      .catch(() => {
        if (!ativo) return
        setContatos([])
        setAviso(conteudoPrevencao.erroSalvar)
      })
    return () => {
      ativo = false
    }
  }, [])

  const recarregar = async (texto: string) => {
    setContatos(await circulo.listar())
    setAviso(texto)
    setModo({ tipo: 'lista' })
  }

  const apagar = async (contato: ContatoCirculo) => {
    try {
      await circulo.apagar(contato.id)
      await recarregar(textos.apagado)
    } catch {
      setAviso(conteudoPrevencao.erroSalvar)
    }
  }

  const carregarExemplo = async () => {
    try {
      await circulo.salvar(conteudoPrevencao.demo.contato)
      await recarregar(textos.salvo)
    } catch (erro) {
      setAviso(erro instanceof LimiteAtingido ? textos.limite : conteudoPrevencao.erroSalvar)
    }
  }

  if (modo.tipo === 'editor') {
    return (
      <section className="tela tela--circulo" aria-labelledby="circulo-titulo">
        <h1 id="circulo-titulo" ref={titulo} tabIndex={-1}>
          {modo.contato ? textos.tituloEditar : textos.tituloNovo}
        </h1>
        <p className="nota">{textos.explicacao}</p>
        <EditorContato
          contato={modo.contato}
          aoSalvar={() => recarregar(textos.salvo)}
          aoCancelar={() => {
            setAviso('')
            setModo({ tipo: 'lista' })
          }}
        />
      </section>
    )
  }

  const noLimite = contatos !== null && contatos.length >= LIMITE_CONTATOS

  return (
    <section className="tela tela--circulo" aria-labelledby="circulo-titulo">
      <h1 id="circulo-titulo" ref={titulo} tabIndex={-1}>
        {textos.titulo}
      </h1>
      <p className="tela__lead">{textos.explicacao}</p>
      <p className="aviso" role="status">
        {aviso}
      </p>

      {contatos === null && <div className="esqueleto" role="status" aria-label="Carregando seu Círculo" />}
      {contatos !== null && contatos.length === 0 && <p>{textos.vazio}</p>}
      {contatos !== null && contatos.length > 0 && (
        <>
          <fieldset className="campo campo--opcoes">
            <legend>{textos.rotuloMensagem}</legend>
            {textos.mensagens.map((texto) => (
              <label key={texto} className="opcao">
                <input
                  type="radio"
                  name="circulo-mensagem"
                  value={texto}
                  checked={mensagem === texto}
                  onChange={() => setMensagem(texto)}
                />
                {texto}
              </label>
            ))}
          </fieldset>

          <ul className="lista-cartoes">
            {contatos.map((contato) => (
              <li key={contato.id} className="cartao cartao--item">
                <h2 id={`contato-${contato.id}`}>{contato.nome}</h2>
                <p>{formatarTelefone(contato.telefone)}</p>
                <EnviarMensagem nome={contato.nome} telefone={contato.telefone} texto={mensagem} />
                <div className="linha">
                  <Botao
                    variante="secundario"
                    aria-describedby={`contato-${contato.id}`}
                    onClick={() => {
                      setAviso('')
                      setModo({ tipo: 'editor', contato })
                    }}
                  >
                    {textos.editar}
                  </Botao>
                  <Botao variante="secundario" aria-describedby={`contato-${contato.id}`} onClick={() => apagar(contato)}>
                    {textos.apagar}
                  </Botao>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="nota nota--fixa">{textos.nota}</p>

      {noLimite ? (
        <p className="aviso">{textos.limite}</p>
      ) : (
        contatos !== null && (
          <Botao
            onClick={() => {
              setAviso('')
              setModo({ tipo: 'editor' })
            }}
          >
            {textos.adicionar}
          </Botao>
        )
      )}

      {import.meta.env.DEV && !noLimite && contatos !== null && (
        <Botao variante="secundario" onClick={carregarExemplo}>
          {conteudoPrevencao.demo.botao}
        </Botao>
      )}

      <div className="linha">
        <Botao variante="secundario" onClick={aoAbrirPlano}>
          {textos.irPlano}
        </Botao>
        <Botao variante="secundario" onClick={aoVoltar}>
          {textos.voltar}
        </Botao>
      </div>
    </section>
  )
}

interface EditorContatoProps {
  contato?: ContatoCirculo
  aoSalvar: () => void
  aoCancelar: () => void
}

function EditorContato({ contato, aoSalvar, aoCancelar }: EditorContatoProps) {
  const [nome, setNome] = useState(contato?.nome ?? '')
  const [telefone, setTelefone] = useState(contato ? formatarTelefone(contato.telefone) : '')
  const [erros, setErros] = useState<{ nome?: string; telefone?: string; geral?: string }>({})
  const campoNome = useRef<HTMLInputElement>(null)
  const campoTelefone = useRef<HTMLInputElement>(null)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    const novos = {
      nome: nome.trim() ? undefined : textos.erroNome,
      telefone: normalizarTelefone(telefone) ? undefined : textos.erroTelefone,
    }
    setErros(novos)
    if (novos.nome) return campoNome.current?.focus()
    if (novos.telefone) return campoTelefone.current?.focus()

    try {
      await circulo.salvar({ id: contato?.id, nome, telefone })
      aoSalvar()
    } catch (erro) {
      setErros({ geral: erro instanceof LimiteAtingido ? textos.limite : conteudoPrevencao.erroSalvar })
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor="circulo-nome">{textos.rotuloNome}</label>
        {/* autocomplete desligado: o dado é de outra pessoa, não da dona do aparelho. */}
        <input
          id="circulo-nome"
          ref={campoNome}
          type="text"
          maxLength={40}
          autoComplete="off"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-invalid={Boolean(erros.nome)}
          aria-describedby={erros.nome ? 'circulo-nome-erro' : undefined}
        />
        {erros.nome && (
          <p id="circulo-nome-erro" className="campo__erro">
            {erros.nome}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="circulo-telefone">{textos.rotuloTelefone}</label>
        <p id="circulo-telefone-dica" className="campo__dica">
          {textos.dicaTelefone}
        </p>
        <input
          id="circulo-telefone"
          ref={campoTelefone}
          type="tel"
          inputMode="tel"
          maxLength={20}
          autoComplete="off"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          aria-invalid={Boolean(erros.telefone)}
          aria-describedby={erros.telefone ? 'circulo-telefone-dica circulo-telefone-erro' : 'circulo-telefone-dica'}
        />
        {erros.telefone && (
          <p id="circulo-telefone-erro" className="campo__erro">
            {erros.telefone}
          </p>
        )}
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
