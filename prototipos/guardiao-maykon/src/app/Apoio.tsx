/**
 * Hub de apoio (MVP #8) + Círculo de Confiança (MVP #9).
 * Conceito: apoio humano potencializa a autoajuda; rede de apoio reduz isolamento.
 * Skills: seguranca-e-crise, prevencao-recaida.
 * Regras: contatos só no aparelho; o app NUNCA envia mensagem sozinho (a pessoa toca e envia).
 */
import { useState } from 'react'
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { CampoTexto } from '@/components/CampoTexto'
import { Aviso } from '@/components/Aviso'
import { useDados } from '@/hooks/DadosContext'
import { LIMITE_CONTATOS } from '@/domain/tipos'
import { formatarData } from '@/domain/datas'
import apoio from '@/content/apoio.json'

export function Apoio() {
  const { estado, atualizar } = useDados()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const cheio = estado.contatos.length >= LIMITE_CONTATOS

  function adicionar() {
    if (!nome.trim() || telefone.replace(/\D/g, '').length < 8 || cheio) return
    atualizar((e) => ({ ...e, contatos: [...e.contatos, { nome: nome.trim(), telefone: telefone.trim() }] }))
    setNome('')
    setTelefone('')
  }

  return (
    <Pagina titulo="Apoio e contatos" voltarPara="/">
      <Cartao titulo="Meu círculo de confiança">
        <p>Até {LIMITE_CONTATOS} pessoas para chamar quando a vontade apertar. Os contatos ficam só neste aparelho.</p>
        {estado.contatos.length === 0 && <p className="dica">Ninguém por aqui ainda. Pense em alguém que te escuta sem julgar.</p>}
        <ul className="lista lista--acoes">
          {estado.contatos.map((c, i) => (
            <li key={`${c.nome}-${i}`}>
              <span>{c.nome}</span>
              <span className="acoes">
                <Botao href={`tel:${c.telefone}`}>Ligar</Botao>
                <Botao
                  variante="secundario"
                  href={`https://wa.me/${c.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(apoio.mensagemContato)}`}
                >
                  Mensagem
                </Botao>
                <Botao
                  variante="discreto"
                  rotuloAcessivel={`Remover ${c.nome}`}
                  onClick={() => atualizar((e) => ({ ...e, contatos: e.contatos.filter((_, j) => j !== i) }))}
                >
                  Remover
                </Botao>
              </span>
            </li>
          ))}
        </ul>
        {!cheio && (
          <>
            <CampoTexto rotulo="Nome" valor={nome} aoMudar={setNome} />
            <CampoTexto rotulo="Telefone com DDD" valor={telefone} aoMudar={setTelefone} tipo="tel" modoTeclado="tel" />
            <Botao onClick={adicionar} desabilitado={!nome.trim() || telefone.replace(/\D/g, '').length < 8}>
              Adicionar ao círculo
            </Botao>
          </>
        )}
        <p className="dica">Mensagem pronta: “{apoio.mensagemContato}” O Guardião nunca envia nada sozinho.</p>
      </Cartao>

      <h2 className="secao">Ajuda especializada</h2>
      {apoio.hub.map((s) => (
        <Cartao key={s.id} titulo={s.nome} nivelTitulo={3}>
          <p>{s.descricao}</p>
          {'aviso' in s && s.aviso && <Aviso tipo="atencao">{s.aviso}</Aviso>}
          <div className="acoes">
            {'telefone' in s && s.telefone && <Botao href={`tel:${s.telefone}`}>Ligar {s.telefone}</Botao>}
            {'link' in s && s.link && (
              <Botao variante="secundario" href={s.link}>
                Abrir site
              </Botao>
            )}
          </div>
        </Cartao>
      ))}
      <p className="dica">Contatos verificados em {formatarData(apoio.verificadoEm)}.</p>
    </Pagina>
  )
}
