import { useCallback, useEffect, useRef, useState } from "react";
import { Bichinho, type Humor } from "../Bichinho";
import { PainelCrise } from "../AjudaAgora";
import { useAparenciaVisivel } from "../personalizacao";
import { useModal } from "./useModal";
import type { Capitulo } from "./tipos";
import type { Cena } from "./cenas/tipos";
import "./historia.css";

/**
 * Conduz a conversa de um capítulo com o Broto, em etapas:
 * abertura → perguntas da pessoa (opcionais, em qualquer ordem) → pergunta do Broto → oferta (se houver) → lição.
 * Regras (skills design-etico-saude-digital, entrevista-motivacional, seguranca-e-crise, acessibilidade-wcag):
 * - "Agora não" em todas as etapas; nenhuma pergunta obriga a responder.
 * - A resposta da pessoa vive só neste estado do React: não é salva nem enviada.
 * - Opção com `abreCrise` abre o protocolo de crise (o mesmo painel do "Preciso de ajuda agora").
 */
/** Fala de transição da base, igual para todos os capítulos. REVISÃO CLÍNICA PENDENTE. */
const CONVITE_PERGUNTAS = "Pode me perguntar o que quiser. Ou a gente segue.";

type Etapa = "abertura" | "perguntas" | "broto" | "oferta" | "licao";

type Props = {
  capitulo: Capitulo;
  aoConcluir: () => void;
  aoFechar: () => void;
  reduzir: boolean;
  /** Chamado se a pessoa aceitar a oferta do capítulo. Quem integra decide o que `acao` abre. */
  aoOferta?: (acao: string) => void;
  /** Arte de fundo do capítulo, que muda com o momento da conversa. Sem ela, fica o céu padrão. */
  cena?: Cena;
};

/** Texto aparecendo aos poucos; com `reduzir`, aparece inteiro na hora. */
function useDigitando(texto: string, reduzir: boolean) {
  const [n, setN] = useState(reduzir ? texto.length : 0);
  useEffect(() => {
    if (reduzir) { setN(texto.length); return; }
    setN(0);
    const id = window.setInterval(() => {
      setN((v) => { if (v >= texto.length) { window.clearInterval(id); return v; } return v + 1; });
    }, 24);
    return () => window.clearInterval(id);
  }, [texto, reduzir]);
  return { visivel: texto.slice(0, n), completo: n >= texto.length };
}

export function Dialogo({ capitulo, aoConcluir, aoFechar, reduzir, aoOferta, cena: CenaDoCapitulo }: Props) {
  const aparencia = useAparenciaVisivel();
  const caixa = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const [etapa, setEtapa] = useState<Etapa>("abertura");
  const [ouvidas, setOuvidas] = useState<number[]>([]);
  const [fala, setFala] = useState(capitulo.falaAbertura);
  const [respondeu, setRespondeu] = useState(false);
  const [crise, setCrise] = useState(false);
  const [pergunta, setPergunta] = useState<number | null>(null);

  useModal(caixa, aoFechar, !crise);
  useEffect(() => { titulo.current?.focus(); }, []);

  const { visivel, completo } = useDigitando(fala, reduzir);

  const fecharCrise = useCallback(() => {
    setCrise(false);
    titulo.current?.focus();
  }, []);

  const ir = (proxima: Etapa, novaFala: string) => {
    setEtapa(proxima);
    setFala(novaFala);
    titulo.current?.focus();
  };

  const depoisDoBroto = () =>
    capitulo.oferta ? ir("oferta", fala) : ir("licao", capitulo.licao);

  const humor: Humor = etapa === "licao" ? "orgulhoso" : etapa === "broto" ? "apoio" : etapa === "abertura" ? "cansado" : "calmo";

  return (
    <div ref={caixa} className="historia-dialogo" role="dialog" aria-modal="true" aria-labelledby="dialogo-titulo">
      <div className="historia-dialogo__palco">
        {CenaDoCapitulo ? <CenaDoCapitulo momento={{ etapa, pergunta }} reduzir={reduzir} /> : <div className="historia-dialogo__ceu" />}
        <h2 id="dialogo-titulo" ref={titulo} tabIndex={-1} className="historia-dialogo__titulo">
          {capitulo.titulo}
        </h2>
        <div className="historia-dialogo__cena">
          <div className="historia-balao" key={fala}>
            <p className="historia-balao__texto" aria-hidden="true">
              {visivel}
              {!completo && <span className="historia-fala__cursor" />}
            </p>
            {/* Ocupa o espaço da fala inteira, para o balão não crescer letra por letra. */}
            <p className="historia-balao__texto historia-balao__molde" aria-hidden="true">{fala}</p>
          </div>
          {/* Leitor de tela recebe a fala inteira de uma vez, não letra por letra. */}
          <p className="sr-only" aria-live="polite">Broto: {fala}</p>
          <div className="historia-dialogo__broto">
            <Bichinho humor={humor} nivel={2} tamanho={104} reduzir={reduzir} aparencia={aparencia} />
          </div>
        </div>
      </div>

        <div className="historia-dialogo__painel">
        <div className="historia-dialogo__acoes">
          {etapa === "abertura" && (
            <button className="rqr-botao" onClick={() => capitulo.perguntas.length ? ir("perguntas", CONVITE_PERGUNTAS) : ir("broto", capitulo.perguntaDoBroto.texto)}>
              Continuar
            </button>
          )}

          {etapa === "perguntas" && (
            <>
              {capitulo.perguntas.map((p, i) => (
                <button key={p.pergunta} className="historia-opcao" aria-pressed={ouvidas.includes(i)}
                  onClick={() => { setOuvidas((o) => (o.includes(i) ? o : [...o, i])); setPergunta(i); setFala(p.resposta); }}>
                  {p.pergunta}
                </button>
              ))}
              <button className="rqr-botao" onClick={() => ir("broto", capitulo.perguntaDoBroto.texto)}>Seguir</button>
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
          {etapa === "broto" && respondeu && (
            <button className="rqr-botao" onClick={depoisDoBroto}>Continuar</button>
          )}

          {etapa === "oferta" && capitulo.oferta && (
            <>
              <button className="historia-opcao" onClick={() => aoOferta?.(capitulo.oferta!.acao)}>{capitulo.oferta.rotulo}</button>
              <button className="rqr-botao" onClick={() => ir("licao", capitulo.licao)}>Continuar</button>
            </>
          )}

          {etapa === "licao" && (
            <button className="rqr-botao" onClick={aoConcluir}>Concluir capítulo</button>
          )}

          <button className="historia-agora-nao" onClick={aoFechar}>Agora não</button>
        </div>

        <small className="historia-nota">O Broto é um apoio, não um terapeuta. O que você escolhe aqui não é salvo.</small>
        </div>
      {crise && <PainelCrise aoFechar={fecharCrise} />}
    </div>
  );
}
