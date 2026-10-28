import { Botao } from '@/components/Botao'
import { conteudoPrevencao } from '@/content/conteudo'

interface InicioProps {
  aoAbrirSos: () => void
  aoAbrirPlano: () => void
  aoAbrirCirculo: () => void
}

/** Tela inicial: uma ação principal, grande e no alcance do polegar (skill ui-ux-designer). */
export function Inicio({ aoAbrirSos, aoAbrirPlano, aoAbrirCirculo }: InicioProps) {
  return (
    <section className="tela tela--inicio" aria-labelledby="inicio-titulo">
      <h1 id="inicio-titulo">Bora construir uma vida sem apostas? Um passo de cada vez.</h1>
      <Botao grande onClick={aoAbrirSos}>
        Bateu a vontade?
      </Botao>
      <nav className="linha" aria-label="Prepare-se pros momentos difíceis">
        <Botao variante="secundario" onClick={aoAbrirPlano}>
          {conteudoPrevencao.atalhos.plano}
        </Botao>
        <Botao variante="secundario" onClick={aoAbrirCirculo}>
          {conteudoPrevencao.atalhos.circulo}
        </Botao>
      </nav>
      <p className="nota">
        Este app é um apoio. Ele não substitui atendimento profissional. Seus registros ficam só neste celular.
      </p>
    </section>
  )
}
