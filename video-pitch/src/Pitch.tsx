import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { icones, type NomeIcone } from "./icones-data";
import { Bloco, Broto, C, Celular, Cenario, Chip, Dividida, Fonte, Papel, Selo, TEXTO, TITULO, Texto, Titulo, useEntrada } from "./ui";

/**
 * Vídeo de pitch do "Meu amigo Broto!" (sem áudio: toda a mensagem está na tela).
 * Telas do app são gravações reais (captura/capturar.mjs) com dados sintéticos.
 * Dados citados: só os marcados como ✅ em docs/07-conformidade/fontes-e-referencias.md.
 */

const Ic = ({ nome, tamanho = 32 }: { nome: NomeIcone; tamanho?: number }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" style={{ strokeWidth: 2.4 }} dangerouslySetInnerHTML={{ __html: icones[nome] }} />
);

// ---------------------------------------------------------------- 1. Gancho
function Gancho() {
  const f = useCurrentFrame();
  const relogio = interpolate(f, [0, 150], [0, 1]);
  const minuto = 47 + Math.floor(relogio * 2);
  return (
    <AbsoluteFill>
      <Cenario arquivo="cap4-banco-noite.webp" escurecer={0.72} desfoque={4} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40, padding: 140 }}>
        <Texto tamanho={44} cor={C.sol} style={{ font: `600 54px ${TITULO}`, letterSpacing: 4 }}>23:{minuto}</Texto>
        <Titulo centro tamanho={92} cor={C.cartao} atraso={10} marca={C.roxo} destaque={["não", "avisa"]} texto={"A vontade de apostar\nnão avisa a hora."} />
        <Texto tamanho={44} cor={C.lavanda} atraso={60} style={{ textAlign: "center" }}>E costuma chegar quando a gente tá mais sozinho.</Texto>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- 2. O problema
function Numero({ valor, sufixo, rotulo, fonte, cor, atraso }: { valor: number; sufixo: string; rotulo: string; fonte: string; cor: string; atraso: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f - atraso, fps, config: { damping: 14 } });
  const n = Math.round(interpolate(f - atraso, [0, 40], [0, valor], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) }));
  return (
    <div style={{
      flex: 1, padding: "44px 40px", borderRadius: 34, background: cor, border: `5px solid ${C.tinta}`, boxShadow: `0 10px 0 ${C.tinta}`,
      display: "flex", flexDirection: "column", gap: 18, opacity: e, transform: `translateY(${(1 - e) * 120}px) rotate(${(1 - e) * 4}deg)`,
    }}>
      <span style={{ font: `700 170px/1 ${TITULO}`, color: C.tinta }}>{n}{sufixo}</span>
      <span style={{ font: `800 44px/1.25 ${TEXTO}`, color: C.tinta }}>{rotulo}</span>
      <span style={{ font: `600 24px/1.3 ${TEXTO}`, color: C.tinta, opacity: 0.75, marginTop: "auto" }}>{fonte}</span>
    </div>
  );
}

function Problema() {
  return (
    <Papel>
      <AbsoluteFill style={{ padding: "100px 120px", gap: 60 }}>
        <Titulo tamanho={76} destaque={["saúde"]} texto={"Não é falta de força de vontade.\nÉ uma questão de saúde."} />
        <div style={{ display: "flex", gap: 44, flex: 1, alignItems: "stretch", paddingBottom: 20 }}>
          <Numero atraso={30} valor={29} sufixo="%" cor={C.sol} rotulo="dos brasileiros têm o costume de apostar pela internet" fonte="Genial/Quaest, abr/2026 (2.004 entrevistas)" />
          <Numero atraso={50} valor={574} sufixo=" mil" cor={C.rosa} rotulo="pessoas pediram para ser bloqueadas nas casas de aposta" fonte="Ministério da Fazenda (SPA), dez/2025 a mai/2026" />
          <Numero atraso={70} valor={41} sufixo="%" cor={C.lavanda} rotulo="delas por perda de controle e impacto na saúde mental" fonte="Ministério da Fazenda (SPA), via Extra, mai/2026" />
        </div>
      </AbsoluteFill>
    </Papel>
  );
}

// ---------------------------------------------------------------- 3. Revelação
function Revelacao() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const onda = spring({ frame: f, fps, config: { damping: 20, mass: 1.2 } });
  return (
    <Papel cor={C.funda}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", width: 2600, height: 2600, borderRadius: "50%", background: C.sol, transform: `scale(${onda})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 24 }}>
        <Broto tamanho={380} atraso={8} />
        <Titulo centro tamanho={120} atraso={22} texto="Meu amigo Broto!" />
        <Texto tamanho={46} atraso={45} style={{ textAlign: "center" }}>Um passo de cada vez, com alguém do seu lado.</Texto>
      </AbsoluteFill>
    </Papel>
  );
}

// ---------------------------------------------------------------- 4. A história
function Historia() {
  return (
    <Papel>
      <Dividida celulares={<>
        <Celular video="historia" de={6} altura={760} girar={-6} atraso={14} style={{ marginRight: -150, marginTop: 120 }} />
        <Celular video="abertura" de={12.5} altura={860} girar={3} />
      </>}>
        <Selo cor={C.lavanda}>Uma história, não um sermão</Selo>
        <Titulo tamanho={68} atraso={8} destaque={["junto"]} texto={"Um alien caiu do céu.\nE se recupera junto\ncom você."} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
          <Bloco atraso={45} cor={C.cartao} icone={<Ic nome="bookOpen" />}>Capítulos seguem os estágios da mudança</Bloco>
          <Bloco atraso={60} cor={C.cartao} icone={<Ic nome="heartHandshake" />}>Conversas no jeito da Entrevista Motivacional</Bloco>
          <Bloco atraso={75} cor={C.cartao} icone={<Ic nome="sprout" />}>A aposta aparece na família dele: dá pra olhar sem vergonha</Bloco>
        </div>
      </Dividida>
    </Papel>
  );
}

// ---------------------------------------------------------------- 5. Deu vontade
function DeuVontade() {
  return (
    <Papel cor={C.lavanda}>
      <Dividida celulares={<Celular video="respiracao" de={4.7} altura={880} />}>
        <Selo cor={C.cartao}>Pilar 1 · Na hora da vontade</Selo>
        <Titulo tamanho={80} atraso={8} marca={C.cartao} destaque={["onda"]} texto={"Deu vontade?\nA onda passa."} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
          <Bloco atraso={40} cor={C.cartao} icone={<Ic nome="wind" />}>Respiração guiada 4-4-6 com o Broto, num toque</Bloco>
          <Bloco atraso={55} cor={C.cartao} icone={<Ic nome="moon" />}>Sem som por padrão: discreto em qualquer lugar</Bloco>
          <Bloco atraso={70} cor={C.cartao} icone={<Ic nome="gamepad" />}>No fim, um joguinho de 3 minutos pra onda passar</Bloco>
        </div>
      </Dividida>
    </Papel>
  );
}

// ---------------------------------------------------------------- 6. O jogo contra a fissura
function Jogo() {
  return (
    <Papel cor={C.ceu}>
      <Dividida inverter celulares={<Celular video="pulo" de={10} velocidade={1.15} altura={880} />}>
        <Selo cor={C.cartao}>Mini jogos da história</Selo>
        <Titulo tamanho={72} atraso={8} marca={C.cartao} destaque={["tela", "tarefa"]} texto={"Ocupar a cabeça com\numa tarefa visual,\nnão com a aposta."} />
        <Texto tamanho={32} atraso={40}>Inspirado em evidências: 3 minutos de jogo visual reduziram a força da vontade em estudo com universitários (Skorka-Brown et al., 2015).</Texto>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 10 }}>
          <Chip atraso={60} cor={C.sol}>sem moeda</Chip>
          <Chip atraso={66} cor={C.rosa}>sem vidas</Chip>
          <Chip atraso={72} cor={C.menta}>sem sorteio</Chip>
          <Chip atraso={78} cor={C.lavanda}>sem derrota</Chip>
        </div>
      </Dividida>
    </Papel>
  );
}

// ---------------------------------------------------------------- 7. Ajuda especializada
function Ajuda() {
  return (
    <Papel cor={C.funda}>
      <Dividida celulares={<>
        <Celular foto="respiracao-fim.png" altura={760} girar={-5} atraso={12} style={{ marginRight: -140, marginTop: 120 }} />
        <Celular foto="ajuda.png" altura={860} girar={3} />
      </>}>
        <Selo cor={C.rosa}>Pilar 4 · Ajuda especializada</Selo>
        <Titulo tamanho={80} cor={C.cartao} atraso={8} marca={C.roxo} destaque={["toque"]} texto={"Ajuda de verdade\na um toque."} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 10 }}>
          <Chip atraso={40} cor={C.rosa} tamanho={34}>CVV 188, 24 h</Chip>
          <Chip atraso={47} cor={C.sol} tamanho={34}>SAMU 192</Chip>
          <Chip atraso={54} cor={C.menta} tamanho={34}>UBS e CAPS</Chip>
          <Chip atraso={61} cor={C.ceu} tamanho={34}>Autoexclusão gov.br</Chip>
        </div>
        <Texto tamanho={34} cor={C.lavanda} atraso={75}>Com o app instalado, a ajuda e o "Deu vontade" abrem até sem internet.</Texto>
      </Dividida>
    </Papel>
  );
}

// ---------------------------------------------------------------- 8. Plano de 90 dias
function Plano() {
  return (
    <Papel cor={C.salvia}>
      <Dividida inverter celulares={<>
        <Celular video="missoes" de={5} altura={760} girar={-5} atraso={14} style={{ marginRight: -140, marginTop: 120 }} />
        <Celular video="inicio" de={2.6} velocidade={0.95} altura={860} girar={3} />
      </>}>
        <Selo cor={C.cartao}>Pilares 2 e 3 · Grana e gente por perto</Selo>
        <Titulo tamanho={70} atraso={8} marca={C.sol} destaque={["90", "dias"]} texto={"Um plano de 90 dias,\numa missão de cada vez."} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 6 }}>
          <Bloco atraso={40} cor={C.sol} icone={<Ic nome="piggyBank" />} tamanho={31}>52 missões: de beber um copo d'água a negociar uma dívida</Bloco>
          <Bloco atraso={55} cor={C.rosa} icone={<Ic nome="phone" />} tamanho={31}>Ligar pra alguém, chamar pra um café: a rede de apoio vira missão</Bloco>
          <Bloco atraso={70} cor={C.cartao} icone={<Ic nome="sun" />} tamanho={31}>Sem prazo que expira. Dia difícil não apaga nada.</Bloco>
        </div>
      </Dividida>
    </Papel>
  );
}

// ---------------------------------------------------------------- 9. Gamificação ética
function Etica() {
  return (
    <Papel cor={C.sol}>
      <Dividida celulares={<Celular video="personalizar" de={6.2} altura={880} />}>
        <Selo cor={C.cartao}>Gamificação ética</Selo>
        <Titulo tamanho={68} atraso={8} marca={C.cartao} destaque={["cuidado"]} texto={"Recompensa é cuidado,\nnão sorte."} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
          <Bloco atraso={40} icone={<Ic nome="palette" />}>Roupas e acessórios do Broto chegam com dias e missões</Bloco>
          <Bloco atraso={55} icone={<Ic nome="shieldCheck" />}>Nada de moeda, loja, sorteio ou ranking</Bloco>
          <Bloco atraso={70} icone={<Ic nome="heartHandshake" />}>O Broto nunca adoece, nunca cobra, nunca culpa</Bloco>
        </div>
      </Dividida>
    </Papel>
  );
}

// ---------------------------------------------------------------- 10. Acessibilidade
function Acessibilidade() {
  const itens: [NomeIcone, string, string][] = [
    ["libras", "Tradução em Libras (VLibras)", C.sol], ["moon", "Tema escuro", C.lavanda], ["wind", "Reduzir animações", C.menta],
    ["bookOpen", "Rótulos para leitor de tela", C.ceu], ["heartHandshake", "Linguagem simples", C.rosa], ["shieldCheck", "Feito com base na WCAG 2.2", C.salvia],
  ];
  return (
    <Papel>
      <Dividida inverter celulares={<>
        <Celular foto="libras.png" altura={760} girar={-5} atraso={12} style={{ marginRight: -140, marginTop: 120 }} />
        <Celular video="escuro" de={4.6} altura={860} girar={3} />
      </>}>
        <Selo cor={C.ceu}>Acessibilidade</Selo>
        <Titulo tamanho={70} atraso={8} destaque={["todo", "mundo"]} texto={"Feito pra todo mundo\nconseguir usar."} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 10 }}>
          {itens.map(([ic, t, cor], i) => <Bloco key={t} atraso={36 + i * 9} cor={cor} icone={<Ic nome={ic} />} tamanho={28}>{t}</Bloco>)}
        </div>
      </Dividida>
    </Papel>
  );
}

// ---------------------------------------------------------------- 11. Privacidade e viabilidade
function Cartao({ icone, titulo, texto, cor, atraso }: { icone: NomeIcone; titulo: string; texto: string; cor: string; atraso: number }) {
  const e = useEntrada(atraso, { damping: 12, mass: 0.8 });
  return (
    <div style={{
      padding: "40px 38px", borderRadius: 32, background: cor, border: `5px solid ${C.tinta}`, boxShadow: `0 10px 0 ${C.tinta}`,
      display: "flex", flexDirection: "column", gap: 16, opacity: e, transform: `translateY(${(1 - e) * 100}px) scale(${0.85 + e * 0.15})`,
    }}>
      <span style={{ display: "grid", placeItems: "center", width: 100, height: 100, borderRadius: 999, background: C.cartao, border: `4px solid ${C.tinta}`, color: C.tinta }}><Ic nome={icone} tamanho={52} /></span>
      <span style={{ font: `700 58px/1.08 ${TITULO}`, color: C.tinta }}>{titulo}</span>
      <span style={{ font: `700 34px/1.35 ${TEXTO}`, color: C.tinta }}>{texto}</span>
    </div>
  );
}

function Viabilidade() {
  return (
    <Papel>
      <AbsoluteFill style={{ padding: "90px 120px", gap: 50 }}>
        <Selo cor={C.menta}>Privacidade e alcance</Selo>
        <Titulo tamanho={76} atraso={6} destaque={["quem", "mais", "precisa"]} texto="Pronto pra chegar em quem mais precisa." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 34, flex: 1, paddingBottom: 30 }}>
          <Cartao atraso={30} cor={C.sol} icone="shieldCheck" titulo="Sem login" texto="Sem conta, sem CPF, sem cadastro. Nome e foto são opcionais." />
          <Cartao atraso={42} cor={C.lavanda} icone="house" titulo="Fica no celular" texto="Nada é enviado. A pessoa apaga tudo quando quiser (LGPD)." />
          <Cartao atraso={54} cor={C.menta} icone="sprout" titulo="Leve e instalável" texto="App web (PWA): sem loja, roda em celular simples e abre offline." />
          <Cartao atraso={66} cor={C.rosa} icone="phone" titulo="77,5% Android" texto="dos apostadores usam Android, metade com sistema anterior a 2023 (Legitimuz, dados do setor)." />
        </div>
      </AbsoluteFill>
    </Papel>
  );
}

// ---------------------------------------------------------------- 12. Impacto
function Impacto() {
  const itens: [NomeIcone, string][] = [
    ["wind", "Ondas de vontade atravessadas no \"Deu vontade\""],
    ["listChecks", "Missões feitas por semana nos 90 dias"],
    ["phone", "Toques em CVV, CAPS e autoexclusão"],
    ["sprout", "Quem volta em 30 e em 90 dias"],
  ];
  return (
    <Papel cor={C.funda}>
      <Cenario arquivo="cap6-casas-chuvoso.webp" escurecer={0.82} />
      <AbsoluteFill style={{ padding: "100px 140px", gap: 46 }}>
        <Selo cor={C.sol}>Como medir o impacto</Selo>
        <Titulo tamanho={80} cor={C.cartao} atraso={6} marca={C.roxo} destaque={["autonomia"]} texto={"A meta é autonomia,\nnão tempo de tela."} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
          {itens.map(([ic, t], i) => <Bloco key={t} atraso={34 + i * 10} cor={[C.sol, C.lavanda, C.rosa, C.menta][i]} icone={<Ic nome={ic} />} tamanho={38}>{t}</Bloco>)}
        </div>
        <Texto tamanho={36} cor={C.lavanda} atraso={80}>Sempre agregado e anônimo, com consentimento. Nenhum dado sensível sai do aparelho.</Texto>
      </AbsoluteFill>
    </Papel>
  );
}

// ---------------------------------------------------------------- 13. Fechamento
function Final() {
  const f = useCurrentFrame();
  const aviso = interpolate(f, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Cenario arquivo="cap1-nave-pousada.webp" escurecer={0.25} cor={C.sol} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 18 }}>
        <div style={{ padding: "50px 90px 56px", borderRadius: 48, background: C.cartao, border: `6px solid ${C.tinta}`, boxShadow: `0 14px 0 ${C.tinta}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Broto tamanho={250} />
          <Titulo centro tamanho={104} atraso={10} texto="Meu amigo Broto!" />
          <Titulo centro tamanho={50} atraso={26} destaque={["alguém"]} texto="Um passo de cada vez, com alguém do seu lado." />
          <Texto tamanho={32} atraso={50} style={{ marginTop: 10, font: `700 34px ${TITULO}` }}>Equipe Peão</Texto>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", opacity: aviso, font: `700 24px ${TEXTO}`, color: C.tinta }}>
        <span style={{ background: C.cartao, padding: "10px 24px", borderRadius: 999, border: `3px solid ${C.tinta}` }}>
          Apoio complementar, não substitui atendimento profissional. Precisa conversar agora? CVV 188, 24 h, gratuito.
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- Montagem
const T = 16; // quadros de transição
const CENAS: [() => JSX.Element, number][] = [
  [Gancho, 150], [Problema, 300], [Revelacao, 150], [Historia, 330], [DeuVontade, 320], [Jogo, 300],
  [Ajuda, 270], [Plano, 340], [Etica, 280], [Acessibilidade, 290], [Viabilidade, 300], [Impacto, 270], [Final, 240],
];
const TRANSICOES = [
  fade(), wipe({ direction: "from-left" }), slide({ direction: "from-right" }), slide({ direction: "from-bottom" }), wipe({ direction: "from-right" }),
  slide({ direction: "from-left" }), slide({ direction: "from-right" }), wipe({ direction: "from-top-left" }), slide({ direction: "from-bottom" }),
  slide({ direction: "from-right" }), fade(), fade(),
];

export const DURACAO_TOTAL = CENAS.reduce((t, [, d]) => t + d, 0) - T * (CENAS.length - 1);

/** Barra fina de progresso no pé da tela, nas cores do app. */
function Progresso() {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURACAO_TOTAL) * 100}%`, background: C.tinta, opacity: 0.35 }} />;
}

export function Pitch() {
  return (
    <AbsoluteFill style={{ background: C.funda }}>
      <TransitionSeries>
        {CENAS.flatMap(([Cena, d], i) => {
          const itens = [<TransitionSeries.Sequence key={`c${i}`} durationInFrames={d}><Cena /></TransitionSeries.Sequence>];
          if (i < CENAS.length - 1) itens.push(<TransitionSeries.Transition key={`t${i}`} presentation={TRANSICOES[i] as never} timing={linearTiming({ durationInFrames: T })} />);
          return itens;
        })}
      </TransitionSeries>
      <Progresso />
    </AbsoluteFill>
  );
}
