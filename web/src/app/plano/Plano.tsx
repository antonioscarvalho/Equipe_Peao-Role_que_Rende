import { conteudoPrevencao } from '@/content/conteudo'

export interface PlanoProps {
  /** Gatilhos já marcados ao abrir (ex.: vindos do pós-lapso). Vêm só em memória, nunca pela URL. */
  gatilhosIniciais?: string[]
  aoAbrirCirculo: () => void
  aoVoltar: () => void
}

/** Seu plano (fluxo F5). A tela completa entra na T007. */
export function Plano(_props: PlanoProps) {
  return (
    <section className="tela tela--plano" aria-labelledby="plano-titulo">
      <h1 id="plano-titulo">{conteudoPrevencao.plano.titulo}</h1>
    </section>
  )
}
