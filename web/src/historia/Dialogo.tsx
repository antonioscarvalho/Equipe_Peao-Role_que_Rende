import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Bichinho, type Humor } from "../Bichinho";
import { PainelCrise } from "../AjudaAgora";
import { Icone } from "../Icone";
import { BotaoLibras } from "../BotaoLibras";
import { nomeDoBroto, useAparenciaVisivel } from "../personalizacao";
import { lerPerfil } from "../personalizacao/armazenamento-perfil";
import { tocar, tocarMusica, tocarTecla, vocalizarBroto, type NomeSom } from "../sons";
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

/** Um efeito por cena (combina com a arte de fundo em `cenas/`). "musica" tem sua própria
 * cantiga (tocarMusica, mais abaixo); "cratera", "bairro" e "amanhecer" ficam fora daqui —
 * a última toca ao entrar na lição, não por cena (ver `ir`). Nem toda cena precisa de som. */
const SOM_DA_CENA: Partial<Record<string, NomeSom>> = {
  queda: "queda",
  vila: "aproximar",
  colheita: "folha",
  familia: "familia",
  cratera: "cratera",
  bairro: "bairro",
  lua: "lua",
  estrelas: "constelacao",
  nave: "nave",
  regua: "medir",
};

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
  /** Resposta da tela de idade (Historia.tsx). Menor de 18 não responde o questionário. Não é salva. */
  menor?: boolean;
};

function frasesDeFolhas(n: number | undefined) {
  if (!n) return "Não deu pra pegar folha dessa vez. Tudo bem, a tentativa conta igual.";
  return n === 1 ? "A gente pegou uma folha no caminho! Vou guardar ela aqui." : `A gente pegou ${n} folhas no caminho! Vou guardar todas aqui.`;
}

function interpolar(fala: string, nome: string | null, folhas: number | undefined, broto: string | null = null) {
  return fala
    .replace(/\{folhas\}/g, frasesDeFolhas(folhas))
    .replace(/\{broto\}/g, nomeDoBroto({ nomeBroto: broto }))
    .replace(/,\s*\{nome\}/g, nome ? `, ${nome}` : "")
    .replace(/\{nome\}/g, nome ?? "você");
}

/** Texto aparecendo aos poucos; com `reduzir`, aparece inteiro na hora. Toque no balão completa. */
function useDigitando(texto: string, reduzir: boolean, vozBroto: boolean) {
  const [n, setN] = useState(reduzir ? texto.length : 0);
  useEffect(() => {
    if (reduzir) { setN(texto.length); return; }
    setN(0);
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= texto.length) { window.clearInterval(id); return v; }
        const proximo = v + 1;
        if (!/\s/.test(texto[v] ?? "")) {
          tocarTecla();
          if (vozBroto && proximo % 3 === 0) vocalizarBroto();
        }
        return proximo;
      });
    }, 22);
    return () => window.clearInterval(id);
  }, [texto, reduzir, vozBroto]);
  return { visivel: texto.slice(0, n), completo: n >= texto.length, completar: () => setN(texto.length) };
}

export function Dialogo({ capitulo, aoConcluir, aoFechar, reduzir, parte = "depois", folhas, aoOferta, cena: CenaDoCapitulo, menor = false }: Props) {
  const aparencia = useAparenciaVisivel();
  const caixa = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const roteiro: Passo[] = (parte === "antes" ? capitulo.antesDoJogo : capitulo.depoisDoJogo) ?? [];

  const [conversa, setConversa] = useState<Conversa>(() => {
    const p = lerPerfil();
    return { nome: p.nome, broto: p.nomeBroto, menor, motivos: [], meta: null };
  });
  const mudarConversa = useCallback((c: Partial<Conversa>) => setConversa((v) => ({ ...v, ...c })), []);
  const dizer = useCallback((t: string) => interpolar(t, conversa.nome, folhas, conversa.broto), [conversa.nome, conversa.broto, folhas]);
  const nomeAlien = nomeDoBroto({ nomeBroto: conversa.broto });

  const [etapa, setEtapa] = useState<Etapa>(parte === "antes" ? "roteiro" : "abertura");
  const [i, setI] = useState(0);
  const [fala, setFala] = useState(() => (parte === "antes" ? interpolar(roteiro[0]?.fala ?? "", conversa.nome, folhas, conversa.broto) : capitulo.falaAbertura));
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

  const { visivel, completo, completar } = useDigitando(fala, reduzir, etapa !== "perguntas");

  const fecharCrise = useCallback(() => { setCrise(false); window.setTimeout(() => seguirRef.current?.focus(), 0); }, []);

  const ir = (proxima: Etapa, novaFala: string) => {
    setEtapa(proxima);
    setFala(novaFala);
    setRespondeu(false);
    if (proxima === "licao") tocar("amanhecer"); // acorde de esperança, não é recompensa de missão
    else if (proxima === "broto") tocar("pergunta");
    else if (proxima === "perguntas" || proxima === "oferta") tocar("transicao");
  };

  const passo = etapa === "roteiro" ? roteiro[i] : undefined;

  // Um efeito por cena, tocado direto no clique (não num useEffect): o play() de áudio só é
  // confiável dentro do mesmo gesto do usuário — em alguns navegadores, um play() disparado
  // depois, numa reação de estado, é bloqueado pela política de autoplay. Respeita os volumes
  // de efeitos/música; a cena já descreve o momento em `aria-label` (sem som, não perde informação).
  const ultimaCenaComSom = useRef<string | undefined>(undefined);
  const tocarSomDaCena = (c: string | undefined) => {
    if (c && c !== ultimaCenaComSom.current) {
      if (c === "musica") tocarMusica("/sons/cantiga-vo.opus");
      else if (SOM_DA_CENA[c]) tocar(SOM_DA_CENA[c]!);
    }
    ultimaCenaComSom.current = c;
  };

  const irParaPasso = (n: number) => {
    // Batismo só uma vez: com o alien já batizado, o passo some (inclusive ao reler o capítulo).
    while (roteiro[n]?.especial === "batismo" && conversa.broto) n++;
    const p = roteiro[n];
    if (!p) {
      if (parte === "antes") { aoConcluir(); return; }
      if (capitulo.perguntas.length) ir("perguntas", CONVITE_PERGUNTAS);
      else ir("broto", capitulo.perguntaDoBroto.texto);
      return;
    }
    setI(n);
    if (p.cena) { setCenaAtual(p.cena); tocarSomDaCena(p.cena); }
    setEtapa("roteiro");
    setRespondeu(false);
    setFala(dizer(p.fala));
  };

  const depoisDoBroto = () => (capitulo.oferta ? ir("oferta", fala) : ir("licao", capitulo.licao));

  const humor: Humor =
    passo?.humor ?? (etapa === "licao" ? "orgulhoso" : etapa === "broto" ? "apoio" : etapa === "abertura" ? "cansado" : "calmo");
  const cenaDoMomento = etapa === "licao" ? "amanhecer" : etapa === "roteiro" || etapa === "abertura" ? cenaAtual : undefined;

  const seguir =
    etapa === "roteiro" && passo && (respondeu || (!passo.opcoes && !passo.especial)) ? () => irParaPasso(i + 1)
    : etapa === "abertura" ? () => irParaPasso(0)
    : etapa === "broto" && respondeu ? depoisDoBroto
    : etapa === "oferta" ? () => ir("licao", capitulo.licao)
    : null;
  const avancar = () => { tocar("clique"); if (!completo) completar(); else seguir?.(); };
  // Toque fora dos botões (na cena ou na caixa): primeiro mostra o texto todo, depois segue.
  // Atalho só de ponteiro (toque/mouse): teclado e leitor usam o botão "Continuar", que segue existindo.
  const tocarCaixa = (e: PointerEvent) => {
    if (menu || crise || (e.target as HTMLElement).closest("button, input, a, form")) return;
    if (!completo) { completar(); return; }
    if (seguir) avancar();
  };

  return (
    <div ref={caixa} className="historia-dialogo" role="dialog" aria-modal="true" aria-labelledby="dialogo-titulo">
      {/* Cena em tela cheia, como nos RPGs (Persona, Stardew Valley): a arte é a protagonista. */}
      <div className="historia-dialogo__palco" onPointerUp={tocarCaixa}>
        {CenaDoCapitulo
          ? <CenaDoCapitulo momento={{ etapa: etapa === "roteiro" ? "abertura" : etapa, pergunta, cena: cenaDoMomento }} reduzir={reduzir}
              ator={<Bichinho humor={humor} nivel={2} tamanho={104} reduzir={reduzir} aparencia={aparencia} />} />
          : <div className="historia-dialogo__ceu" />}
      </div>

      <header className="historia-dialogo__topo">
        <h2 id="dialogo-titulo" ref={titulo} tabIndex={-1} className="sr-only">{capitulo.titulo}</h2>
        <BotaoLibras />
        <button ref={botaoMenu} className="historia-menu__botao" aria-label="Ajustes da história" aria-expanded={menu}
          aria-controls="historia-menu" data-vlibras-gloss="AJUSTES" onClick={() => { tocar("clique"); setMenu((m) => !m); }}>
          <span className="historia-menu__icone" aria-hidden="true"><Icone nome="settings" tamanho={22} /></span>
        </button>
        {menu && (
          <div id="historia-menu" className="historia-menu" role="group" aria-label="Ajustes da história">
            <p className="historia-menu__titulo">{capitulo.titulo}</p>
            <button className="historia-menu__item historia-menu__item--ajuda" onClick={() => { tocar("clique"); setMenu(false); setCrise(true); }}>
              <Icone nome="phone" tamanho={20} /> Preciso de ajuda agora
            </button>
            <button className="historia-menu__item" onClick={() => { tocar("clique"); aoFechar(); }}>
              <Icone nome="house" tamanho={20} /> Parar por agora
            </button>
            <small className="historia-menu__nota">
              {nomeAlien} é um apoio, não um terapeuta. Seu lugar na história fica salvo; o que você escolhe nas conversas, não.
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
                  tocar("clique");
                  setRespondeu(true);
                  if (o.resposta) setFala(dizer(o.resposta));
                  if (o.abreCrise) setCrise(true);
                  if (o.som === "cantiga") tocarMusica("/sons/cantiga-vo.opus");
                  if (!o.resposta && !o.abreCrise) irParaPasso(i + 1);
                }}>{dizer(o.rotulo)}</button>
              ))
            )
          )}

          {etapa === "perguntas" && (
            <>
              {capitulo.perguntas.map((p, n) => (
                <button key={p.pergunta} className="historia-opcao" aria-pressed={ouvidas.includes(n)}
                  onClick={() => { tocar("clique"); setOuvidas((o) => (o.includes(n) ? o : [...o, n])); setPergunta(n); setFala(dizer(p.resposta)); }}>
                  {p.pergunta}
                </button>
              ))}
              <button className="historia-opcao historia-opcao--seguir" onClick={() => { tocar("clique"); ir("broto", capitulo.perguntaDoBroto.texto); }}>Seguir ›</button>
            </>
          )}

          {etapa === "broto" && !respondeu && (
            <>
              {capitulo.perguntaDoBroto.opcoes.map((o) => (
                <button key={o.rotulo} className="historia-opcao"
                  onClick={() => { tocar("clique"); setRespondeu(true); setFala(dizer(o.resposta)); if (o.abreCrise) setCrise(true); }}>
                  {dizer(o.rotulo)}
                </button>
              ))}
              <button className="historia-opcao historia-opcao--leve" onClick={() => { tocar("clique"); depoisDoBroto(); }}>Prefiro não responder</button>
            </>
          )}

          {etapa === "oferta" && capitulo.oferta && (
            <button className="historia-opcao" onClick={() => { tocar("clique"); aoOferta?.(capitulo.oferta!.acao); }}>{capitulo.oferta.rotulo}</button>
          )}
      </div>

      {/* Caixa de texto de RPG: nome do Broto, a fala e o "seguir" no canto. */}
      {/* Toque em qualquer parte da caixa: completa o texto ou segue (o botão continua para teclado e leitor). */}
      <div className={`historia-caixa ${seguir || !completo ? "is-tocavel" : ""}`} onPointerUp={tocarCaixa}>
        <span className="historia-caixa__nome" aria-hidden="true">{nomeAlien}</span>
        <div className="historia-caixa__fala" key={fala} aria-hidden="true">
          <span className="historia-balao__texto">
            {visivel}
            {!completo && <span className="historia-fala__cursor" />}
          </span>
          <span className="historia-balao__texto historia-balao__molde">{fala}</span>
        </div>
        {/* Leitor de tela recebe a fala inteira de uma vez, não letra por letra. */}
        <p className="sr-only" aria-live="polite">{nomeAlien} diz. {fala}</p>
        {etapa === "licao"
          ? <button ref={seguirRef} className="historia-caixa__seguir" onClick={() => { tocar("clique"); aoConcluir(); }}>Concluir capítulo ▸</button>
          : seguir && <button ref={seguirRef} className="historia-caixa__seguir" onClick={avancar}>
            {completo ? "Continuar ▸" : "Mostrar tudo ▸"}</button>}
      </div>
      </div>
      {crise && <PainelCrise aoFechar={fecharCrise} />}
    </div>
  );
}
