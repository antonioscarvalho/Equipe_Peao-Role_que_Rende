import { conteudoPrevencao, preencher } from '@/content/conteudo'
import { linkSms, linkWhatsApp } from '@/domain/mensagem'

interface EnviarMensagemProps {
  nome: string
  /** Só dígitos, com 55. */
  telefone: string
  texto: string
}

const textos = conteudoPrevencao.circulo

/**
 * Links que abrem o WhatsApp ou o SMS da própria pessoa com a mensagem pronta (spec 005, CA-5).
 * São sempre <a>: quem decide enviar é a pessoa. O app nunca envia nada sozinho.
 */
export function EnviarMensagem({ nome, telefone, texto }: EnviarMensagemProps) {
  return (
    <div className="linha">
      <a
        className="botao botao--principal"
        href={linkWhatsApp(telefone, texto)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={preencher(textos.rotuloEnvio, { canal: textos.whatsapp, nome })}
      >
        {textos.whatsapp}
      </a>
      <a
        className="botao botao--secundario"
        href={linkSms(telefone, texto)}
        aria-label={preencher(textos.rotuloEnvio, { canal: textos.sms, nome })}
      >
        {textos.sms}
      </a>
    </div>
  )
}
