import { useEffect, useRef } from 'react'
import { Bichinho } from '@/components/Bichinho'
import { Botao } from '@/components/Botao'
import {
  APARENCIA_PADRAO,
  CABECA,
  CORES,
  CORES_ROUPA,
  PEITO,
  ROSTO,
  ROUPAS,
  aparenciaVisivel,
  diasQueFaltam,
  liberado,
  proximoMarco,
  type Aparencia,
  type OpcaoCor,
  type OpcaoItem,
} from '@/domain/aparencia'
import { estagioGuardiao } from '@/domain/progresso'
import { useAparencia } from '@/hooks/useAparencia'
import { useProgresso } from '@/hooks/useProgresso'

interface PersonalizarProps {
  aoVoltar: () => void
  reduzir?: boolean
  /** Os testes passam um dia fixo. */
  hoje?: string
}

const plural = (n: number) => (n === 1 ? '1 dia' : `${n} dias`)

/**
 * Personalização do bichinho. Tudo é livre, menos os 3 itens de marco (7, 30, 90 dias),
 * que aparecem desde já com quantos dias faltam. Sem loja, moeda ou sorteio.
 */
export function Personalizar({ aoVoltar, reduzir = false, hoje }: PersonalizarProps) {
  const { aparencia, carregada, mudar } = useAparencia()
  const { estado, progresso } = useProgresso(hoje)
  const titulo = useRef<HTMLHeadingElement>(null)
  const dias = progresso.totalSemApostar
  const visivel = aparenciaVisivel(aparencia, dias)
  const proximo = estado === 'pronto' ? proximoMarco(dias) : null

  useEffect(() => titulo.current?.focus(), [])

  return (
    <section className="tela tela--personalizar" aria-labelledby="personalizar-titulo">
      <h1 id="personalizar-titulo" ref={titulo} tabIndex={-1}>
        Deixe o bichinho com a sua cara
      </h1>
      <p className="nota">Tudo aqui é livre. Mude quando quiser; fica salvo só neste celular.</p>

      <div className="personalizar__previa">
        <Bichinho humor="calmo" nivel={estagioGuardiao(dias)} tamanho={180} reduzir={reduzir} aparencia={visivel} />
      </div>

      {proximo && (
        <p className="personalizar__marco" role="status">
          Próximo marco: <strong>{proximo.item.nome}</strong> com {plural(proximo.item.marco ?? 0)} sem apostar. Faltam{' '}
          {plural(proximo.faltam)}.
        </p>
      )}

      <fieldset className="personalizar__grupo" disabled={!carregada}>
        <legend>Cor do corpo</legend>
        <Cores nome="cor" opcoes={CORES} valor={aparencia.cor} aoMudar={(cor) => mudar({ cor })} />
      </fieldset>

      <Itens titulo="Roupa" nome="roupa" opcoes={ROUPAS} valor={aparencia.roupa} dias={dias} desativado={!carregada} aoMudar={(roupa) => mudar({ roupa })} />

      <fieldset className="personalizar__grupo" disabled={!carregada}>
        <legend>Cor da roupa e dos acessórios</legend>
        <Cores nome="corRoupa" opcoes={CORES_ROUPA} valor={aparencia.corRoupa} aoMudar={(corRoupa) => mudar({ corRoupa })} />
      </fieldset>

      <Itens titulo="Cabeça" nome="cabeca" opcoes={CABECA} valor={aparencia.cabeca} dias={dias} desativado={!carregada} aoMudar={(cabeca) => mudar({ cabeca })} />
      <Itens titulo="Rosto" nome="rosto" opcoes={ROSTO} valor={aparencia.rosto} dias={dias} desativado={!carregada} aoMudar={(rosto) => mudar({ rosto })} />
      <Itens titulo="Peito" nome="peito" opcoes={PEITO} valor={aparencia.peito} dias={dias} desativado={!carregada} aoMudar={(peito) => mudar({ peito })} />

      <div className="linha">
        <Botao variante="secundario" onClick={() => mudar({ ...APARENCIA_PADRAO })}>
          Voltar ao visual original
        </Botao>
        <Botao onClick={aoVoltar}>Pronto</Botao>
      </div>
    </section>
  )
}

interface CoresProps {
  nome: keyof Aparencia
  opcoes: OpcaoCor[]
  valor: string
  aoMudar: (id: string) => void
}

function Cores({ nome, opcoes, valor, aoMudar }: CoresProps) {
  return (
    <div className="personalizar__opcoes">
      {opcoes.map((c) => (
        <label key={c.id} className="amostra">
          <input type="radio" name={nome} value={c.id} checked={valor === c.id} onChange={() => aoMudar(c.id)} />
          <span className="amostra__cor" style={{ background: c.valor }} aria-hidden="true" />
          <span className="amostra__nome">{c.nome}</span>
        </label>
      ))}
    </div>
  )
}

interface ItensProps {
  titulo: string
  nome: keyof Aparencia
  opcoes: OpcaoItem[]
  valor: string
  dias: number
  desativado: boolean
  aoMudar: (id: string) => void
}

function Itens({ titulo, nome, opcoes, valor, dias, desativado, aoMudar }: ItensProps) {
  return (
    <fieldset className="personalizar__grupo" disabled={desativado}>
      <legend>{titulo}</legend>
      <div className="personalizar__opcoes">
        {opcoes.map((item) => {
          const livre = liberado(item, dias)
          const idDica = `dica-${nome}-${item.id}`
          return (
            <label key={item.id} className={`opcao-item ${livre ? '' : 'is-bloqueado'}`}>
              <input
                type="radio"
                name={nome}
                value={item.id}
                checked={valor === item.id && livre}
                disabled={!livre}
                aria-describedby={livre ? undefined : idDica}
                onChange={() => aoMudar(item.id)}
              />
              <span>{item.nome}</span>
              {!livre && (
                <span id={idDica} className="opcao-item__dica">
                  Com {plural(item.marco ?? 0)} · faltam {plural(diasQueFaltam(item, dias))}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
