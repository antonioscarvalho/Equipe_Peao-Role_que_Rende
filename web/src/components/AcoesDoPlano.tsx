import { useEffect, useState } from 'react'
import { EnviarMensagem } from '@/components/EnviarMensagem'
import { LinkTelefone } from '@/components/LinkTelefone'
import { canal, conteudoPrevencao, preencher } from '@/content/conteudo'
import { circulo } from '@/lib/circulo'
import type { ContatoCirculo, PlanoSeEntao } from '@/lib/db'
import { prevencao } from '@/lib/prevencao'

interface AcoesDoPlanoProps {
  /** Ideias gerais que aparecem sempre (vêm do conteúdo do SOS). */
  acoes: string[]
}

const textos = conteudoPrevencao.sos

/**
 * Passo "O que dá pra fazer agora?" do SOS (spec 005, CA-3 e CA-7).
 * Mostra os planos Se/Então e o Círculo da pessoa. Sem dados, convida a montar depois e mostra o CVV 188.
 * Nunca trava o SOS: as ideias gerais aparecem na hora e, se o banco falhar, vale o estado vazio.
 */
export function AcoesDoPlano({ acoes }: AcoesDoPlanoProps) {
  const [dados, setDados] = useState<{ planos: PlanoSeEntao[]; contatos: ContatoCirculo[] } | null>(null)

  useEffect(() => {
    let ativo = true
    Promise.all([prevencao.listarPlanos(), circulo.listar()])
      .then(([planos, contatos]) => ativo && setDados({ planos, contatos }))
      .catch(() => ativo && setDados({ planos: [], contatos: [] }))
    return () => {
      ativo = false
    }
  }, [])

  const vazio = dados !== null && dados.planos.length === 0 && dados.contatos.length === 0
  const cvv = canal('cvv')
  const mensagem = conteudoPrevencao.circulo.mensagens[0]

  return (
    <div className="acoes-do-plano">
      {dados && dados.planos.length > 0 && (
        <section aria-labelledby="acoes-planos">
          <h2 id="acoes-planos">{textos.tituloPlanos}</h2>
          <ul className="lista-acoes">
            {dados.planos.map((plano) => (
              <li key={plano.id}>{preencher(conteudoPrevencao.plano.modelo, { se: plano.se, entao: plano.entao })}</li>
            ))}
          </ul>
        </section>
      )}

      {dados && dados.contatos.length > 0 && (
        <section aria-labelledby="acoes-circulo">
          <h2 id="acoes-circulo">{textos.tituloCirculo}</h2>
          <ul className="lista-cartoes">
            {dados.contatos.map((contato) => (
              <li key={contato.id}>
                <p className="acoes-do-plano__nome">{contato.nome}</p>
                <EnviarMensagem nome={contato.nome} telefone={contato.telefone} texto={mensagem} />
              </li>
            ))}
          </ul>
          <p className="nota">{conteudoPrevencao.circulo.nota}</p>
        </section>
      )}

      <section aria-labelledby="acoes-ideias">
        <h2 id="acoes-ideias">{textos.outrasIdeias}</h2>
        <ul className="lista-acoes">
          {acoes.map((acao) => (
            <li key={acao}>{acao}</li>
          ))}
        </ul>
      </section>

      {vazio && (
        <div className="acoes-do-plano__convite">
          <p>{textos.convite}</p>
          <p>{textos.conviteConversa}</p>
          <LinkTelefone telefone={cvv.telefone!} rotulo={cvv.rotulo} />
        </div>
      )}
    </div>
  )
}
