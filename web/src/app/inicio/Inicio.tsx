import { Botao } from '@/components/Botao'

interface InicioProps {
  aoAbrirSos: () => void
}

/** Tela inicial: uma ação principal, grande e no alcance do polegar (skill ui-ux-designer). */
export function Inicio({ aoAbrirSos }: InicioProps) {
  return (
    <section className="tela tela--inicio" aria-labelledby="inicio-titulo">
      <h1 id="inicio-titulo">Bora construir uma vida sem apostas? Um passo de cada vez.</h1>
      <Botao grande onClick={aoAbrirSos}>
        Bateu a vontade?
      </Botao>
      <p className="nota">
        Este app é um apoio. Ele não substitui atendimento profissional. Seus registros ficam só neste celular.
      </p>
    </section>
  )
}
