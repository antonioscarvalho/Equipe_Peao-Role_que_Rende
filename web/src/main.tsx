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

// Texto do app não copia (o CSS já impede a seleção; isto cobre Ctrl+C e arrastar imagem).
// Campos de digitar continuam funcionando normalmente.
const ehCampo = (alvo: EventTarget | null) => alvo instanceof HTMLElement && !!alvo.closest("input, textarea, [contenteditable='true']");
for (const tipo of ["copy", "cut"] as const) {
  document.addEventListener(tipo, (e) => { if (!ehCampo(e.target)) e.preventDefault(); });
}
document.addEventListener("dragstart", (e) => { if (e.target instanceof HTMLImageElement) e.preventDefault(); });
