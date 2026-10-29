import { Composition, registerRoot } from "remotion";
import { ALTURA, DURACAO_S, FPS, LARGURA } from "./config";
import { VideoLoop } from "./Video";

function Raiz() {
  return <Composition id="PitchLoop" component={VideoLoop} durationInFrames={DURACAO_S * FPS} fps={FPS} width={LARGURA} height={ALTURA} />;
}

registerRoot(Raiz);
