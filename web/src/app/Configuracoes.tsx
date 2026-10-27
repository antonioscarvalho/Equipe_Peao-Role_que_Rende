/**
 * Configurações: acessibilidade, privacidade (exportar e apagar com 1 ação) e limites do app.
 * Skill design-etico-saude-digital; docs/03-design/acessibilidade.md.
 */
import { useState } from 'react'
import { Pagina } from '@/components/Pagina'
import { Botao } from '@/components/Botao'
import { Cartao } from '@/components/Cartao'
import { Aviso } from '@/components/Aviso'
import { useDados } from '@/hooks/DadosContext'
import type { TamanhoFonte } from '@/domain/tipos'

const FONTES: { v: TamanhoFonte; rotulo: string }[] = [
  { v: 'normal', rotulo: 'Normal' },
  { v: 'grande', rotulo: 'Grande' },
  { v: 'maior', rotulo: 'Maior' },
]

export function Configuracoes() {
  const { estado, atualizar, apagarTudo, exportar } = useDados()
  const [confirmando, setConfirmando] = useState(false)
  const pref = estado.preferencias

  function baixar() {
    const blob = new Blob([exportar()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meus-dados-guardiao.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Pagina titulo="Configurações" voltarPara="/">
      <Cartao titulo="Acessibilidade">
        <fieldset className="chips">
          <legend className="chips__legenda">Tamanho do texto</legend>
          <div className="chips__lista">
            {FONTES.map((f) => (
              <button
                key={f.v}
                type="button"
                className="chip"
                aria-pressed={pref.fonte === f.v}
                onClick={() => atualizar((e) => ({ ...e, preferencias: { ...e.preferencias, fonte: f.v } }))}
              >
                {f.rotulo}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="confirmacao">
          <input
            type="checkbox"
            checked={pref.altoContraste}
            onChange={(e) => atualizar((s) => ({ ...s, preferencias: { ...s.preferencias, altoContraste: e.target.checked } }))}
          />
          <span>Alto contraste</span>
        </label>
        <label className="confirmacao">
          <input
            type="checkbox"
            checked={pref.reduzirMovimento}
            onChange={(e) => atualizar((s) => ({ ...s, preferencias: { ...s.preferencias, reduzirMovimento: e.target.checked } }))}
          />
          <span>Reduzir animações</span>
        </label>
      </Cartao>

      <Cartao titulo="Seus dados">
        <p>Tudo o que você registra fica só neste aparelho. Não há cadastro, servidor nem rastreamento.</p>
        <div className="acoes">
          <Botao variante="secundario" onClick={baixar}>Baixar meus dados</Botao>
          {!confirmando ? (
            <Botao variante="secundario" onClick={() => setConfirmando(true)}>Apagar tudo</Botao>
          ) : (
            <>
              <Botao
                onClick={() => {
                  apagarTudo()
                  setConfirmando(false)
                }}
              >
                Sim, apagar tudo
              </Botao>
              <Botao variante="discreto" onClick={() => setConfirmando(false)}>Cancelar</Botao>
            </>
          )}
        </div>
        {confirmando && <Aviso tipo="atencao">Isso apaga seus registros, plano e contatos deste aparelho. Não dá para desfazer.</Aviso>}
      </Cartao>

      <Cartao titulo="Sobre o Guardião">
        <p>
          Protótipo feito pela Equipe Peão no hackathon Rolê que Rende (BBDW 2026). É uma ferramenta de autoajuda e de ponte
          para ajuda especializada. Não faz diagnóstico e não substitui tratamento.
        </p>
        <p>
          Baseado em Entrevista Motivacional, Prevenção de Recaída e Terapia Cognitivo-Comportamental. Os textos ainda
          precisam de revisão por profissional de psicologia.
        </p>
      </Cartao>
    </Pagina>
  )
}
