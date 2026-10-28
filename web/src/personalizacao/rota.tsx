import { useEffect, useState, type ReactNode } from "react";
import { Personalizar } from "./Personalizar";
import "./personalizacao.css";

/** Endereço da tela: /#personalizar. Hash para não depender de roteador nem do servidor. */
export const HASH_PERSONALIZAR = "#personalizar";

const naTela = () => window.location.hash === HASH_PERSONALIZAR;

/**
 * Envolve o app inteiro. Na tela de personalizar, o app continua montado (só escondido),
 * para a demonstração da tela inicial não perder o estado ao voltar.
 */
export function ComPersonalizacao({ children }: { children: ReactNode }) {
  const [aberta, setAberta] = useState(naTela);

  useEffect(() => {
    const atualizar = () => setAberta(naTela());
    window.addEventListener("hashchange", atualizar);
    return () => window.removeEventListener("hashchange", atualizar);
  }, []);

  const voltar = () => {
    // Volta no histórico quando veio da tela inicial; senão (link aberto direto), só limpa o hash.
    if (window.history.state?.rqrPersonalizar) window.history.back();
    else window.location.hash = "";
  };

  return (
    <>
      <div hidden={aberta}>{children}</div>
      {aberta && <Personalizar aoVoltar={voltar} />}
    </>
  );
}

/** Abre a tela marcando o histórico, para o "voltar" do celular funcionar. */
export function abrirPersonalizar() {
  window.history.pushState({ rqrPersonalizar: true }, "", HASH_PERSONALIZAR);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
