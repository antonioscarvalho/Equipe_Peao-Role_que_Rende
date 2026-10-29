import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Bichinho, type Humor } from "./Bichinho";
import { Contador } from "./Contador";
import { Respiracao } from "./Respiracao";
import { Icone } from "./Icone";
import { Animacao } from "./Animacao";
import { Confete } from "./Confete";
import { PuloDoBichinho } from "./jogos/pulo/PuloDoBichinho";
import { JOGOS, nomeCapitulo } from "./jogos/catalogo";
import { Historia } from "./historia/Historia";
import { Abertura } from "./Abertura";
import { ORDEM, capitulosConcluidos, estaDesbloqueado, jaFezCapituloHoje, liberaAmanha } from "./historia/progresso";
import { capitulos, TITULOS } from "./historia/capitulos";
import { apagarConhecer, useConhecer } from "./historia/conhecer";
import type { NomeIcone } from "./icones-data";
import { definirVolumeEfeitos, definirVolumeMusica, pararTrilha, precarregarTrilhas, tocar, tocarMissao, tocarTrilha, volumesIniciais } from "./sons";
import { nomeDoBroto, useAparenciaVisivel, usePerfil } from "./personalizacao";
import { useProgresso } from "./personalizacao/armazenamento";
import { categoriaDe, proximoMarco, quantoFalta } from "./personalizacao/aparencia";
import { abrirPersonalizar } from "./personalizacao/rota";
import { precarregarPulo } from "./jogos/pulo/precarregar";
import { RoleDeCarrinho } from "./carrinho/RoleDeCarrinho";
import { BotaoTema } from "./BotaoTema";
import { useContraste } from "./tema";
import { useVibrar, vibrar } from "./tato";
import { BotaoLibras } from "./BotaoLibras";
import { PainelCrise } from "./AjudaAgora";
import { ModalAcessibilidade } from "./ModalAcessibilidade";
import { ehMenorDeIdade } from "./menor";
import { gravarGuardado, lerGuardado } from "./guardado";
import { DIAS_DO_PLANO, SEMANAS, TOTAL_MISSOES, alternarMissao, diaDeInicio, usePlano, type EstadoPlano, type Missao } from "./plano";

const CHAVE_PRIMEIRO_ACESSO = "rqr:primeiro-acesso";

type Aba = "inicio" | "missoes" | "jogos" | "ajustes";
const TITULOS_ABA: Record<Aba, string> = { inicio: "Seu dia hoje", missoes: "Missões da semana", jogos: "Jogos", ajustes: "Ajustes" };

/**
 * Humor do Broto, a partir do que a pessoa fez (nada de demonstração):
 * - de madrugada (0h–5h): sonolento ("cansado"), sugere descanso;
 * - semana de missões completa ou capítulo concluído hoje: orgulhoso;
 * - alguma missão hoje: feliz;
 * - o resto do tempo: calmo.
 * Eventos passam por cima por um tempo (missão concluída: pula; "Deu vontade": braços abertos).
 * Regra (skill gamificacao-etica): ele nunca fica triste para cobrar nem "adoece" por ausência.
 */
function humorDoDia(plano: EstadoPlano): Humor {
  const hora = new Date().getHours();
  if (hora < 5) return "cansado";
  const semana = SEMANAS[plano.semana - 1];
  const semanaCompleta = semana.missoes.every((x) => plano.feitas[x.id]);
  if (semanaCompleta || jaFezCapituloHoje()) return "orgulhoso";
  if (plano.feitasHoje > 0) return "feliz";
  return "calmo";
}

/** Próxima missão: a primeira por fazer da semana atual; se ela estiver completa, uma de semanas anteriores. */
function proximaMissao(plano: EstadoPlano): Missao | undefined {
  for (let n = plano.semana; n >= 1; n--) {
    const x = SEMANAS[n - 1].missoes.find((mi) => !plano.feitas[mi.id]);
    if (x) return x;
  }
  return undefined;
}

/** O que a história tem para hoje, para o cartão da tela inicial. */
function capituloDeHoje(): { titulo: string; estado: string; pronto: boolean } {
  const feitos = capitulosConcluidos();
  const id = ORDEM.find((c) => !feitos.includes(c));
  if (!id) return { titulo: "História completa", estado: "Releia quando quiser", pronto: true };
  const titulo = TITULOS[id];
  if (!capitulos[id]) return { titulo, estado: "Chega em breve", pronto: false };
  if (estaDesbloqueado(id)) return { titulo, estado: "Disponível hoje", pronto: true };
  if (liberaAmanha(id)) return { titulo, estado: "Libera amanhã", pronto: false };
  return { titulo, estado: "Depois do anterior", pronto: false };
}

/** Régua de volume (0 a 10), no mesmo padrão da régua de vontade: setas, Home/End e os botões −/+
 * cobrem quem não consegue arrastar (2.5.7); `aria-valuetext` diz a porcentagem, não só o número (4.1.2). */
function ControleVolume({ id, rotulo, valor, aoMudar }: { id: string; rotulo: string; valor: number; aoMudar: (v: number) => void }) {
  const pct = valor * 10;
  return (
    <div className="controle-volume">
      <div className="controle-volume__topo">
        <label htmlFor={id} className="ajuste__texto">{rotulo}</label>
        <span className="controle-volume__valor" aria-hidden="true">{valor === 0 ? "Mudo" : `${pct}%`}</span>
      </div>
      <div className="controle-volume__linha">
        <button type="button" className="controle-volume__passo" aria-label={`Diminuir ${rotulo.toLowerCase()}`}
          onClick={() => aoMudar(Math.max(0, valor - 1))}>−</button>
        {/* a11y: tem rótulo, sim — <label htmlFor={id}> duas linhas acima, mesmo `id`. O auditar.mjs
            não liga `htmlFor={id}`/`id={id}` dinâmico entre elementos não-irmãos; falso positivo. */}
        <input id={id} type="range" min={0} max={10} step={1} value={valor}
          onChange={(e) => aoMudar(Number(e.target.value))}
          aria-valuetext={valor === 0 ? "mudo" : `${pct} por cento`} />
        <button type="button" className="controle-volume__passo" aria-label={`Aumentar ${rotulo.toLowerCase()}`}
          onClick={() => aoMudar(Math.min(10, valor + 1))}>+</button>
      </div>
    </div>
  );
}

function BotaoAba({ aba, atual, mudar, icone, rotulo }: { aba: Aba; atual: Aba; mudar: (a: Aba) => void; icone: NomeIcone; rotulo: string }) {
  const ativa = aba === atual;
  return (
    <button className={`tabbar__item ${ativa ? "is-active" : ""}`} aria-current={ativa ? "page" : undefined}
      onClick={() => { tocar("clique"); mudar(aba); }}>
      <Icone nome={icone} tamanho={22} />
      <span>{rotulo}</span>
    </button>
  );
}

export default function App() {
  const [aba, setAba] = useState<Aba>("inicio");
  const plano = usePlano();
  const [semanaVista, setSemanaVista] = useState(plano.semana);
  const [evento, setEvento] = useState<{ humor: Humor; ate: number } | null>(null);
  const [crise, setCrise] = useState(false);
  // "crise": aberto pelo "Deu vontade", com convite de 3 minutos pra onda passar.
  const [jogo, setJogo] = useState<false | "pulo" | "carrinho" | "crise">(false);
  // false = fechada; true = mapa; "cap1" = primeiro acesso, direto no capítulo 1.
  const [historia, setHistoria] = useState<boolean | "cap1">(false);
  const [abrindo, setAbrindo] = useState(true);
  // Primeiro acesso: modal de acessibilidade antes da história.
  const [convite, setConvite] = useState(false);
  // Respondeu que tem menos de 18 anos (tela de idade da história): só a tela de ajuda, sem o resto do app.
  const [menorDeIdade, setMenorDeIdade] = useState(ehMenorDeIdade);
  const conhecer = useConhecer();
  const { perfil } = usePerfil();
  const nomeBroto = nomeDoBroto(perfil);
  const [brilho, setBrilho] = useState(0);
  const [confete, setConfete] = useState(0);
  // Reduzir animações: a escolha guardada vence; sem escolha, segue o aparelho (WCAG 2.3.3).
  const [reduzir, setReduzirEstado] = useState(() => {
    try {
      const v = localStorage.getItem("rqr-reduzir");
      if (v === "1" || v === "0") return v === "1";
    } catch { /* modo privado */ }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const setReduzir = (v: boolean) => {
    try { localStorage.setItem("rqr-reduzir", v ? "1" : "0"); } catch { /* vale só nesta visita */ }
    setReduzirEstado(v);
  };
  // Montado aqui (e não só em Ajustes) para o alto contraste valer em todas as telas.
  const contraste = useContraste();
  const vibracao = useVibrar();
  const [aviso, setAviso] = useState("");
  // Efeitos (missões, cliques) e música (cantiga, trilha) têm volume e guarda separados,
  // numa régua de 0 a 10 (cada setter já aplica e grava; nenhum efeito extra precisa disso).
  // A respiração (SOS) continua sem som por padrão, conforme spec 003 CA-3.
  const [volumes, setVolumes] = useState(volumesIniciais);
  const definirEfeitos = (v: number) => {
    const eraMudo = volumes.efeitos === 0;
    definirVolumeEfeitos(v);
    setVolumes((x) => ({ ...x, efeitos: v }));
    if (eraMudo && v > 0) tocar("clique");
  };
  const definirMusica = (v: number) => {
    definirVolumeMusica(v);
    setVolumes((x) => ({ ...x, musica: v }));
  };
  const aparencia = useAparenciaVisivel();
  const progresso = useProgresso();
  const feitosCaps = capitulosConcluidos();

  // Enquanto a abertura aparece, já baixa o Pulo do Bichinho (jogo do cap. 1) para ele abrir fluido.
  useEffect(() => { precarregarPulo(); }, []);
  useEffect(() => { document.title = `${TITULOS_ABA[aba]} · Meu amigo Broto!`; }, [aba]);
  useEffect(() => { setSemanaVista(plano.semana); }, [plano.semana]);

  // O tema anterior fica no menu Jogos; a trilha nova acompanha a navegação principal.
  // A abertura fica silenciosa e a música entra quando o primeiro menu aparece.
  useEffect(() => {
    if (abrindo) return;
    if (historia) {
      pararTrilha();
      return;
    }
    const menuJogos = aba === "jogos";
    tocarTrilha(
      menuJogos ? "/sons/trilha-alegre.opus" : "/sons/trilha-leve.opus",
      menuJogos
        ? { titulo: "Rolê de Hoje", artista: "Tema do menu de jogos" }
        : { titulo: "Um Passo de Cada Vez", artista: "Trilha do app" },
    );
  }, [aba, abrindo, historia]);

  // Pré-carrega apenas o que a pessoa provavelmente vai abrir a seguir; evita baixar a OST inteira no início.
  useEffect(() => {
    if (abrindo) return;
    if (aba === "jogos") {
      precarregarTrilhas(["/sons/trilha-pulo.opus"]);
    }
    if (historia) precarregarTrilhas(["/sons/cantiga-vo.opus"]);
    if (crise) precarregarTrilhas(["/sons/respirar-calma.opus"]);
  }, [aba, abrindo, historia, crise]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduzir-animacoes", reduzir);
  }, [reduzir]);
  // O humor de um evento dura um tempo e volta para o humor do dia.
  useEffect(() => {
    if (!evento) return;
    const t = window.setTimeout(() => setEvento(null), Math.max(0, evento.ate - Date.now()));
    return () => window.clearTimeout(t);
  }, [evento]);
  const humor: Humor = evento?.humor ?? humorDoDia(plano);

  const marcar = useCallback((mi: Missao) => {
    const feita = alternarMissao(mi.id);
    if (!feita) { setAviso(`Missão desmarcada: ${mi.texto}.`); return; }
    const semana = SEMANAS.find((s) => s.missoes.includes(mi))!;
    const feitasNaSemana = semana.missoes.filter((x) => x === mi || plano.feitas[x.id]).length;
    setEvento({ humor: "feliz", ate: Date.now() + 2600 });
    setBrilho((k) => k + 1);
    setConfete((c) => c + 1);
    tocarMissao(feitasNaSemana, semana.missoes.length);
    window.setTimeout(() => tocar("folha"), 450);
    const completou = feitasNaSemana === semana.missoes.length;
    vibrar(completou ? "conquista" : "sucesso");
    if (completou) window.setTimeout(() => tocar("conquista"), 1100);
    setAviso(completou ? `Semana ${semana.numero} completa! ${nomeBroto} tá orgulhoso.` : `Missão feita: ${mi.texto}.`);
  }, [plano.feitas, nomeBroto]);

  const proxima = proximaMissao(plano);
  const semanaAtual = SEMANAS[plano.semana - 1];
  const feitasSemanaAtual = semanaAtual.missoes.filter((x) => plano.feitas[x.id]).length;

  const abrirCrise = () => { setCrise(true); setEvento({ humor: "apoio", ate: Date.now() + 10 * 60_000 }); };
  const fecharCrise = () => { setCrise(false); setEvento({ humor: "apoio", ate: Date.now() + 30_000 }); };

  // Ajustes de acessibilidade: os mesmos na aba Ajustes e no modal do primeiro acesso.
  const ajustesAcessibilidade = (
    <>
      <h2 className="ajustes__grupo"><Icone nome="acessibilidade" tamanho={18} /> Acessibilidade e conforto</h2>
      <div className="ajustes">
        <label className="ajuste">
          <span className="ajuste__texto"><span className="ajuste__titulo-icone"><Icone nome="contraste" tamanho={18} /> Alto contraste</span><small>Cores mais fortes e sem textura atrás do texto</small></span>
          <input type="checkbox" role="switch" checked={contraste.alto} onChange={(e) => { tocar("clique"); contraste.mudar(e.target.checked); }} />
          <span className="interruptor__trilho" aria-hidden="true" />
        </label>
        <label className="ajuste">
          <span className="ajuste__texto">Reduzir animações<small>Menos movimento na tela</small></span>
          <input type="checkbox" role="switch" checked={reduzir} onChange={(e) => setReduzir(e.target.checked)} />
          <span className="interruptor__trilho" aria-hidden="true" />
        </label>
        <div className="ajuste">
          <span className="ajuste__texto">Tema<small>Claro, escuro ou automático</small></span>
          <BotaoTema compacto />
        </div>
      </div>

      <h2 className="ajustes__grupo">Vibração</h2>
      <div className="ajustes">
        <label className="ajuste">
          <span className="ajuste__texto">Vibrar
            <small>{vibracao.suportado
              ? "O celular vibra de leve nos botões, nas missões e nos avisos"
              : "Este aparelho não vibra pelo navegador. O resto continua igual"}</small>
          </span>
          <input type="checkbox" role="switch" checked={vibracao.ligado} onChange={(e) => vibracao.mudar(e.target.checked)} />
          <span className="interruptor__trilho" aria-hidden="true" />
        </label>
      </div>

      <h2 className="ajustes__grupo">Som</h2>
      <div className="ajustes controles-volume">
        <ControleVolume id="volume-efeitos" rotulo="Efeitos" valor={volumes.efeitos} aoMudar={definirEfeitos} />
        <ControleVolume id="volume-musica" rotulo="Música" valor={volumes.musica} aoMudar={definirMusica} />
      </div>
    </>
  );

  if (menorDeIdade) return <PainelCrise bloqueio aoFechar={() => {}} />;

  return (
    <div className="palco">
      <Decoracao />
      <main className="celular" aria-label={TITULOS_ABA[aba]}>
        <header className="topo">
          <div>
            <p className="topo__oi">{perfil.nome ? `Oi, ${perfil.nome}` : "Oi!"}</p>
            <h1 className="topo__titulo">{TITULOS_ABA[aba]}</h1>
          </div>
          <div className="topo__acoes">
            <BotaoLibras />
            <BotaoTema compacto />
          </div>
        </header>

        {aba === "inicio" && (
          <>
            {/* Cena: o Broto reage ao seu dia. Tocar nele abre a personalização. */}
            <section className="cena" aria-label={nomeBroto}>
              <button className="cena__broto" onClick={() => { tocar("clique"); abrirPersonalizar(); }}
                aria-label={`Personalizar o ${nomeBroto}`}>
                <Bichinho humor={humor} nivel={Math.min(3, feitasSemanaAtual)} reduzir={reduzir} aparencia={aparencia} tamanho={170} />
              </button>
              {brilho > 0 && humor === "feliz" && (
                <div className="cena__brilho" key={brilho}>
                  <Animacao nome="brilho" tamanho={120} repetir={false} reduzir={reduzir} />
                </div>
              )}
            </section>

            {/* Foco no caminho: dias do plano e missões feitas. */}
            <section className="cards contagem" aria-label="Seu caminho">
              <article className="rqr-card mini mini--linha contagem__item">
                <span className="mini__icone mini__icone--dias"><Icone nome="sprout" tamanho={20} /></span>
                <div>
                  <p className="mini__rotulo">{plano.concluido ? "Plano concluído" : "Dia do plano"}</p>
                  <p className="mini__valor">{plano.dia}<small> de {DIAS_DO_PLANO}</small></p>
                </div>
              </article>
              <article className="rqr-card mini mini--linha contagem__item">
                <span className="mini__icone mini__icone--feitas" key={brilho}><Icone nome="check" tamanho={20} /></span>
                <div>
                  <p className="mini__rotulo">Missões feitas</p>
                  <p className="mini__valor"><Contador valor={plano.totalFeitas} reduzir={reduzir} formato="numero" /><small> de {TOTAL_MISSOES}</small></p>
                </div>
              </article>
            </section>

            {/* Dois cartões: o capítulo de hoje e o próximo presente do Broto. */}
            {(() => {
              const cap = capituloDeHoje();
              const presente = proximoMarco(progresso);
              const vestido = presente ? { ...aparencia, [categoriaDe(presente.item)]: presente.item.id } : aparencia;
              return (
                <div className="destaques">
                  <button className={`destaque destaque--historia ${cap.pronto ? "is-pronto" : ""}`} onClick={() => { tocar("clique"); setHistoria(true); }}>
                    <span className="destaque__rotulo"><Icone nome="bookOpen" tamanho={14} /> História</span>
                    <span className="destaque__titulo">{cap.titulo.replace(/^\d+\. /, "")}</span>
                    <span className="destaque__estado">{cap.estado}</span>
                    {cap.pronto && cap.estado === "Disponível hoje" && <span className="destaque__novo" aria-hidden="true">Novo!</span>}
                  </button>
                  {/* Sem aria-label: o nome acessível é o próprio texto visível (WCAG 2.5.3). */}
                  <button className="destaque destaque--presente" onClick={() => { tocar("clique"); abrirPersonalizar(); }}>
                    <span className="presente__vitrine" aria-hidden="true">
                      <Bichinho humor="calmo" nivel={2} tamanho={64} reduzir aparencia={vestido} />
                    </span>
                    <span className="presente__info">
                      <span className="destaque__rotulo">Próximo presente</span>
                      <span className="destaque__titulo">{presente ? presente.item.nome : "Tudo liberado!"}</span>
                      {presente?.item.meta && (
                        <span className="destaque__estado">
                          {(() => {
                            const f = quantoFalta(presente.item, progresso);
                            const meta = presente.item.meta;
                            if (meta.tipo === "capitulos") return `Conclua o ${nomeCapitulo(`cap${meta.valor}` as never)}`;
                            if (meta.tipo === "dias") return `Faltam ${f} ${f === 1 ? "dia" : "dias"}`;
                            return `Faltam ${f} ${f === 1 ? "missão" : "missões"}`;
                          })()}
                        </span>
                      )}
                      <span className="sr-only">{presente ? `. ${presente.texto}. ` : ". "}Abrir personalização.</span>
                    </span>
                  </button>
                </div>
              );
            })()}

            {/* As próximas missões da semana, para marcar aqui mesmo. */}
            <section className="semana-home" aria-labelledby="semana-home-titulo">
              <div className="proxima__cabeca">
                <h2 id="semana-home-titulo" className="proxima__titulo">Semana {semanaAtual.numero} · {semanaAtual.tema}</h2>
                <span className="proxima__conta">{feitasSemanaAtual}/{semanaAtual.missoes.length}</span>
              </div>
              <span className="progresso progresso--cheio" aria-hidden="true">
                <span style={{ transform: `scaleX(${feitasSemanaAtual / semanaAtual.missoes.length})` }} />
              </span>
              {/* As 2 próximas missões da semana em blocos coloridos (como as respostas do Kahoot): tocar marca como feita. */}
              <ul className="missoes-grade">
                {semanaAtual.missoes.filter((x) => !plano.feitas[x.id]).slice(0, 2).map((mi, i) => {
                  const ok = false;
                  return (
                    <li key={mi.id} style={{ animationDelay: `${120 + i * 60}ms` }}>
                      <button className={`missao-bloco missao-bloco--${(semanaAtual.missoes.indexOf(mi) + i * 0) % 4} ${ok ? "is-ok" : ""}`} aria-pressed={ok} onClick={() => marcar(mi)}>
                        <span className="missao-bloco__topo">
                          <span className="missao-bloco__icone" aria-hidden="true"><Icone nome={ok ? "check" : mi.icone} tamanho={16} /></span>
                          <span className="missao-bloco__tempo">{ok ? "Feita" : mi.tempo}</span>
                        </span>
                        <span className="missao-bloco__texto">{mi.texto}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {feitasSemanaAtual === semanaAtual.missoes.length && (
                <p className="semana-home__fim">
                  {plano.semana < SEMANAS.length ? `Semana completa! A próxima chega no dia ${diaDeInicio(plano.semana + 1)}.` : "Você fez todas as missões do plano!"}
                </p>
              )}
            </section>

            <button className="kb kb--roxo deu-vontade" onClick={abrirCrise}>
              <span className="atalho__icone"><Icone nome="wind" /></span>
              <span className="atalho__texto">Deu vontade?<small>Respira comigo, a onda passa</small></span>
            </button>
          </>
        )}

        {aba === "missoes" && (() => {
          const s = SEMANAS[semanaVista - 1];
          const aberta = semanaVista <= plano.semana;
          const feitas = s.missoes.filter((x) => plano.feitas[x.id]).length;
          return (
            <section aria-labelledby="missoes-titulo" className="aba-missoes">
              <div className="semana">
                <button className="semana__seta" onClick={() => setSemanaVista((n) => Math.max(1, n - 1))}
                  disabled={semanaVista === 1} aria-label="Semana anterior">‹</button>
                <div className="semana__titulo">
                  <h2 id="missoes-titulo">Semana {s.numero} de {SEMANAS.length}</h2>
                  <p>{aberta ? s.tema : `Oculta · chega no dia ${diaDeInicio(s.numero)}`}</p>
                </div>
                <button className="semana__seta" onClick={() => setSemanaVista((n) => Math.min(SEMANAS.length, n + 1))}
                  disabled={semanaVista === SEMANAS.length} aria-label="Próxima semana">›</button>
              </div>
              {aberta && (
                <div className="secao">
                  <span className="progresso" role="progressbar" aria-label="Missões feitas na semana"
                    aria-valuemin={0} aria-valuemax={s.missoes.length} aria-valuenow={feitas}
                    aria-valuetext={`${feitas} de ${s.missoes.length} missões`}>
                    <span style={{ transform: `scaleX(${feitas / s.missoes.length})` }} />
                  </span>
                  <span className="secao__conta">{feitas}/{s.missoes.length}</span>
                </div>
              )}
              <ul className="missoes" key={semanaVista}>
                {s.missoes.map((mi) => {
                  if (!aberta) {
                    return (
                      <li key={mi.id}>
                        <div className="missao is-oculta">
                          <span className="missao__icone" aria-hidden="true">?</span>
                          <span className="missao__texto">Missão oculta</span>
                        </div>
                      </li>
                    );
                  }
                  const ok = Boolean(plano.feitas[mi.id]);
                  return (
                    <li key={mi.id}>
                      <button className={`missao ${ok ? "is-ok" : ""}`} onClick={() => marcar(mi)} aria-pressed={ok}>
                        <span className="missao__icone"><Icone nome={ok ? "check" : mi.icone} /></span>
                        <span className="missao__texto">{mi.texto}{mi.dica && <small>{mi.dica}</small>}</span>
                        <span className="missao__valor">{mi.tempo}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mini__nota">
                {aberta ? "Sem prazo: missão de semana passada continua valendo. Dia difícil não apaga nada." : "As missões começam simples e ficam mais interessantes a cada semana."}
              </p>
            </section>
          );
        })()}

        {aba === "jogos" && (
          <section className="aba-jogos" aria-label="Jogos">
            <div className="jogos-grade">
              {JOGOS.map((j) => {
                const livre = feitosCaps.includes(j.libera);
                if (j.tipo === "pronto" && livre) {
                  return (
                    <button key={j.id} className={`kb ${j.id === "pulo" ? "kb--azul" : "kb--verde"} jogo-cartao`}
                      onClick={() => { tocar("clique"); setJogo(j.id); }}>
                      <span className="atalho__icone"><Icone nome={j.icone} tamanho={26} /></span>
                      <span className="jogo__texto">{j.nome}<small>{j.descricao}</small></span>
                    </button>
                  );
                }
                return (
                  <div key={j.id} className="jogo-cartao jogo-cartao--oculto">
                    <span className="jogo-oculto__icone" aria-hidden="true">?</span>
                    <span className="jogo__texto">Jogo oculto
                      <small>{j.tipo === "pronto" ? `Libera ao concluir o ${nomeCapitulo(j.libera)}` : "Ainda não disponível"}</small>
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mini__nota">Os jogos chegam com a história. Partidas de até 3 minutos, sem moeda, sem vidas, sem perder.</p>
          </section>
        )}

        {aba === "ajustes" && (
          <section className="aba-ajustes" aria-label="Ajustes">
            {ajustesAcessibilidade}

            <h2 className="ajustes__grupo">Broto</h2>
            <div className="ajustes">
              <button className="ajuste ajuste--link" onClick={() => { tocar("clique"); abrirPersonalizar(); }}>
                <span className="ajuste__texto">Personalizar<small>Cores, roupas e acessórios do {nomeBroto}</small></span>
                <span aria-hidden="true" className="ajuste__seta">›</span>
              </button>
            </div>

            {conhecer && (
              <button className="link" onClick={() => { tocar("clique"); apagarConhecer(); setAviso(`O que você contou ao ${nomeBroto} foi apagado.`); }}>
                Apagar o que contei ao {nomeBroto}
              </button>
            )}
          </section>
        )}

        <nav className="tabbar" aria-label="Navegação principal">
          <BotaoAba aba="inicio" atual={aba} mudar={setAba} icone="house" rotulo="Início" />
          <BotaoAba aba="missoes" atual={aba} mudar={setAba} icone="listChecks" rotulo="Missões" />
          <button className={`tabbar__sos tabbar__historia ${capituloDeHoje().estado === "Disponível hoje" ? "is-novo" : ""}`}
            onClick={() => { tocar("clique"); setHistoria(true); }}>
            <span className="tabbar__sos-circulo"><span className="livro-pagina"><Icone nome="bookOpen" tamanho={24} /></span></span>
            <span>História</span>
          </button>
          <BotaoAba aba="jogos" atual={aba} mudar={setAba} icone="gamepad" rotulo="Jogos" />
          <BotaoAba aba="ajustes" atual={aba} mudar={setAba} icone="settings" rotulo="Ajustes" />
        </nav>

        <p className="sr-only" aria-live="polite">{aviso}</p>
      </main>
      <Confete disparo={confete} reduzir={reduzir} />
      {historia && <Historia aoFechar={() => setHistoria(false)} aoMenorDeIdade={() => { setHistoria(false); setMenorDeIdade(true); }} reduzir={reduzir} iniciar={historia === "cap1" ? "cap1" : undefined} />}
      {convite && (
        <ModalAcessibilidade aoTerminar={() => { setConvite(false); setHistoria("cap1"); }}>{ajustesAcessibilidade}</ModalAcessibilidade>
      )}
      {abrindo && <Abertura reduzir={reduzir} aoFim={() => {
        setAbrindo(false);
        // Primeiro acesso: o capítulo 1 apresenta o Broto e o app conhece a pessoa.
        if (!capitulosConcluidos().includes("cap1") && !lerGuardado(CHAVE_PRIMEIRO_ACESSO)) {
          gravarGuardado(CHAVE_PRIMEIRO_ACESSO, "1");
          setConvite(true);
        }
      }} />}
      {(jogo === "pulo" || jogo === "crise") && <PuloDoBichinho aoFechar={() => setJogo(false)} reduzir={reduzir}
        trilhaRetorno={aba === "jogos" ? "jogos" : "app"}
        chamada={jogo === "crise" ? "3 minutos pra onda passar. Ajude o bichinho a subir!" : undefined} />}
      {jogo === "carrinho" && createPortal(<RoleDeCarrinho aoFechar={() => setJogo(false)} reduzir={reduzir} />, document.body)}
      {crise && <Respiracao aoFechar={fecharCrise} reduzir={reduzir}
        aoJogar={() => { setCrise(false); setJogo("crise"); }} />}
    </div>
  );
}

function Decoracao() {
  return (
    <div className="decor" aria-hidden="true">
      <svg className="g g--seta rqr-anim-flutuar" viewBox="0 0 120 80"><path className="rqr-anim-pincelada" style={{ ["--rqr-traco" as string]: 260 }} d="M8 60 C30 10 70 10 74 40 C78 64 50 64 56 40 C62 20 96 18 112 30 M112 30 l-16 -4 M112 30 l-6 14" /></svg>
      <svg className="g g--anel rqr-anim-flutuar" viewBox="0 0 60 60"><circle cx="30" cy="30" r="20" /></svg>
      <svg className="g g--flor rqr-anim-flutuar" viewBox="0 0 60 60"><path d="M30 6v48M6 30h48M13 13l34 34M47 13L13 47" /></svg>
      <svg className="g g--arco rqr-anim-flutuar" viewBox="0 0 100 60"><path d="M8 10 C20 56 80 56 92 10" /></svg>
      <svg className="g g--tri rqr-anim-flutuar" viewBox="0 0 60 60"><path d="M30 8 L54 50 L6 50Z" /></svg>
    </div>
  );
}
