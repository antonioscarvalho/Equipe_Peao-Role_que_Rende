import { useEffect, useRef } from "react";
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
export function Personalizar({ aoVoltar, dias = DIAS_SEM_APOSTAR_DEMO }: Props) {
  const { aparencia, mudar } = useAparencia();
  const titulo = useRef<HTMLHeadingElement>(null);
  const visivel = aparenciaVisivel(aparencia, dias);
  const proximo = proximoMarco(dias);
  // O app guarda a preferência na classe do <html>; respeitamos sem depender do estado dele.
  const reduzir = document.documentElement.classList.contains("reduzir-animacoes")
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => { titulo.current?.focus(); window.scrollTo(0, 0); }, []);

  return (
    <div className="palco">
      <main className="celular personalizar" aria-labelledby="personalizar-titulo">
        <button className="link personalizar__voltar" onClick={aoVoltar}>← Voltar</button>
        <h1 id="personalizar-titulo" ref={titulo} tabIndex={-1} className="topo__titulo">
          Deixe o bichinho com a sua cara
        </h1>
        <p className="personalizar__nota">Tudo aqui é livre. Mude quando quiser; fica salvo só neste aparelho.</p>

        <div className="personalizar__previa">
          <Bichinho humor="calmo" nivel={3} tamanho={180} reduzir={reduzir} aparencia={visivel} />
        </div>

        {proximo && (
          <p className="personalizar__marco" role="status">
            Próximo marco: <strong>{proximo.item.nome}</strong> com {plural(proximo.item.marco ?? 0)} sem apostar.
            Faltam {plural(proximo.faltam)}.
          </p>
        )}

        <fieldset className="personalizar__grupo">
          <legend>Cor do corpo</legend>
          <Cores nome="cor" opcoes={CORES} valor={aparencia.cor} aoMudar={(cor) => mudar({ cor })} />
        </fieldset>

        <Itens titulo="Roupa" nome="roupa" opcoes={ROUPAS} valor={aparencia.roupa} dias={dias} aoMudar={(roupa) => mudar({ roupa })} />

        <fieldset className="personalizar__grupo">
          <legend>Cor da roupa e dos acessórios</legend>
          <Cores nome="corRoupa" opcoes={CORES_ROUPA} valor={aparencia.corRoupa} aoMudar={(corRoupa) => mudar({ corRoupa })} />
        </fieldset>

        <Itens titulo="Cabeça" nome="cabeca" opcoes={CABECA} valor={aparencia.cabeca} dias={dias} aoMudar={(cabeca) => mudar({ cabeca })} />
        <Itens titulo="Rosto" nome="rosto" opcoes={ROSTO} valor={aparencia.rosto} dias={dias} aoMudar={(rosto) => mudar({ rosto })} />
        <Itens titulo="Peito" nome="peito" opcoes={PEITO} valor={aparencia.peito} dias={dias} aoMudar={(peito) => mudar({ peito })} />

        <div className="personalizar__acoes">
          <button className="link" onClick={() => mudar({ ...APARENCIA_PADRAO })}>Voltar ao visual original</button>
          <button className="rqr-botao" onClick={aoVoltar}>Pronto</button>
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
        <label key={c.id} className="amostra">
          <input type="radio" name={nome} value={c.id} checked={valor === c.id} onChange={() => aoMudar(c.id)} />
          <span className="amostra__cor" style={{ background: c.valor }} aria-hidden="true" />
          <span className="amostra__nome">{c.nome}</span>
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
                <span id={idDica} className="opcao-item__dica">
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
