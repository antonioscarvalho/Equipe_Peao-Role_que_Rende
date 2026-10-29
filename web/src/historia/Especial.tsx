import { useRef, useState, type FocusEvent } from "react";
import { tocar } from "../sons";
import { vibrar } from "../tato";
import { usePerfil, NOME_MAX } from "../personalizacao";
import { useAparencia, useProgresso } from "../personalizacao/armazenamento";
import { CABECA, CORES, CORES_ROUPA, PEITO, ROSTO, ROUPAS, aparenciaVisivel, liberado, metaCurta, type Aparencia, type OpcaoItem } from "../personalizacao/aparencia";
import { Bichinho } from "../Bichinho";
import { Icone } from "../Icone";
import type { NomeIcone } from "../icones-data";
import { MOTIVOS, METAS, guardarConhecer, type Conhecer } from "./conhecer";
import type { Passo } from "./tipos";

/**
 * Perguntas do questionário de entrada (docs/02-produto/questionario-onboarding.md) feitas pelo Broto.
 * Todas têm um jeito de não responder. Cada uma termina devolvendo a fala de reflexão do Broto.
 * Só o apelido (perfil) e, com "Guardar", motivo e meta (conhecer.ts) ficam no aparelho.
 * REVISÃO CLÍNICA PENDENTE das devolutivas.
 */
export type Conversa = { nome: string | null; broto: string | null; menor: boolean; motivos: string[]; meta: string | null };

type Props = {
  tipo: NonNullable<Passo["especial"]>;
  conversa: Conversa;
  mudar: (c: Partial<Conversa>) => void;
  aoFim: (resposta: string | null) => void;
};

const ABAS: { id: string; rotulo: string }[] = [
  { id: "cor", rotulo: "Cor" }, { id: "roupa", rotulo: "Roupa" }, { id: "cabeca", rotulo: "Cabeça" }, { id: "rosto", rotulo: "Rosto" }, { id: "peito", rotulo: "Peito" },
];
const ITENS: Record<string, OpcaoItem[]> = { roupa: ROUPAS, cabeca: CABECA, rosto: ROSTO, peito: PEITO };

/**
 * Personalização do Broto dentro da história (spec 009, tela 2 do questionário).
 * O painel cobre o Broto da cena, por isso ele tem a própria prévia, que muda na hora.
 */
function Aparencia({ aoFim }: { aoFim: (r: string | null) => void }) {
  const { aparencia, mudar } = useAparencia();
  const progresso = useProgresso();
  const [aba, setAba] = useState("cor");
  const itens = ITENS[aba];
  const visivel = aparenciaVisivel(aparencia, progresso);
  return (
    <div className="especial especial--aparencia">
      <div className="especial__previa" aria-hidden="true">
        <Bichinho humor="feliz" nivel={2} tamanho={120} reduzir aparencia={visivel} />
      </div>
      <div className="especial__abas" role="group" aria-label="O que mudar">
        {ABAS.map((a) => (
          <button key={a.id} className={`especial__aba ${aba === a.id ? "is-on" : ""}`} aria-pressed={aba === a.id} onClick={() => { tocar("clique"); setAba(a.id); }}>{a.rotulo}</button>
        ))}
      </div>
      {aba === "cor" && (
        <div className="especial__cores" role="group" aria-label="Cor do corpo">
          {CORES.map((c) => (
            <button key={c.id} className="especial__cor" style={{ background: c.valor }} aria-pressed={aparencia.cor === c.id}
              aria-label={c.nome} onClick={() => { tocar("clique"); mudar({ cor: c.id }); }} />
          ))}
        </div>
      )}
      {itens && (
        <div className="especial__itens" role="group" aria-label={ABAS.find((a) => a.id === aba)!.rotulo}>
          {itens.map((it) => {
            const livre = liberado(it, progresso);
            const on = aparencia[aba as keyof Aparencia] === it.id;
            return (
              <button key={it.id} className={`especial__item ${on ? "is-on" : ""}`} aria-pressed={on} disabled={!livre}
                onClick={() => { tocar("clique"); mudar({ [aba]: it.id } as Partial<Aparencia>); }}>
                {/* Mini prévia: o Broto já usando o item, como na tela Personalizar. */}
                <span className="especial__item-previa" aria-hidden="true">
                  <Bichinho humor="calmo" nivel={2} tamanho={48} reduzir aparencia={{ ...visivel, [aba]: it.id }} />
                </span>
                <span className="especial__item-nome">{it.nome}</span>
                {!livre && it.meta && <span className="especial__item-marco">{metaCurta(it.meta)}</span>}
              </button>
            );
          })}
        </div>
      )}
      {aba === "roupa" && (
        <div className="especial__cores" role="group" aria-label="Cor da roupa">
          {CORES_ROUPA.map((c) => (
            <button key={c.id} className="especial__cor" style={{ background: c.valor }} aria-pressed={aparencia.corRoupa === c.id}
              aria-label={`Roupa ${c.nome}`} onClick={() => { tocar("clique"); mudar({ corRoupa: c.id }); }} />
          ))}
        </div>
      )}
      <div className="especial__fim">
        <button className="historia-opcao historia-opcao--leve" onClick={() => { tocar("clique"); aoFim("Do jeito que eu caí, então. Tá valendo!"); }}>Deixar como está</button>
        <button className="rqr-botao" onClick={() => { tocar("clique"); aoFim("Ficou a minha cara! Quer dizer… a nossa. Dá pra mudar quando quiser, em Personalizar."); }}>Pronto</button>
      </div>
    </div>
  );
}

/** Ícone de cada motivo (decorativo: o texto já diz tudo). Lucide, nada de emoji. */
const ICONE_MOTIVO: Record<string, NomeIcone> = {
  "Minha família": "house", "Meus filhos": "baby", "Pagar dívidas": "receipt", "Guardar dinheiro pra um sonho": "sprout",
  "Dormir melhor": "moon", "Minha saúde": "heart", "Meu trabalho ou estudo": "briefcase", "Voltar a confiar em mim": "shieldCheck",
  "Meu relacionamento": "handHeart", "Alguém me pediu": "messageCircle", "Só quero entender melhor": "search",
};

export function Especial({ tipo, conversa, mudar, aoFim }: Props) {
  const { mudarNome, mudarNomeBroto } = usePerfil();
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [marcados, setMarcados] = useState<string[]>([]);
  const enviado = useRef(false);

  if (tipo === "aparencia") return <Aparencia aoFim={aoFim} />;

  // Batismo (skill conversa-broto): não é escolha. É a pessoa comentando que ele parece um broto.
  if (tipo === "batismo") {
    return (
      <div className="especial">
        <button className="historia-opcao" onClick={() => {
          tocar("clique");
          mudarNomeBroto("Broto");
          mudar({ broto: "Broto" });
          aoFim("Broto… Meu primeiro nome de verdade. Gostei.");
        }}>Nossa, você parece um broto. Vou te chamar de Broto.</button>
      </div>
    );
  }

  if (tipo === "nome") {
    const enviar = () => {
      if (enviado.current) return;
      tocar("clique");
      const e = mudarNome(texto);
      if (e) { vibrar("aviso"); setErro(e === "longo" ? `Até ${NOME_MAX} letras.` : "Use só letras."); return; }
      const nome = texto.replace(/\s+/g, " ").trim() || null;
      enviado.current = true;
      mudar({ nome });
      aoFim(null);
    };
    // No celular, o "Pronto" do teclado só fechava o teclado e a pessoa precisava apertar o
    // "Pronto" da tela de novo. Agora fechar o teclado com um nome escrito já confirma.
    const aoSair = (e: FocusEvent<HTMLInputElement>) => {
      const destino = e.relatedTarget as HTMLElement | null;
      if (!texto.trim() || destino?.closest(".especial")) return;
      enviar();
    };
    return (
      <form className="especial" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
        <label htmlFor="especial-nome" className="especial__rotulo">Como {conversa.broto ?? "o alien"} te chama (opcional)</label>
        <input id="especial-nome" className="especial__campo" value={texto} maxLength={NOME_MAX + 5} autoComplete="nickname"
          enterKeyHint="done" onBlur={aoSair} autoCapitalize="words" spellCheck={false}
          onFocus={(e) => window.setTimeout(() => e.target.scrollIntoView({ block: "center" }), 300)}
          onChange={(e) => { setTexto(e.target.value); setErro(null); }} aria-describedby={erro ? "especial-nome-erro" : undefined} />
        {erro && <p id="especial-nome-erro" className="especial__erro" role="alert">{erro}</p>}
        <div className="especial__fim">
          <button className="historia-opcao historia-opcao--leve" type="button" onClick={() => { tocar("clique"); mudar({ nome: null }); aoFim(null); }}>
            Prefiro não dizer
          </button>
          <button className="rqr-botao" type="submit">Pronto</button>
        </div>
      </form>
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
            <button key={m} className={`chip ${marcados.includes(m) ? "is-on" : ""}`} aria-pressed={marcados.includes(m)} onClick={() => { tocar("clique"); alternar(m); }}>
              <span className="chip__icone" aria-hidden="true">{ICONE_MOTIVO[m] && <Icone nome={ICONE_MOTIVO[m]} tamanho={18} />}</span><span className="chip__texto">{m}</span></button>
          ))}
        </div>
        <button className="rqr-botao" disabled={!marcados.length} onClick={() => {
          tocar("clique");
          mudar({ motivos: marcados });
          aoFim("Obrigado por me contar. Fica entre a gente.");
        }}>{conversa.broto ? `Contar pro ${conversa.broto}` : "Contar pra ele"}</button>
        <button className="historia-opcao historia-opcao--discreta" onClick={() => { tocar("clique"); aoFim("Tudo bem. A gente se conhece aos poucos."); }}>Prefiro não dizer</button>
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
          <button key={m} className="historia-opcao" onClick={() => { tocar("clique"); mudar({ meta: m }); aoFim(resp[m]); }}>{m}</button>
        ))}
        <button className="historia-opcao historia-opcao--leve" onClick={() => { tocar("clique"); aoFim("Justo. Não precisa decidir nada hoje."); }}>Prefiro não responder</button>
      </div>
    );
  }

  // guardar: só pergunta se houver algo para guardar.
  if (!conversa.motivos.length && !conversa.meta) { queueMicrotask(() => aoFim(null)); return null; }
  return (
    <div className="especial">
      <button className="historia-opcao" onClick={() => {
        tocar("clique");
        guardarConhecer({ motivos: conversa.motivos, meta: conversa.meta } satisfies Conhecer);
        aoFim("Guardado. Só aqui, no seu celular.");
      }}>Guardar</button>
      <button className="historia-opcao" onClick={() => { tocar("clique"); aoFim("Combinado. Fica só nessa conversa."); }}>Não guardar</button>
    </div>
  );
}
