import { useCallback, useEffect, useState } from "react";
import { Bichinho, type Humor } from "./Bichinho";
import { Contador } from "./Contador";
import { Respiracao } from "./Respiracao";
import { Icone } from "./Icone";
import { Animacao } from "./Animacao";
import { Confete } from "./Confete";
import { PuloDoBichinho } from "./jogos/pulo/PuloDoBichinho";
import { Historia } from "./historia/Historia";
import { Abertura } from "./Abertura";
import { capitulosConcluidos } from "./historia/progresso";
import { apagarConhecer, useConhecer } from "./historia/conhecer";
import type { NomeIcone } from "./icones-data";
import { definirVolumeEfeitos, definirVolumeMusica, ouvirTrilhaInfo, precarregarTrilhas, tocar, tocarMissao, tocarTrilha, volumesIniciais } from "./sons";
import { nomeDoBroto, useAparenciaVisivel, usePerfil } from "./personalizacao";
import { abrirPersonalizar } from "./personalizacao/rota";
import { BotaoCarrinho } from "./carrinho/RoleDeCarrinho";
import { BotaoTema } from "./BotaoTema";
import { BotaoLibras } from "./BotaoLibras";

type Missao = { id: number; texto: string; icone: NomeIcone; valor: number };

// Dados sintéticos para a demonstração (edital 8.5).
const missoes: Missao[] = [
  { id: 1, texto: "Caminhar 15 minutos", icone: "sprout", valor: 20 },
  { id: 2, texto: "Mandar mensagem pra alguém de confiança", icone: "heartHandshake", valor: 30 },
  { id: 3, texto: "Anotar os gastos de hoje", icone: "piggyBank", valor: 50 },
  { id: 4, texto: "Jogar bola ou ir na praça", icone: "house", valor: 40 },
];

const humores: { id: Humor; rotulo: string }[] = [
  { id: "calmo", rotulo: "Calmo" },
  { id: "feliz", rotulo: "Feliz" },
  { id: "orgulhoso", rotulo: "Orgulhoso" },
  { id: "cansado", rotulo: "Dia difícil" },
];

const CHAVE_PRIMEIRO_ACESSO = "rqr:primeiro-acesso";

type Aba = "role" | "missoes" | "jogos" | "ajustes";
const TITULOS_ABA: Record<Aba, string> = { role: "Seu rolê de hoje", missoes: "Missões do dia", jogos: "Jogos", ajustes: "Ajustes" };

/** Régua de volume (0 a 10), no mesmo padrão da régua de vontade: setas, Home/End e os botões −/+
 * cobrem quem não consegue arrastar (2.5.7); `aria-valuetext` diz a porcentagem, não só o número (4.1.2). */
function ControleVolume({ id, rotulo, valor, aoMudar }: { id: string; rotulo: string; valor: number; aoMudar: (v: number) => void }) {
  const pct = valor * 10;
  return (
    <div className="controle-volume">
      <div className="controle-volume__topo">
        <label htmlFor={id}>{rotulo}</label>
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
  const [aba, setAba] = useState<Aba>("role");
  const [feitas, setFeitas] = useState<number[]>([]);
  const [humor, setHumor] = useState<Humor>("calmo");
  const [protegido, setProtegido] = useState(1240);
  const [crise, setCrise] = useState(false);
  // "crise": aberto pelo "Deu vontade", com convite de 3 minutos pra onda passar.
  const [jogo, setJogo] = useState<false | "inicio" | "crise">(false);
  // false = fechada; true = mapa; "cap1" = primeiro acesso, direto no capítulo 1.
  const [historia, setHistoria] = useState<boolean | "cap1">(false);
  const [abrindo, setAbrindo] = useState(true);
  const conhecer = useConhecer();
  const { perfil } = usePerfil();
  const [moedaKey, setMoedaKey] = useState(0);
  const [confete, setConfete] = useState(0);
  const [reduzir, setReduzir] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
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

  useEffect(() => { document.title = `${TITULOS_ABA[aba]} · Guardião`; }, [aba]);

  // Trilha leve, alegre e energética pra todo o app (não só a história) — abaixa, não para,
  // em telas de crise e na respiração (ver abaixarTrilha em AjudaAgora.tsx e Respiracao.tsx).
  useEffect(() => {
    tocarTrilha("/sons/trilha-alegre.opus", { titulo: "Rolê de Hoje", artista: "Tema do app" });
    // Baixa as outras trilhas (jogos, cantiga) em segundo plano, sem tocar — assim, quando a
    // pessoa realmente entrar num mini jogo ou numa cena, a troca é instantânea, sem flicar.
    precarregarTrilhas();
  }, []);

  // HUD "tocando agora" (Forza Horizon / Cozy Plants): some sozinho depois de uns segundos.
  const [hudMusica, setHudMusica] = useState<{ titulo: string; artista: string } | null>(null);
  useEffect(() => {
    const tempo = { current: 0 };
    const parar = ouvirTrilhaInfo((info) => {
      setHudMusica(info);
      window.clearTimeout(tempo.current);
      tempo.current = window.setTimeout(() => setHudMusica(null), 4500);
    });
    return () => { window.clearTimeout(tempo.current); parar(); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reduzir-animacoes", reduzir);
  }, [reduzir]);

  const concluir = useCallback((m: Missao) => {
    if (feitas.includes(m.id)) return;
    setFeitas((f) => [...f, m.id]);
    setProtegido((v) => v + m.valor);
    setMoedaKey((k) => k + 1);
    setConfete((c) => c + 1);
    setHumor("feliz");
    tocarMissao(feitas.length + 1, missoes.length);
    window.setTimeout(() => tocar("moeda"), 250);
    window.setTimeout(() => tocar("folha"), 650);
    if (feitas.length + 1 === missoes.length) {
      // Todas concluídas: conquista do dia, depois da moeda e da folha.
      window.setTimeout(() => tocar("conquista"), 1300);
    }
    setAviso(feitas.length + 1 === missoes.length
      ? `Todas as missões de hoje concluídas!`
      : `Missão concluída: ${m.texto}.`);
    window.setTimeout(() => setHumor((h) => (h === "feliz" ? "calmo" : h)), 2600);
  }, [feitas]);

  const reiniciar = () => { setFeitas([]); setHumor("calmo"); setProtegido(1240); };

  const nivel = feitas.length;
  const proxima = missoes.find((m) => !feitas.includes(m.id));

  return (
    <div className="palco">
      <Decoracao />
      <main className="celular" aria-label="Prova visual do app">
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

        {aba === "role" && (
          <>
            <section className="cena" aria-label="Seu bichinho">
              <Bichinho humor={humor} nivel={nivel} reduzir={reduzir} aparencia={aparencia} tamanho={170} />
              {moedaKey > 0 && humor === "feliz" && (
                <div className="cena__brilho" key={moedaKey}>
                  <Animacao nome="brilho" tamanho={120} repetir={false} reduzir={reduzir} />
                </div>
              )}
            </section>

            <section className="cards" aria-label="Seu progresso">
              <article className="rqr-card mini mini--linha">
                <span className="mini__icone mini__icone--lottie" style={{ background: "var(--rqr-verde-claro)" }}>
                  <Animacao nome="broto" tamanho={34} reduzir={reduzir} />
                </span>
                <div>
                  <p className="mini__rotulo">Dias de cuidado</p>
                  <p className="mini__valor">12 dias</p>
                </div>
              </article>
              <article className="rqr-card mini mini--linha">
                <span className="mini__icone mini__icone--moeda" key={moedaKey}>
                  <span className={moedaKey ? "moeda rqr-anim-moeda" : "moeda"} aria-hidden="true">R$</span>
                </span>
                <div>
                  <p className="mini__rotulo">Protegido</p>
                  <p className="mini__valor"><Contador valor={protegido} reduzir={reduzir} /></p>
                </div>
              </article>
            </section>

            <section className="proxima" aria-labelledby="proxima-titulo">
              <div className="proxima__cabeca">
                <h2 id="proxima-titulo" className="proxima__titulo">{proxima ? "Próxima missão" : "Missões de hoje"}</h2>
                <span className="progresso progresso--cheio" aria-hidden="true">
                  <span style={{ transform: `scaleX(${nivel / missoes.length})` }} />
                </span>
                <span className="proxima__conta">{nivel}/{missoes.length}</span>
              </div>
              {proxima ? (
                <div className="proxima__corpo" key={proxima.id}>
                  <span className="proxima__icone"><Icone nome={proxima.icone} /></span>
                  <p className="proxima__texto">{proxima.texto}<small>+ R$ {proxima.valor} protegidos</small></p>
                  <button className="kb kb--verde proxima__botao" onClick={() => concluir(proxima)}>
                    <Icone nome="check" tamanho={20} /> Feito!
                  </button>
                </div>
              ) : (
                <p className="proxima__fim">Tudo feito hoje. Boa!</p>
              )}
            </section>

            <nav className="atalhos rqr-escalonado" aria-label="Atalhos">
              <button className="kb kb--azul atalho" onClick={() => { tocar("clique"); setAba("missoes"); }}>
                <span className="atalho__icone"><Icone nome="listChecks" /></span>
                <span className="atalho__texto">Missões<small>{nivel} de {missoes.length} feitas</small></span>
              </button>
              <button className="kb kb--roxo atalho" onClick={() => { tocar("clique"); setCrise(true); }}>
                <span className="atalho__icone"><Icone nome="wind" /></span>
                <span className="atalho__texto">Deu vontade<small>respirar comigo</small></span>
              </button>
              <button className="kb kb--rosa atalho" onClick={() => { tocar("clique"); setAba("jogos"); }}>
                <span className="atalho__icone"><Icone nome="gamepad" /></span>
                <span className="atalho__texto">Jogos<small>até 3 minutos</small></span>
              </button>
              <button className="kb kb--amarelo atalho" onClick={() => { tocar("clique"); abrirPersonalizar(); }}>
                <span className="atalho__icone"><Icone nome="palette" /></span>
                <span className="atalho__texto">Personalizar<small>seu bichinho</small></span>
              </button>
            </nav>

          </>
        )}

        {aba === "missoes" && (
          <section aria-labelledby="missoes-titulo" className="aba-missoes">
            <div className="secao">
              <h2 id="missoes-titulo" className="sr-only">Missões do dia</h2>
              <span className="progresso" aria-label={`${nivel} de ${missoes.length} missões`}>
                <span style={{ transform: `scaleX(${nivel / missoes.length})` }} />
              </span>
              <span className="secao__conta">{nivel}/{missoes.length}</span>
            </div>
            <ul className="missoes rqr-escalonado">
              {missoes.map((m) => {
                const ok = feitas.includes(m.id);
                return (
                  <li key={m.id}>
                    <button className={`missao ${ok ? "is-ok" : ""}`} onClick={() => concluir(m)} aria-pressed={ok}>
                      <span className="missao__icone"><Icone nome={ok ? "check" : m.icone} /></span>
                      <span className="missao__texto">{m.texto}</span>
                      <span className="missao__valor">+ R$ {m.valor}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mini__nota">Cada missão conta. Dia difícil não zera nada.</p>
            {nivel > 0 && <button className="link" onClick={() => { tocar("clique"); reiniciar(); }}>Reiniciar demonstração</button>}
          </section>
        )}

        {aba === "jogos" && (
          <section className="aba-jogos" aria-label="Jogos">
            <div className="jogos rqr-escalonado">
              <button className="kb kb--roxo jogo" onClick={() => { tocar("clique"); setHistoria(true); }}>
                <span className="atalho__icone"><Icone nome="bookOpen" tamanho={28} /></span>
                <span className="jogo__texto">História do {nomeDoBroto(perfil)}<small>Capítulo por capítulo</small></span>
              </button>
              <button className="kb kb--azul jogo" onClick={() => { tocar("clique"); setJogo("inicio"); }}>
                <span className="atalho__icone"><Icone nome="sprout" tamanho={28} /></span>
                <span className="jogo__texto">Pulo do Bichinho<small>Pule cada vez mais alto</small></span>
              </button>
              <BotaoCarrinho reduzir={reduzir} />
            </div>
            <p className="mini__nota">Partidas de até 3 minutos. Sem moeda, sem vidas, sem perder.</p>
          </section>
        )}

        {aba === "ajustes" && (
          <section className="aba-ajustes" aria-label="Ajustes">
            <h2 className="ajustes__grupo">Aparência e conforto</h2>
            <div className="ajustes">
              <label className="ajuste">
                <span className="ajuste__texto">Reduzir animações<small>Menos movimento na tela</small></span>
                <input type="checkbox" checked={reduzir} onChange={(e) => setReduzir(e.target.checked)} />
                <span className="interruptor__trilho" aria-hidden="true" />
              </label>
              <div className="ajuste">
                <span className="ajuste__texto">Tema<small>Claro, escuro ou automático</small></span>
                <BotaoTema compacto />
              </div>
              <button className="ajuste ajuste--link" onClick={() => { tocar("clique"); abrirPersonalizar(); }}>
                <span className="ajuste__texto">Personalizar<small>Nome, foto e visual do bichinho</small></span>
                <span aria-hidden="true" className="ajuste__seta">›</span>
              </button>
            </div>

            <h2 className="ajustes__grupo">Som</h2>
            <div className="controles-volume">
              <ControleVolume id="volume-efeitos" rotulo="Efeitos" valor={volumes.efeitos} aoMudar={definirEfeitos} />
              <ControleVolume id="volume-musica" rotulo="Música" valor={volumes.musica} aoMudar={definirMusica} />
            </div>

            <h2 className="ajustes__grupo">Humor do bichinho (demonstração)</h2>
            <div className="humores" role="group" aria-label="Ver humores do bichinho (demonstração)">
              {humores.map((h) => (
                <button key={h.id} className={`chip ${humor === h.id ? "is-on" : ""}`}
                  aria-pressed={humor === h.id} onClick={() => { tocar("clique"); setHumor(h.id); }}>{h.rotulo}</button>
              ))}
            </div>

            {conhecer && (
              <button className="link" onClick={() => { tocar("clique"); apagarConhecer(); setAviso("O que você contou ao Broto foi apagado."); }}>
                Apagar o que contei ao Broto
              </button>
            )}
          </section>
        )}

        <nav className="tabbar" aria-label="Navegação principal">
          <BotaoAba aba="role" atual={aba} mudar={setAba} icone="house" rotulo="Rolê" />
          <BotaoAba aba="missoes" atual={aba} mudar={setAba} icone="listChecks" rotulo="Missões" />
          <button className="tabbar__sos tabbar__historia" onClick={() => { tocar("clique"); setHistoria(true); }}>
            <span className="tabbar__sos-circulo"><Icone nome="bookOpen" tamanho={24} /></span>
            <span>História</span>
          </button>
          <BotaoAba aba="jogos" atual={aba} mudar={setAba} icone="gamepad" rotulo="Jogos" />
          <BotaoAba aba="ajustes" atual={aba} mudar={setAba} icone="settings" rotulo="Ajustes" />
        </nav>

        <p className="sr-only" aria-live="polite">{aviso}</p>
      </main>
      <Confete disparo={confete} reduzir={reduzir} />
      {hudMusica && (
        <div className="hud-musica" role="status" aria-live="polite">
          <Icone nome="music" tamanho={18} />
          <div className="hud-musica__texto">
            <span className="hud-musica__titulo">{hudMusica.titulo}</span>
            <span className="hud-musica__artista">{hudMusica.artista}</span>
          </div>
        </div>
      )}
      {historia && <Historia aoFechar={() => setHistoria(false)} reduzir={reduzir} iniciar={historia === "cap1" ? "cap1" : undefined} />}
      {abrindo && <Abertura reduzir={reduzir} aoFim={() => {
        setAbrindo(false);
        // Primeiro acesso: o capítulo 1 apresenta o Broto e o app conhece a pessoa.
        if (!capitulosConcluidos().includes("cap1") && !localStorage.getItem(CHAVE_PRIMEIRO_ACESSO)) {
          try { localStorage.setItem(CHAVE_PRIMEIRO_ACESSO, "1"); } catch { /* modo privado */ }
          setHistoria("cap1");
        }
      }} />}
      {jogo && <PuloDoBichinho aoFechar={() => setJogo(false)} reduzir={reduzir}
        chamada={jogo === "crise" ? "3 minutos pra onda passar. Ajude o bichinho a subir!" : undefined} />}
      {crise && <Respiracao aoFechar={() => setCrise(false)} reduzir={reduzir}
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
