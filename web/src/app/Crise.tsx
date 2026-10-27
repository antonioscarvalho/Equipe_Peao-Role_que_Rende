/**
 * Protocolo de crise (MVP #7). Skill: seguranca-e-crise. Referência: NICE NG248; plano de segurança
 * adaptado de Stanley & Brown. Mortalidade por suicídio elevada no transtorno do jogo (Karlsson 2018).
 * Ordem obrigatória: tela calma → ajuda humana a 1 toque → respiração DEPOIS → plano de segurança.
 * Funciona offline (telefones no próprio app). Nada daqui vai para servidor ou analytics.
 * REVISÃO CLÍNICA PENDENTE.
 */
import { useState } from 'react'
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { CampoTexto } from '@/components/CampoTexto'
import { Respiracao } from '@/components/Respiracao'
import { useDados } from '@/hooks/DadosContext'
import type { PlanoSeguranca } from '@/domain/tipos'
import apoio from '@/content/apoio.json'

const CAMPOS: { chave: keyof PlanoSeguranca; rotulo: string }[] = [
  { chave: 'sinais', rotulo: 'Sinais de que estou entrando em crise' },
  { chave: 'acalma', rotulo: 'O que me acalma' },
  { chave: 'pessoas', rotulo: 'Pessoas e lugares que me fazem bem' },
  { chave: 'profissionais', rotulo: 'Profissionais e serviços que posso procurar' },
  { chave: 'ambiente', rotulo: 'Como deixar o ambiente mais seguro' },
]

export function Crise() {
  const { estado, atualizar } = useDados()
  const [respirar, setRespirar] = useState(false)
  const contato = estado.contatos[0]

  return (
    <Pagina titulo={apoio.crise.titulo} calma>
      <p>{apoio.crise.texto}</p>
      <div className="acoes acoes--empilhadas">
        {apoio.crise.contatos.map((c) => (
          <Botao key={c.id} href={`tel:${c.telefone}`} larguraTotal>
            {c.nome} · ligar {c.telefone}
          </Botao>
        ))}
        {contato && (
          <Botao href={`tel:${contato.telefone}`} variante="secundario" larguraTotal>
            Ligar para {contato.nome}
          </Botao>
        )}
        <Botao href="https://cvv.org.br" variante="secundario" larguraTotal>
          Conversar por chat no site do CVV
        </Botao>
      </div>
      <p>Você também pode ir à unidade de saúde (UBS) do seu bairro ou ao CAPS.</p>
      <p className="dica">{apoio.crise.limites}</p>

      <Cartao titulo="Quer respirar um pouco?">
        {respirar ? (
          <Respiracao />
        ) : (
          <Botao variante="secundario" onClick={() => setRespirar(true)}>
            Respirar junto
          </Botao>
        )}
      </Cartao>

      <Cartao titulo="Meu plano de segurança">
        <p className="dica">Escreva com calma, quando der. Fica só neste aparelho e você pode mudar quando quiser.</p>
        {CAMPOS.map((c) => (
          <CampoTexto
            key={c.chave}
            rotulo={c.rotulo}
            valor={estado.planoSeguranca[c.chave]}
            aoMudar={(v) => atualizar((e) => ({ ...e, planoSeguranca: { ...e.planoSeguranca, [c.chave]: v } }))}
            multilinha
          />
        ))}
      </Cartao>

      <Botao variante="discreto" para={estado.onboarding ? '/' : '/boas-vindas'}>
        Voltar ao app, sem pressa
      </Botao>
    </Pagina>
  )
}
