import { useCallback, useEffect, useRef, useState } from "react";
import { Dialogo } from "./Dialogo";
import { Queda } from "./Queda";
import { PainelCrise } from "../AjudaAgora";
import { capitulos, TITULOS } from "./capitulos";
import { ORDEM, avisoVisto, capitulosConcluidos, concluirCapitulo, estaDesbloqueado, marcarAvisoVisto } from "./progresso";
import { useModal } from "./useModal";
import type { IdCapitulo } from "./tipos";
import "./historia.css";

/**
 * Entrada da história do Broto: aviso na primeira vez e mapa dos capítulos.
 * Fluxo de um capítulo: jogo (se houver) → conversa → concluído. Fechar o jogo antes do fim
 * também leva à conversa: não existe derrota. "Agora não" na conversa volta ao mapa sem concluir.
 */
type Tela = { tipo: "mapa" } | { tipo: "jogo" | "dialogo"; id: IdCapitulo };

export function Historia({ aoFechar, reduzir }: { aoFechar: () => void; reduzir: boolean }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [aviso, setAviso] = useState(() => !avisoVisto());
  const [tela, setTela] = useState<Tela>({ tipo: "mapa" });
  const [feitos, setFeitos] = useState(capitulosConcluidos);
  const [anuncio, setAnuncio] = useState("");
  const [crise, setCrise] = useState(false);
  const botaoAjuda = useRef<HTMLButtonElement>(null);
  const fecharCrise = useCallback(() => { setCrise(false); botaoAjuda.current?.focus(); }, []);
  // Toda entrada na história começa com o Broto caindo do espaço.
  const [intro, setIntro] = useState(true);
  const fimIntro = useCallback(() => setIntro(false), []);

  const titulo = useRef<HTMLHeadingElement>(null);
  useModal(caixa, aoFechar, tela.tipo === "mapa" && !intro && !crise);

  // Ao abrir e ao voltar ao mapa: se o foco se perdeu (o jogo saiu da tela), traz para o título.
  useEffect(() => {
    if (tela.tipo !== "mapa") return;
    const a = document.activeElement;
    if (!a || a === document.body || !document.contains(a)) titulo.current?.focus();
  }, [tela]);
  useEffect(() => { if (!intro) titulo.current?.focus(); }, [intro]);

  const voltarAoMapa = useCallback(() => setTela({ tipo: "mapa" }), []);
  const abrirDialogo = useCallback(() => setTela((t) => (t.tipo === "jogo" ? { tipo: "dialogo", id: t.id } : t)), []);

  const abrir = (id: IdCapitulo) => {
    const entrada = capitulos[id];
    if (!entrada || !estaDesbloqueado(id)) return;
    setTela({ tipo: entrada.jogo ? "jogo" : "dialogo", id });
  };

  const concluir = (id: IdCapitulo) => {
    concluirCapitulo(id);
    setFeitos(capitulosConcluidos());
    setAnuncio(`${TITULOS[id]} concluído.`);
    setTela({ tipo: "mapa" });
  };

  const entrada = tela.tipo !== "mapa" ? capitulos[tela.id] : undefined;
  const Jogo = tela.tipo === "jogo" ? entrada?.jogo : undefined;

  if (intro) return <Queda aoFim={fimIntro} reduzir={reduzir} />;

  return (
    <>
    <div ref={caixa} className="historia" role="dialog" aria-modal="true" aria-labelledby="historia-titulo"
      aria-hidden={tela.tipo !== "mapa" || undefined}>
      <div className="historia__caixa">
        <h2 id="historia-titulo" ref={titulo} className="historia__titulo" tabIndex={-1}>História do Broto</h2>
        <button className="historia__fechar" onClick={aoFechar} aria-label="Fechar a história">×</button>

        {aviso ? (
          <>
            <p className="historia__aviso">Essa história fala de apostas. Pode pular quando quiser.</p>
            <button className="rqr-botao" onClick={() => { marcarAvisoVisto(); setAviso(false); }}>Começar</button>
            <button className="historia-agora-nao" onClick={aoFechar}>Agora não</button>
          </>
        ) : (
          <ul className="historia__mapa">
            {ORDEM.map((id) => {
              const pronto = Boolean(capitulos[id]);
              const ok = feitos.includes(id);
              const livre = pronto && estaDesbloqueado(id);
              const estado = ok ? "Concluído · ler de novo" : !pronto ? "Em breve" : livre ? "Disponível" : "Depois do anterior";
              return (
                <li key={id}>
                  <button className={`historia-cap ${ok ? "is-ok" : ""}`} disabled={!livre} onClick={() => abrir(id)}>
                    <span>{TITULOS[id]}</span>
                    <span className="historia-cap__estado">{estado}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <button ref={botaoAjuda} className="historia-ajuda" onClick={() => setCrise(true)}>Preciso de ajuda agora</button>
        <small className="historia-nota">O Broto é um apoio, não um terapeuta.</small>
        <p className="sr-only" aria-live="polite">{anuncio}</p>
        {crise && <PainelCrise aoFechar={fecharCrise} />}
    </div>
    </div>

      {Jogo && <Jogo reduzir={reduzir} aoFechar={abrirDialogo} aoTerminar={abrirDialogo} />}
      {tela.tipo === "dialogo" && entrada && (
        <Dialogo capitulo={entrada.capitulo} cena={entrada.cena} reduzir={reduzir}
          aoFechar={voltarAoMapa} aoConcluir={() => concluir(tela.id)} />
      )}
    </>
  );
}
