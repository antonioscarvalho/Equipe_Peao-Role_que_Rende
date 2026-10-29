import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BotaoLibras } from "../BotaoLibras";
import { Bichinho } from "../Bichinho";
import {
  APARENCIA_PADRAO, CABECA, CORES, CORES_ROUPA, PEITO, ROSTO, ROUPAS,
  aparenciaVisivel, liberado, metaCurta, proximoMarco, textoMeta,
  type Aparencia, type OpcaoCor, type OpcaoItem, type Progresso,
} from "./aparencia";
import { useAparencia, useProgresso } from "./armazenamento";
import { usePerfil } from "./armazenamento-perfil";
import { nomeDoBroto } from "./perfil";
import { BotaoTema } from "../BotaoTema";
import { tocar } from "../sons";
import { vibrar } from "../tato";


type Props = { aoVoltar: () => void };

/**
 * Tela de personalização do bichinho (spec 009). Tudo é livre, menos os 3 itens de marco
 * (7, 30, 90 dias), que aparecem desde já com quantos dias faltam. Sem loja, moeda ou sorteio.
 */
type Aba = "corpo" | "roupa" | "cabeca" | "rosto" | "peito";
const ABAS: { id: Aba; rotulo: string }[] = [
  { id: "corpo", rotulo: "Corpo" },
  { id: "roupa", rotulo: "Roupa" },
  { id: "cabeca", rotulo: "Cabeça" },
  { id: "rosto", rotulo: "Rosto" },
  { id: "peito", rotulo: "Peito" },
];

export function Personalizar({ aoVoltar }: Props) {
  const { aparencia, mudar } = useAparencia();
  const [aba, setAba] = useState<Aba>("corpo");
  const titulo = useRef<HTMLHeadingElement>(null);
  const abasRef = useRef<(HTMLButtonElement | null)[]>([]);
  const progresso = useProgresso();
  const { perfil } = usePerfil();
  const visivel = aparenciaVisivel(aparencia, progresso);
  const proximo = proximoMarco(progresso);
  // O app guarda a preferência na classe do <html>; respeitamos sem depender do estado dele.
  const reduzir = document.documentElement.classList.contains("reduzir-animacoes")
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => { titulo.current?.focus(); window.scrollTo(0, 0); }, []);

  // Setas e Home/End trocam de aba (padrão WAI-ARIA de abas).
  const teclas = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = ABAS.findIndex((x) => x.id === aba);
    const prox = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ABAS.length - 1 }[e.key];
    if (prox === undefined) return;
    e.preventDefault();
    const j = (prox + ABAS.length) % ABAS.length;
    setAba(ABAS[j].id);
    abasRef.current[j]?.focus();
  };

  return (
    <div className="palco">
      <main className="celular personalizar" aria-labelledby="personalizar-titulo">
        <div className="personalizar__topo">
          <button className="link personalizar__voltar" onClick={() => { tocar("clique"); aoVoltar(); }}>← Voltar</button>
          <span className="personalizar__acoes">
            <BotaoLibras />
            <BotaoTema compacto />
            <button className="rqr-botao personalizar__pronto" onClick={() => { tocar("clique"); aoVoltar(); }}>Pronto</button>
          </span>
        </div>
        <h1 id="personalizar-titulo" ref={titulo} tabIndex={-1} className="topo__titulo personalizar__titulo">
          Deixe o {nomeDoBroto(perfil)} com a sua cara
        </h1>

        <div className="personalizar__previa">
          <Bichinho humor="calmo" nivel={3} tamanho={120} reduzir={reduzir} aparencia={visivel} />
          <button className="personalizar__original" onClick={() => { tocar("clique"); mudar({ ...APARENCIA_PADRAO }); }}>
            Visual original
          </button>
          {proximo && (
            <p className="personalizar__marco" role="status">
              Próximo: <strong>{proximo.item.nome}</strong> · {proximo.texto}
            </p>
          )}
        </div>

        <div className="personalizar__abas" role="tablist" aria-label="O que personalizar" onKeyDown={teclas}>
          {ABAS.map((x, i) => (
            <button key={x.id} ref={(el) => { abasRef.current[i] = el; }} role="tab" id={`aba-${x.id}`}
              aria-selected={aba === x.id} aria-controls={`painel-${x.id}`} tabIndex={aba === x.id ? 0 : -1}
              className={`personalizar__aba ${aba === x.id ? "is-on" : ""}`} onClick={() => { tocar("clique"); setAba(x.id); }}>
              {x.rotulo}
            </button>
          ))}
        </div>

        <div className="personalizar__painel" role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`}>
          {aba === "corpo" && (
            <fieldset className="personalizar__grupo">
              <legend>Cor do corpo</legend>
              <Cores nome="cor" opcoes={CORES} valor={aparencia.cor} aoMudar={(cor) => mudar({ cor })} />
            </fieldset>
          )}
          {aba === "roupa" && (
            <>
              <Itens titulo="Roupa" nome="roupa" base={visivel} opcoes={ROUPAS} valor={aparencia.roupa} progresso={progresso} aoMudar={(roupa) => mudar({ roupa })} />
              <fieldset className="personalizar__grupo">
                <legend>Cor da roupa e dos acessórios</legend>
                <Cores nome="corRoupa" opcoes={CORES_ROUPA} valor={aparencia.corRoupa} aoMudar={(corRoupa) => mudar({ corRoupa })} />
              </fieldset>
            </>
          )}
          {aba === "cabeca" && <Itens titulo="Cabeça" nome="cabeca" base={visivel} opcoes={CABECA} valor={aparencia.cabeca} progresso={progresso} aoMudar={(cabeca) => mudar({ cabeca })} />}
          {aba === "rosto" && <Itens titulo="Rosto" nome="rosto" base={visivel} opcoes={ROSTO} valor={aparencia.rosto} progresso={progresso} aoMudar={(rosto) => mudar({ rosto })} />}
          {aba === "peito" && <Itens titulo="Peito" nome="peito" base={visivel} opcoes={PEITO} valor={aparencia.peito} progresso={progresso} aoMudar={(peito) => mudar({ peito })} />}
        </div>

      </main>
    </div>
  );
}

type CoresProps = { nome: keyof Aparencia; opcoes: OpcaoCor[]; valor: string; aoMudar: (id: string) => void };

function Cores({ nome, opcoes, valor, aoMudar }: CoresProps) {
  return (
    <div className="personalizar__opcoes">
      {opcoes.map((c) => (
        <label key={c.id} className="amostra" title={c.nome}>
          <input type="radio" name={nome} value={c.id} checked={valor === c.id} onChange={() => { tocar("clique"); aoMudar(c.id); }} />
          <span className="amostra__cor" style={{ background: c.valor }} aria-hidden="true" />
          <span className="sr-only">{c.nome}</span>
        </label>
      ))}
    </div>
  );
}

type ItensProps = {
  titulo: string; nome: keyof Aparencia; base: Aparencia; opcoes: OpcaoItem[]; valor: string; progresso: Progresso; aoMudar: (id: string) => void;
};

/** Cada opção é um cartão com o bichinho já usando o item, para escolher olhando, não lendo. */
function Itens({ titulo, nome, base, opcoes, valor, progresso, aoMudar }: ItensProps) {
  return (
    <fieldset className="personalizar__grupo">
      <legend>{titulo}</legend>
      <div className="personalizar__opcoes">
        {opcoes.map((item) => {
          const livre = liberado(item, progresso);
          const idDica = `dica-${nome}-${item.id}`;
          return (
            <label key={item.id} className={`opcao-item ${livre ? "" : "is-bloqueado"}`}
              onClick={livre ? undefined : () => vibrar("aviso")}>
              <input type="radio" name={nome} value={item.id} checked={valor === item.id && livre}
                disabled={!livre} aria-describedby={livre ? undefined : idDica} onChange={() => { tocar("clique"); aoMudar(item.id); }} />
              <span className="opcao-item__previa" aria-hidden="true">
                <Bichinho humor="calmo" nivel={3} tamanho={56} reduzir aparencia={{ ...base, [nome]: item.id }} />
              </span>
              <span className="opcao-item__nome">{item.nome}</span>
              {item.tema && <span className="opcao-item__tema" aria-hidden="true">{item.tema}</span>}
              {!livre && item.meta && <span className="opcao-item__marco" aria-hidden="true">{metaCurta(item.meta)}</span>}
              {!livre && (
                <span id={idDica} className="sr-only">
                  {textoMeta(item, progresso)}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
