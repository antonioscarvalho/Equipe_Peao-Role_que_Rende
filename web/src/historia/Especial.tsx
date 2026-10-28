import { useState } from "react";
import { usePerfil, NOME_MAX } from "../personalizacao";
import { MOTIVOS, METAS, guardarConhecer, refletirMotivos, type Conhecer } from "./conhecer";
import type { Passo } from "./tipos";

/**
 * Perguntas do questionário de entrada (docs/02-produto/questionario-onboarding.md) feitas pelo Broto.
 * Todas têm um jeito de não responder. Cada uma termina devolvendo a fala de reflexão do Broto.
 * Só o apelido (perfil) e, com "Guardar", motivo e meta (conhecer.ts) ficam no aparelho.
 * REVISÃO CLÍNICA PENDENTE das devolutivas.
 */
export type Conversa = { nome: string | null; menor: boolean; motivos: string[]; meta: string | null };

type Props = {
  tipo: NonNullable<Passo["especial"]>;
  conversa: Conversa;
  mudar: (c: Partial<Conversa>) => void;
  aoFim: (resposta: string | null) => void;
};

export function Especial({ tipo, conversa, mudar, aoFim }: Props) {
  const { mudarNome } = usePerfil();
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [marcados, setMarcados] = useState<string[]>([]);

  if (tipo === "nome") {
    const enviar = () => {
      const e = mudarNome(texto);
      if (e) { setErro(e === "longo" ? `Até ${NOME_MAX} letras.` : "Use só letras."); return; }
      const nome = texto.replace(/\s+/g, " ").trim() || null;
      mudar({ nome });
      aoFim(null);
    };
    return (
      <form className="especial" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
        <label htmlFor="especial-nome" className="especial__rotulo">Como o Broto te chama (opcional)</label>
        <input id="especial-nome" className="especial__campo" value={texto} maxLength={NOME_MAX + 5} autoComplete="nickname"
          onChange={(e) => { setTexto(e.target.value); setErro(null); }} aria-describedby={erro ? "especial-nome-erro" : undefined} />
        {erro && <p id="especial-nome-erro" className="especial__erro" role="alert">{erro}</p>}
        <button className="rqr-botao" type="submit">Pronto</button>
        <button className="historia-opcao historia-opcao--leve" type="button" onClick={() => { mudar({ nome: null }); aoFim(null); }}>
          Prefiro não dizer
        </button>
      </form>
    );
  }

  if (tipo === "idade") {
    return (
      <div className="especial">
        <button className="historia-opcao" onClick={() => aoFim("Beleza. Obrigado por responder.")}>Sim</button>
        <button className="historia-opcao" onClick={() => {
          mudar({ menor: true });
          aoFim("Que bom que você tá aqui. Esse app é pra adultos, mas você pode conversar com um adulto de confiança ou ir na unidade de saúde do seu bairro. Se precisar falar com alguém agora, o CVV atende de graça no 188. Eu fico aqui pra te contar minha história, se quiser.");
        }}>Não</button>
      </div>
    );
  }

  // Menores de 18 não respondem o questionário (questionario-onboarding.md, decisões).
  if (conversa.menor) { queueMicrotask(() => aoFim(null)); return null; }

  if (tipo === "motivo") {
    const alternar = (m: string) => setMarcados((a) => (a.includes(m) ? a.filter((x) => x !== m) : [...a, m]));
    return (
      <div className="especial">
        <div className="especial__chips" role="group" aria-label="O que te trouxe aqui (pode marcar vários)">
          {MOTIVOS.map((m) => (
            <button key={m} className={`chip ${marcados.includes(m) ? "is-on" : ""}`} aria-pressed={marcados.includes(m)} onClick={() => alternar(m)}>{m}</button>
          ))}
        </div>
        <button className="rqr-botao" disabled={!marcados.length} onClick={() => {
          mudar({ motivos: marcados });
          aoFim(`Então ${refletirMotivos(marcados)} importa pra você. Isso diz muito de quem você é.`);
        }}>Contar pro Broto</button>
        <button className="historia-opcao historia-opcao--leve" onClick={() => aoFim("Tudo bem. A gente se conhece aos poucos.")}>Prefiro não dizer</button>
      </div>
    );
  }

  if (tipo === "meta") {
    const resp: Record<(typeof METAS)[number], string> = {
      "Parar de apostar": "Decisão grande. Eu vou estar do seu lado, um dia de cada vez.",
      "Diminuir primeiro": "Começar por um pedaço também é começar. Bora junto.",
      "Ainda não sei": "Tudo bem não saber. Muita gente sente as duas coisas ao mesmo tempo. Eu fico aqui.",
    };
    return (
      <div className="especial">
        {METAS.map((m) => (
          <button key={m} className="historia-opcao" onClick={() => { mudar({ meta: m }); aoFim(resp[m]); }}>{m}</button>
        ))}
        <button className="historia-opcao historia-opcao--leve" onClick={() => aoFim("Justo. Não precisa decidir nada hoje.")}>Prefiro não responder</button>
      </div>
    );
  }

  // guardar: só pergunta se houver algo para guardar.
  if (!conversa.motivos.length && !conversa.meta) { queueMicrotask(() => aoFim(null)); return null; }
  return (
    <div className="especial">
      <button className="historia-opcao" onClick={() => {
        guardarConhecer({ motivos: conversa.motivos, meta: conversa.meta } satisfies Conhecer);
        aoFim("Guardado. Só aqui, no seu celular.");
      }}>Guardar</button>
      <button className="historia-opcao" onClick={() => aoFim("Combinado. Fica só nessa conversa.")}>Não guardar</button>
    </div>
  );
}
