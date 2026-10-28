import { Icone } from "./Icone";
import { tocar } from "./sons";
import { NOME_TEMA, ORDEM_TEMA, useTema } from "./tema";

const ICONE = { auto: "sunMoon", claro: "sun", escuro: "moon" } as const;

/**
 * Botão de tema: cada toque passa para o próximo (Automático → Claro → Escuro).
 * `compacto` mostra só o ícone (topo dos jogos e da personalização); o nome do tema
 * continua no aria-label e no title.
 */
export function BotaoTema({ compacto = false }: { compacto?: boolean }) {
  const { pref, escolher } = useTema();
  const proximo = ORDEM_TEMA[(ORDEM_TEMA.indexOf(pref) + 1) % ORDEM_TEMA.length];
  const rotulo = `Tema: ${NOME_TEMA[pref]}. Trocar para ${NOME_TEMA[proximo]}`;

  return (
    <button type="button" className={`botao-tema${compacto ? " botao-tema--compacto" : ""}`}
      onClick={() => { tocar("clique"); escolher(proximo); }} aria-label={rotulo} title={rotulo}>
      <span className="botao-tema__icone" aria-hidden="true"><Icone nome={ICONE[pref]} tamanho={18} /></span>
      {!compacto && <span className="botao-tema__texto" aria-hidden="true">Tema: {NOME_TEMA[pref]}</span>}
    </button>
  );
}
