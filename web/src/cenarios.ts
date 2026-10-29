/**
 * Fundos ilustrados em duas etapas, para a primeira visita não ficar com tela vazia:
 * 1. O CSS começa com as versões paradas (40 a 120 KB cada, guardadas na instalação do app).
 * 2. Depois que a página carregou, as versões animadas (2 a 5,5 MB cada) baixam uma por vez,
 *    em segundo plano. Só quando todas estão prontas a classe `cenas-animadas` troca os fundos.
 * Com "Reduzir animações", economia de dados ou rede lenta, fica nas paradas.
 */
const ANIMADAS = [
  "/cenarios/fundo-cap1-anim.webp",
  "/cenarios/cap1-nave-pousada-anim.webp",
  "/cenarios/cap4-banco-noite-anim.webp",
];

type Conexao = { saveData?: boolean; effectiveType?: string };

function redeFraca() {
  const c = (navigator as Navigator & { connection?: Conexao }).connection;
  return Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? "");
}

function baixar(url: string) {
  return new Promise<void>((ok, falha) => {
    const img = new Image();
    img.onload = () => ok();
    img.onerror = () => falha(new Error(url));
    img.src = url;
  });
}

let iniciado = false;
export function carregarCenasAnimadas() {
  if (iniciado || typeof window === "undefined") return;
  iniciado = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || redeFraca()) return;
  const comecar = async () => {
    try {
      for (const url of ANIMADAS) await baixar(url); // uma por vez: não disputa banda com o resto
      document.documentElement.classList.add("cenas-animadas");
    } catch { /* sem internet: fica com as paradas */ }
  };
  const quandoOcioso = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void comecar(), { timeout: 3000 });
    else setTimeout(() => void comecar(), 1500);
  };
  if (document.readyState === "complete") quandoOcioso();
  else window.addEventListener("load", quandoOcioso, { once: true });
}
