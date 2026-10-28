import type { MouseEvent } from "react";
import { HASH_PERSONALIZAR, abrirPersonalizar } from "./rota";

/** Ícone "palette" do Lucide (ISC), o mesmo já registrado na spec 009. */
const PALETA =
  '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 22a1 1 0 0 1 0-20a10 9 0 0 1 10 9a5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></g>';

/** Atalho pequeno na cena do bichinho que leva para a tela de personalizar. */
export function BotaoPersonalizar() {
  const abrir = (e: MouseEvent<HTMLAnchorElement>) => {
    // Clique normal: troca de tela sem recarregar. Ctrl/Cmd/meio: deixa o navegador abrir em outra aba.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    abrirPersonalizar();
  };
  return (
    <a className="botao-personalizar" href={HASH_PERSONALIZAR} onClick={abrir}
      aria-label="Personalizar bichinho" title="Personalizar bichinho"
      data-vlibras-gloss="PERSONALIZAR BICHINHO">
      <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
        dangerouslySetInnerHTML={{ __html: PALETA }} />
    </a>
  );
}
