import { useCallback, useEffect, useRef, useState } from "react";
import { Bichinho, type Humor } from "../Bichinho";
import { PainelCrise } from "../AjudaAgora";
import { Icone } from "../Icone";
import { BotaoLibras } from "../BotaoLibras";
import { useAparenciaVisivel } from "../personalizacao";
import { lerPerfil } from "../personalizacao/armazenamento-perfil";
import { useModal } from "./useModal";
import { Especial, type Conversa } from "./Especial";
import type { Capitulo, Passo } from "./tipos";
import type { Cena } from "./cenas/tipos";
import "./historia.css";

/**
 * Conduz a conversa de um capítulo com o Broto.
 * - parte "antes": só o roteiro `antesDoJogo`.
 * - parte "depois": `falaAbertura` → `depoisDoJogo` → perguntas da pessoa (opcionais) →
 *   pergunta do Broto → oferta (se houver) → lição.
 * Regras (skills design-etico-saude-digital, entrevista-motivacional, seguranca-e-crise, acessibilidade-wcag):
 * - "Agora não" em todas as etapas; toda pergunta tem um jeito de não responder.
 * - As respostas vivem só neste estado do React (exceção: o que o Especial grava com aviso).
 * - Opção com `abreCrise` abre o protocolo de crise (o mesmo painel do "Preciso de ajuda agora").
 */
/** Fala de transição da base, igual para todos os capítulos. REVISÃO CLÍNICA PENDENTE. */
const CONVITE_PERGUNTAS = "Pode me perguntar o que quiser. Ou a gente segue.";

type Etapa = "roteiro" | "abertura" | "perguntas" | "broto" | "oferta" | "licao";

type Props = {
  capitulo: Capitulo;
  aoConcluir: () => void;
  aoFechar: () => void;
  reduzir: boolean;
  parte?: "antes" | "depois";
  /** Folhas pegas no jogo, para o Broto comentar (`{folhas}`). */
  folhas?: number;
  aoOferta?: (acao: string) => void;
  cena?: Cena;
};

function frasesDeFolhas(n: number | undefined) {
  if (!n) return "Não deu pra pegar folha dessa vez. Tudo bem: o pulo conta igual.";
  return n === 1 ? "A gente pegou uma folha no caminho! Vou guardar ela aqui." : `A gente pegou ${n} folhas no caminho! Vou guardar todas aqui.`;
}

function interpolar(fala: string, nome: string | null, folhas: number | undefined) {
  return fala
    .replace(/\{folhas\}/g, frasesDeFolhas(folhas))
    .replace(/,\s*\{nome\}/g, nome ? `, ${nome}` : "")
    .replace(/\{nome\}/g, nome ?? "você");
}

/** Texto aparecendo aos poucos; com `reduzir`, aparece inteiro na hora. Toque no balão completa. */
function useDigitando(texto: string, reduzir: boolean) {
  const [n, setN] = useState(reduzir ? texto.length : 0);
  useEffect(() => {
    if (reduzir) { setN(texto.length); return; }
    setN(0);
    const id = window.setInterval(() => {
      setN((v) => { if (v >= texto.length) { window.clearInterval(id); return v; } return v + 1; });
    }, 22);
    return () => window.clearInterval(id);
  }, [texto, reduzir]);
  return { visivel: texto.slice(0, n), completo: n >= texto.length, completar: () => setN(texto.length) };
}

export function Dialogo({ capitulo, aoConcluir, aoFechar, reduzir, parte = "depois", folhas, aoOferta, cena: CenaDoCapitulo }: Props) {
  const aparencia = useAparenciaVisivel();
  const caixa = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const roteiro: Passo[] = (parte === "antes" ? capitulo.antesDoJogo : capitulo.depoisDoJogo) ?? [];

  const [conversa, setConversa] = useState<Conversa>(() => ({ nome: lerPerfil().nome, menor: false, motivos: [], meta: null }));
  const mudarConversa = useCallback((c: Partial<Conversa>) => setConversa((v) => ({ ...v, ...c })), []);
  const dizer = useCallback((t: string) => interpolar(t, conversa.nome, folhas), [conversa.nome, folhas]);

  const [etapa, setEtapa] = useState<Etapa>(parte === "antes" ? "roteiro" : "abertura");
  const [i, setI] = useState(0);
  const [fala, setFala] = useState(() => (parte === "antes" ? interpolar(roteiro[0]?.fala ?? "", conversa.nome, folhas) : capitulo.falaAbertura));
  const [respondeu, setRespondeu] = useState(false);
  const [ouvidas, setOuvidas] = useState<number[]>([]);
  const [pergunta, setPergunta] = useState<number | null>(null);
  const [crise, setCrise] = useState(false);
  // Menu de ajustes do topo: título do capítulo, ajuda e sair. Esc fecha o menu antes da história.
  const [menu, setMenu] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault(); e.stopPropagation(); setMenu(false); botaoMenu.current?.focus();
    };
    window.addEventListener("keydown", esc, true);
    return () => window.removeEventListener("keydown", esc, true);
  }, [menu]);
  const [cenaAtual, setCenaAtual] = useState<string | undefined>(parte === "antes" ? roteiro[0]?.cena : undefined);

  useModal(caixa, aoFechar, !crise);
  const acoes = useRef<HTMLDivElement>(null);
  const seguirRef = useRef<HTMLButtonElement>(null);
  // A cada fala nova, o foco vai para a primeira escolha ou para "Continuar" (teclado e leitor seguem a conversa).
  useEffect(() => {
    const alvo = acoes.current?.querySelector<HTMLElement>("button, input") ?? seguirRef.current;
    alvo?.focus({ preventScroll: true });
  }, [fala, etapa, i]);
  // Antes não acabou e o roteiro está vazio: nada a dizer.
  useEffect(() => { if (parte === "antes" && !roteiro.length) aoConcluir(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { visivel, completo, completar } = useDigitando(fala, reduzir);

  const fecharCrise = useCallback(() => { setCrise(false); window.setTimeout(() => seguirRef.current?.focus(), 0); }, []);

  const ir = (proxima: Etapa, novaFala: string) => {
    setEtapa(proxima);
    setFala(novaFala);
    setRespondeu(false);
  };

  const passo = etapa === "roteiro" ? roteiro[i] : undefined;

  const irParaPasso = (n: number) => {
    const p = roteiro[n];
    if (!p) {
      if (parte === "antes") { aoConcluir(); return; }
      if (capitulo.perguntas.length) ir("perguntas", CONVITE_PERGUNTAS);
      else ir("broto", capitulo.perguntaDoBroto.texto);
      return;
    }
    setI(n);
    if (p.cena) setCenaAtual(p.cena);
    setEtapa("roteiro");
    setRespondeu(false);
    setFala(dizer(p.fala));
  };

  const depoisDoBroto = () => (capitulo.oferta ? ir("oferta", fala) : ir("licao", capitulo.licao));

  const humor: Humor =
    passo?.humor ?? (etapa === "licao" ? "orgulhoso" : etapa === "broto" ? "apoio" : etapa === "abertura" ? "cansado" : "calmo");
  const cenaDoMomento = etapa === "licao" ? "amanhecer" : etapa === "roteiro" || etapa === "abertura" ? cenaAtual : undefined;

  return (
    <div ref={caixa} className="historia-dialogo" role="dialog" aria-modal="true" aria-labelledby="dialogo-titulo">
      {/* Cena em tela cheia, como nos RPGs (Persona, Stardew Valley): a arte é a protagonista. */}
      <div className="historia-dialogo__palco">
        {CenaDoCapitulo
          ? <CenaDoCapitulo momento={{ etapa: etapa === "roteiro" ? "abertura" : etapa, pergunta, cena: cenaDoMomento }} reduzir={reduzir}
              ator={<Bichinho humor={humor} nivel={2} tamanho={104} reduzir={reduzir} aparencia={aparencia} />} />
          : <div className="historia-dialogo__ceu" />}
      </div>

      <header className="historia-dialogo__topo">
        <h2 id="dialogo-titulo" ref={titulo} tabIndex={-1} className="sr-only">{capitulo.titulo}</h2>
        <BotaoLibras />
        <button ref={botaoMenu} className="historia-menu__botao" aria-label="Ajustes da história" aria-expanded={menu}
          aria-controls="historia-menu" data-vlibras-gloss="AJUSTES" onClick={() => setMenu((m) => !m)}>
          <span className="historia-menu__icone" aria-hidden="true"><Icone nome="settings" tamanho={22} /></span>
        </button>
        {menu && (
          <div id="historia-menu" className="historia-menu" role="group" aria-label="Ajustes da história">
            <p className="historia-menu__titulo">{capitulo.titulo}</p>
            <button className="historia-menu__item historia-menu__item--ajuda" onClick={() => { setMenu(false); setCrise(true); }}>
              <Icone nome="phone" tamanho={20} /> Preciso de ajuda agora
            </button>
            <button className="historia-menu__item" onClick={aoFechar}>
              <Icone nome="house" tamanho={20} /> Parar por agora
            </button>
            <small className="historia-menu__nota">
              O Broto é um apoio, não um terapeuta. Seu lugar na história fica salvo; o que você escolhe nas conversas, não.
            </small>
          </div>
        )}
      </header>

      <div className="historia-dialogo__baixo">
      {/* Escolhas: lista curta acima da caixa de texto, do lado direito. */}
      <div className="historia-dialogo__acoes" ref={acoes}>
          {etapa === "roteiro" && passo && (
            respondeu || (!passo.opcoes && !passo.especial) ? null : passo.especial ? (
              <Especial key={i} tipo={passo.especial} conversa={conversa} mudar={mudarConversa}
                aoFim={(r) => { if (r) { setFala(r); setRespondeu(true); } else irParaPasso(i + 1); }} />
            ) : (
              passo.opcoes!.map((o) => (
                <button key={o.rotulo} className="historia-opcao" onClick={() => {
                  setRespondeu(true);
                  if (o.resposta) setFala(dizer(o.resposta));
                  if (o.abreCrise) setCrise(true);
                  if (!o.resposta && !o.abreCrise) irParaPasso(i + 1);
                }}>{o.rotulo}</button>
              ))
            )
          )}

          {etapa === "perguntas" && (
            <>
              {capitulo.perguntas.map((p, n) => (
                <button key={p.pergunta} className="historia-opcao" aria-pressed={ouvidas.includes(n)}
                  onClick={() => { setOuvidas((o) => (o.includes(n) ? o : [...o, n])); setPergunta(n); setFala(p.resposta); }}>
                  {p.pergunta}
                </button>
              ))}
              <button className="historia-opcao historia-opcao--seguir" onClick={() => ir("broto", capitulo.perguntaDoBroto.texto)}>Seguir ›</button>
            </>
          )}

          {etapa === "broto" && !respondeu && (
            <>
              {capitulo.perguntaDoBroto.opcoes.map((o) => (
                <button key={o.rotulo} className="historia-opcao"
                  onClick={() => { setRespondeu(true); setFala(o.resposta); if (o.abreCrise) setCrise(true); }}>
                  {o.rotulo}
                </button>
              ))}
              <button className="historia-opcao historia-opcao--leve" onClick={depoisDoBroto}>Prefiro não responder</button>
            </>
          )}

          {etapa === "oferta" && capitulo.oferta && (
            <button className="historia-opcao" onClick={() => aoOferta?.(capitulo.oferta!.acao)}>{capitulo.oferta.rotulo}</button>
          )}
      </div>

      {/* Caixa de texto de RPG: nome do Broto, a fala e o "seguir" no canto. */}
      <div className="historia-caixa">
        <span className="historia-caixa__nome" aria-hidden="true">Broto</span>
        <div className="historia-caixa__fala" key={fala} aria-hidden="true">
          <span className="historia-balao__texto">
            {visivel}
            {!completo && <span className="historia-fala__cursor" />}
          </span>
          <span className="historia-balao__texto historia-balao__molde">{fala}</span>
        </div>
        {/* Leitor de tela recebe a fala inteira de uma vez, não letra por letra. */}
        <p className="sr-only" aria-live="polite">Broto: {fala}</p>
        {(() => {
          const seguir =
            etapa === "roteiro" && passo && (respondeu || (!passo.opcoes && !passo.especial)) ? () => irParaPasso(i + 1)
            : etapa === "abertura" ? () => irParaPasso(0)
            : etapa === "broto" && respondeu ? depoisDoBroto
            : etapa === "oferta" ? () => ir("licao", capitulo.licao)
            : null;
          if (etapa === "licao") return <button ref={seguirRef} className="historia-caixa__seguir" onClick={aoConcluir}>Concluir capítulo ▸</button>;
          return seguir && <button ref={seguirRef} className="historia-caixa__seguir" onClick={() => (completo ? seguir() : completar())}>
            {completo ? "Continuar ▸" : "Mostrar tudo ▸"}</button>;
        })()}
      </div>
      </div>
      {crise && <PainelCrise aoFechar={fecharCrise} />}
    </div>
  );
}
