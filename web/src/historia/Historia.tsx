import { useCallback, useEffect, useRef, useState } from "react";
import { BotaoLibras } from "../BotaoLibras";
import { Dialogo } from "./Dialogo";
import { PainelCrise } from "../AjudaAgora";
import { nomeDoBroto, usePerfil } from "../personalizacao";
import { capitulos, TITULOS } from "./capitulos";
import {
  ORDEM, avisoVisto, capitulosConcluidos, concluirCapitulo, estaDesbloqueado, liberaAmanha, marcarAvisoVisto, marcarParte, parteDoCapitulo,
} from "./progresso";
import { useModal } from "./useModal";
import { tocar } from "../sons";
import type { IdCapitulo } from "./tipos";
import "./historia.css";

/**
 * Entrada da história do Broto: aviso na primeira vez e mapa dos capítulos.
 * Fluxo de um capítulo: abertura (animação) → conversa antes do jogo → jogo → conversa depois → concluído.
 * Cada parte pronta fica marcada (progresso.ts), então "Agora não" não faz perder 15 minutos.
 * Fechar o jogo antes do fim também leva à conversa: não existe derrota.
 * `iniciar`: abre direto num capítulo (primeiro acesso do app), e ao terminar fecha a história.
 * A pergunta dos 18 anos tem tela própria, em voz neutra, antes do cap. 1: não é conversa do alien
 * (skill conversa-broto). Só "Sim" e "Não", e a resposta vale só para esta visita.
 */
type Tela =
  | { tipo: "mapa" }
  | { tipo: "idade"; id: IdCapitulo; menorDeIdade?: boolean }
  | { tipo: "abertura" | "antes" | "jogo" | "depois"; id: IdCapitulo; folhas?: number };

type Props = { aoFechar: () => void; reduzir: boolean; iniciar?: IdCapitulo; trilhaRetorno?: "app" | "jogos" };

export function Historia({ aoFechar, reduzir, iniciar, trilhaRetorno = "app" }: Props) {
  const caixa = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const botaoAjuda = useRef<HTMLButtonElement>(null);
  const [aviso, setAviso] = useState(() => !avisoVisto());
  const [tela, setTela] = useState<Tela>({ tipo: "mapa" });
  const [feitos, setFeitos] = useState(capitulosConcluidos);
  const [anuncio, setAnuncio] = useState("");
  const [crise, setCrise] = useState(false);
  const [menor, setMenor] = useState(false);
  const alien = nomeDoBroto(usePerfil().perfil);
  const fecharCrise = useCallback(() => { setCrise(false); botaoAjuda.current?.focus(); }, []);

  useModal(caixa, aoFechar, (tela.tipo === "mapa" || tela.tipo === "idade") && !crise);

  // Volta ao mapa (ou fecha, se veio direto num capítulo).
  const sair = useCallback(() => (iniciar ? aoFechar() : setTela({ tipo: "mapa" })), [iniciar, aoFechar]);

  /** Começa o capítulo de onde parou. `idadeFeita`: a tela dos 18 anos já passou nesta visita. */
  const comecar = useCallback((id: IdCapitulo, idadeFeita = false) => {
    const e = capitulos[id];
    if (!e || !estaDesbloqueado(id)) return;
    const parte = parteDoCapitulo(id);
    const concluido = capitulosConcluidos().includes(id);
    // O questionário de entrada fica no começo do cap. 1: antes dele, a tela dos 18 anos.
    if (id === "cap1" && !parte && !idadeFeita && !concluido) { setTela({ tipo: "idade", id }); return; }
    // "Ler de novo" reinicia a narrativa e a abertura, em vez de retomar um ponto antigo salvo.
    if (!concluido && parte === "depois") setTela({ tipo: "depois", id });
    else if (!concluido && parte === "jogo" && e.jogo) setTela({ tipo: "jogo", id });
    else if (e.abertura) setTela({ tipo: "abertura", id });
    else setTela({ tipo: "antes", id });
  }, []);
  const abrir = useCallback((id: IdCapitulo) => comecar(id), [comecar]);

  const comecarDireto = useRef(false);
  useEffect(() => {
    if (iniciar && !aviso && !comecarDireto.current) { comecarDireto.current = true; abrir(iniciar); }
  }, [iniciar, aviso, abrir]);

  useEffect(() => {
    if (tela.tipo !== "mapa") return;
    const a = document.activeElement;
    if (!a || a === document.body || !document.contains(a)) titulo.current?.focus();
  }, [tela]);

  const depoisDoAntes = (id: IdCapitulo) => {
    const e = capitulos[id]!;
    tocar("transicao");
    if (e.jogo) { marcarParte(id, "jogo"); setTela({ tipo: "jogo", id }); }
    else { marcarParte(id, "depois"); setTela({ tipo: "depois", id }); }
  };
  const fimDoJogo = useCallback((folhas: number) => {
    tocar("transicao");
    setTela((t) => {
      if (t.tipo !== "jogo") return t;
      marcarParte(t.id, "depois");
      return { tipo: "depois", id: t.id, folhas };
    });
  }, []);

  const concluir = (id: IdCapitulo) => {
    concluirCapitulo(id);
    setFeitos(capitulosConcluidos());
    setAnuncio(`${TITULOS[id]} concluído.`);
    sair();
  };

  const entrada = tela.tipo !== "mapa" ? capitulos[tela.id] : undefined;
  const Jogo = tela.tipo === "jogo" ? entrada?.jogo : undefined;
  const Abertura = tela.tipo === "abertura" ? entrada?.abertura : undefined;
  const fimAbertura = useCallback(() => setTela((t) => (t.tipo === "abertura" ? { tipo: "antes", id: t.id } : t)), []);
  const escondeMapa = (tela.tipo !== "mapa" && tela.tipo !== "idade") || (Boolean(iniciar) && !aviso && tela.tipo !== "idade");

  return (
    <>
      <div ref={caixa} className={`historia ${iniciar ? "historia--inicio" : ""}`} role="dialog" aria-modal="true" aria-labelledby="historia-titulo"
        aria-hidden={escondeMapa || undefined} style={escondeMapa ? { visibility: "hidden" } : undefined}>
        <div className="tela-libras"><BotaoLibras /></div>
        <div className="historia__caixa">
          <h2 id="historia-titulo" ref={titulo} className="historia__titulo" tabIndex={-1}>História do {alien}</h2>
          <button className="historia__fechar" onClick={() => { tocar("clique"); aoFechar(); }} aria-label="Fechar a história">×</button>

          {tela.tipo === "idade" ? (
            tela.menorDeIdade ? (
              <>
                <p className="historia__aviso">
                  Este app é para maiores de 18 anos. Se quiser conversar com alguém, procure um adulto de confiança ou a unidade
                  de saúde do seu bairro. O CVV atende de graça, a qualquer hora, no 188. A história continua aberta para você.
                </p>
                <button className="rqr-botao" onClick={() => { tocar("clique"); comecar(tela.id, true); }}>Continuar</button>
              </>
            ) : (
              <>
                <p className="historia__aviso">Antes de começar: você tem 18 anos ou mais?</p>
                <button className="rqr-botao" onClick={() => { tocar("clique"); setMenor(false); comecar(tela.id, true); }}>Sim</button>
                <button className="rqr-botao" onClick={() => { tocar("clique"); setMenor(true); setTela({ ...tela, menorDeIdade: true }); }}>Não</button>
              </>
            )
          ) : aviso ? (
            <>
              <p className="historia__aviso">Essa história fala de apostas. Pode pular quando quiser.</p>
              <button className="rqr-botao" onClick={() => { tocar("clique"); marcarAvisoVisto(); setAviso(false); }}>Começar</button>
              <button className="historia-agora-nao" onClick={() => { tocar("clique"); aoFechar(); }}>Agora não</button>
            </>
          ) : (
            <ul className="historia__mapa">
              {ORDEM.map((id) => {
                const pronto = Boolean(capitulos[id]);
                const ok = feitos.includes(id);
                const livre = pronto && estaDesbloqueado(id);
                const meio = !ok && livre && parteDoCapitulo(id);
                const estado = ok ? "Concluído · ler de novo" : !pronto ? "Em breve" : meio ? "Continuar" : livre ? "Disponível" : liberaAmanha(id) ? "Libera amanhã · faça uma missão hoje" : "Depois do anterior";
                return (
                  <li key={id}>
                    <button className={`historia-cap ${ok ? "is-ok" : ""}`} disabled={!livre} onClick={() => { tocar("clique"); abrir(id); }}>
                      <span>{TITULOS[id]}</span>
                      <span className="historia-cap__estado">{estado}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button ref={botaoAjuda} className="historia-ajuda" onClick={() => { tocar("clique"); setCrise(true); }}>Preciso de ajuda agora</button>
          <small className="historia-nota">{alien} é um apoio, não um terapeuta.</small>
          <p className="sr-only" aria-live="polite">{anuncio}</p>
        </div>
        {crise && <PainelCrise aoFechar={fecharCrise} />}
      </div>

      {Abertura && <Abertura aoFim={fimAbertura} reduzir={reduzir} />}
      {(tela.tipo === "antes" || tela.tipo === "depois") && entrada && (
        <Dialogo key={`${tela.id}-${tela.tipo}`} capitulo={entrada.capitulo} cena={entrada.cena} reduzir={reduzir}
          parte={tela.tipo} folhas={tela.folhas} menor={menor}
          aoFechar={sair} aoConcluir={() => (tela.tipo === "antes" ? depoisDoAntes(tela.id) : concluir(tela.id))} />
      )}
      {Jogo && <Jogo reduzir={reduzir} trilhaRetorno={trilhaRetorno} aoFechar={() => fimDoJogo(0)} aoTerminar={({ folhas }) => fimDoJogo(folhas)} />}
    </>
  );
}
