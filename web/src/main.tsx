import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { ComPersonalizacao } from "./personalizacao";
import { carregarVLibras } from "./vlibras";
import { carregarCenasAnimadas } from "./cenarios";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito";
import "./tema-livro.css";
import "./alto-contraste.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ComPersonalizacao>
      <App />
    </ComPersonalizacao>
  </StrictMode>,
);

carregarVLibras();
carregarCenasAnimadas();
