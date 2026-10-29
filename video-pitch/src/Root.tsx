import { Composition } from "remotion";
import { Pitch, DURACAO_TOTAL } from "./Pitch";

export const Root = () => (
  <Composition id="Pitch" component={Pitch} durationInFrames={DURACAO_TOTAL} fps={30} width={1920} height={1080} />
);
