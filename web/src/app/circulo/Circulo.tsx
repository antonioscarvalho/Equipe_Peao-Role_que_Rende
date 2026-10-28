import { conteudoPrevencao } from '@/content/conteudo'

export interface CirculoProps {
  aoAbrirPlano: () => void
  aoVoltar: () => void
}

/** Seu Círculo de Confiança (fluxo F8). A tela completa entra na T008. */
export function Circulo(_props: CirculoProps) {
  return (
    <section className="tela tela--circulo" aria-labelledby="circulo-titulo">
      <h1 id="circulo-titulo">{conteudoPrevencao.circulo.titulo}</h1>
    </section>
  )
}
