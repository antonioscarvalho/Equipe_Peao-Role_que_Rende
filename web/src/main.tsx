import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { ComPersonalizacao } from "./personalizacao";
import { carregarVLibras } from "./vlibras";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito";
import "./tema-livro.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ComPersonalizacao>
      <App />
    </ComPersonalizacao>
  </StrictMode>,
);

carregarVLibras();
