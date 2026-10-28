import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Bichinho } from "../Bichinho";
import {
  APARENCIA_PADRAO, CABECA, CORES, CORES_ROUPA, PEITO, ROSTO, ROUPAS,
  aparenciaVisivel, diasQueFaltam, liberado, proximoMarco,
  type Aparencia, type OpcaoCor, type OpcaoItem,
} from "./aparencia";
import { DIAS_SEM_APOSTAR_DEMO, useAparencia } from "./armazenamento";

const plural = (n: number) => (n === 1 ? "1 dia" : `${n} dias`);

type Props = { aoVoltar: () => void; dias?: number };

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

export function Personalizar({ aoVoltar, dias = DIAS_SEM_APOSTAR_DEMO }: Props) {
  const { aparencia, mudar } = useAparencia();
  const [aba, setAba] = useState<Aba>("corpo");
  const titulo = useRef<HTMLHeadingElement>(null);
  const abasRef = useRef<(HTMLButtonElement | null)[]>([]);
  const visivel = aparenciaVisivel(aparencia, dias);
  const proximo = proximoMarco(dias);
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
          <button className="link personalizar__voltar" onClick={aoVoltar}>← Voltar</button>
          <button className="rqr-botao personalizar__pronto" onClick={aoVoltar}>Pronto</button>
        </div>
        <h1 id="personalizar-titulo" ref={titulo} tabIndex={-1} className="topo__titulo personalizar__titulo">
          Deixe o bichinho com a sua cara
        </h1>

        <div className="personalizar__previa">
          <Bichinho humor="calmo" nivel={3} tamanho={120} reduzir={reduzir} aparencia={visivel} />
          <button className="personalizar__original" onClick={() => mudar({ ...APARENCIA_PADRAO })}>
            Visual original
          </button>
          {proximo && (
            <p className="personalizar__marco" role="status">
              Próximo marco: <strong>{proximo.item.nome}</strong> em {plural(proximo.faltam)}
            </p>
          )}
        </div>

        <div className="personalizar__abas" role="tablist" aria-label="O que personalizar" onKeyDown={teclas}>
          {ABAS.map((x, i) => (
            <button key={x.id} ref={(el) => { abasRef.current[i] = el; }} role="tab" id={`aba-${x.id}`}
              aria-selected={aba === x.id} aria-controls={`painel-${x.id}`} tabIndex={aba === x.id ? 0 : -1}
              className={`personalizar__aba ${aba === x.id ? "is-on" : ""}`} onClick={() => setAba(x.id)}>
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
              <Itens titulo="Roupa" nome="roupa" opcoes={ROUPAS} valor={aparencia.roupa} dias={dias} aoMudar={(roupa) => mudar({ roupa })} />
              <fieldset className="personalizar__grupo">
                <legend>Cor da roupa e dos acessórios</legend>
                <Cores nome="corRoupa" opcoes={CORES_ROUPA} valor={aparencia.corRoupa} aoMudar={(corRoupa) => mudar({ corRoupa })} />
              </fieldset>
            </>
          )}
          {aba === "cabeca" && <Itens titulo="Cabeça" nome="cabeca" opcoes={CABECA} valor={aparencia.cabeca} dias={dias} aoMudar={(cabeca) => mudar({ cabeca })} />}
          {aba === "rosto" && <Itens titulo="Rosto" nome="rosto" opcoes={ROSTO} valor={aparencia.rosto} dias={dias} aoMudar={(rosto) => mudar({ rosto })} />}
          {aba === "peito" && <Itens titulo="Peito" nome="peito" opcoes={PEITO} valor={aparencia.peito} dias={dias} aoMudar={(peito) => mudar({ peito })} />}
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
          <input type="radio" name={nome} value={c.id} checked={valor === c.id} onChange={() => aoMudar(c.id)} />
          <span className="amostra__cor" style={{ background: c.valor }} aria-hidden="true" />
          <span className="sr-only">{c.nome}</span>
        </label>
      ))}
    </div>
  );
}

type ItensProps = {
  titulo: string; nome: keyof Aparencia; opcoes: OpcaoItem[]; valor: string; dias: number; aoMudar: (id: string) => void;
};

function Itens({ titulo, nome, opcoes, valor, dias, aoMudar }: ItensProps) {
  return (
    <fieldset className="personalizar__grupo">
      <legend>{titulo}</legend>
      <div className="personalizar__opcoes">
        {opcoes.map((item) => {
          const livre = liberado(item, dias);
          const idDica = `dica-${nome}-${item.id}`;
          return (
            <label key={item.id} className={`opcao-item ${livre ? "" : "is-bloqueado"}`}>
              <input type="radio" name={nome} value={item.id} checked={valor === item.id && livre}
                disabled={!livre} aria-describedby={livre ? undefined : idDica} onChange={() => aoMudar(item.id)} />
              <span>{item.nome}</span>
              {!livre && (
                <span id={idDica} className="sr-only">
                  Com {plural(item.marco ?? 0)} · faltam {plural(diasQueFaltam(item, dias))}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
