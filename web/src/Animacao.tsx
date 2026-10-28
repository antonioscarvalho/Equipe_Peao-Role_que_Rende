import { useEffect, useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import aliviado from "./lottie/aliviado.json";
import brilho from "./lottie/brilho.json";
import broto from "./lottie/broto.json";

/*
 * Animações Lottie: Noto Animated Emoji (Google), licença CC BY 4.0.
 * Fonte: https://googlefonts.github.io/noto-emoji-animation/
 * Baixadas de fonts.gstatic.com/s/e/notoemoji/latest/<código>/lottie.json
 * (lottiefiles.com está bloqueado na rede corporativa).
 */
const arquivos = { aliviado, brilho, broto } as const;
// Quadro mostrado parado quando "reduzir animações" está ligado (o quadro 0 de algumas é vazio).
const quadroParado: Record<keyof typeof arquivos, number> = { aliviado: 60, brilho: 60, broto: 220 };
export type NomeLottie = keyof typeof arquivos;

type Props = {
  nome: NomeLottie;
  tamanho?: number;
  repetir?: boolean;
  reduzir?: boolean;
  rotulo?: string;
};

/** Com "reduzir", mostra o primeiro quadro parado em vez de animar. */
export function Animacao({ nome, tamanho = 96, repetir = true, reduzir = false, rotulo }: Props) {
  const ref = useRef<LottieRefCurrentProps>(null);
  useEffect(() => {
    if (reduzir) ref.current?.goToAndStop(quadroParado[nome], true);
    else ref.current?.play();
  }, [reduzir, nome]);
  return (
    <div
      style={{ width: tamanho, height: tamanho }}
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      <Lottie
        lottieRef={ref}
        onDOMLoaded={() => reduzir && ref.current?.goToAndStop(quadroParado[nome], true)}
        animationData={arquivos[nome]}
        loop={repetir && !reduzir}
        autoplay={!reduzir}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      />
    </div>
  );
}
