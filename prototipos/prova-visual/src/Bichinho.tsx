import { useEffect, useRef } from "react";

export type Humor = "calmo" | "feliz" | "cansado" | "orgulhoso" | "apoio";

const descricao: Record<Humor, string> = {
  calmo: "Bichinho calmo, respirando devagar",
  feliz: "Bichinho feliz, pulando de alegria",
  cansado: "Bichinho cansado, mas tranquilo. Ele se recupera com cuidado",
  orgulhoso: "Bichinho orgulhoso, com os olhos fechados de alegria",
  apoio: "Bichinho de braços abertos, respirando junto com você",
};

type Props = { humor: Humor; nivel: number; tamanho?: number; reduzir?: boolean };

/** Deslocamento máximo das pupilas, em unidades do viewBox (olho tem rx 8). */
const MAX_OLHAR = 5;

/**
 * Mascote original em SVG com camadas animáveis por CSS.
 * Regra: ele nunca morre nem culpa. No humor "cansado" só fica encolhido e com cor mais fria.
 */
export function Bichinho({ humor, nivel, tamanho = 220, reduzir = false }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilasRef = useRef<SVGGElement>(null);

  // Olhos acompanham o mouse (ou o dedo). Atualiza direto no DOM, sem re-render, uma vez por quadro.
  useEffect(() => {
    const g = pupilasRef.current;
    if (!g) return;
    if (reduzir) { g.style.transform = ""; return; }
    let quadro = 0;
    const mover = (e: PointerEvent) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const r = svg.getBoundingClientRect();
        // Centro entre os olhos: (100, 108) no viewBox de 200.
        const cx = r.left + r.width * 0.5;
        const cy = r.top + r.height * 0.54;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        // Perto do bichinho o olhar se move pouco; longe, chega ao máximo.
        const forca = Math.min(1, dist / (r.width * 1.2)) * MAX_OLHAR;
        g.style.transform = `translate(${(dx / dist) * forca}px, ${(dy / dist) * forca * 0.8}px)`;
      });
    };
    const centralizar = () => { g.style.transform = ""; };
    window.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerleave", centralizar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerleave", centralizar);
    };
  }, [reduzir]);

  return (
    <div className={`bicho bicho--${humor}`} style={{ width: tamanho, height: tamanho }}>
      <svg ref={svgRef} viewBox="0 0 200 200" role="img" aria-label={descricao[humor]}>
        <defs>
          {/* Contorno com textura de pincel: desloca a borda de leve, sem animar o filtro */}
          <filter id="pincel" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
          <radialGradient id="brilho" cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse className="bicho__sombra" cx="100" cy="186" rx="52" ry="8" />

        <g className="bicho__corpo-grupo">
          {/* Broto que cresce com o nível (hábitos novos) */}
          <g className="bicho__broto" data-nivel={Math.min(nivel, 3)} filter="url(#pincel)">
            <path d="M100 52 C100 40 100 34 100 26" />
            <path className="folha folha--1" d="M100 38 C88 30 80 34 78 26 C90 22 98 28 100 38Z" />
            <path className="folha folha--2" d="M100 32 C112 24 120 28 124 20 C110 16 102 22 100 32Z" />
            <circle className="flor" cx="100" cy="22" r="7" />
          </g>

          <g className="bicho__braco bicho__braco--e" filter="url(#pincel)">
            <path d="M48 140 C30 136 22 150 28 158 C34 164 46 156 52 150" />
          </g>
          <g className="bicho__braco bicho__braco--d" filter="url(#pincel)">
            <path d="M152 140 C170 136 178 150 172 158 C166 164 154 156 148 150" />
          </g>

          <path
            className="bicho__corpo"
            filter="url(#pincel)"
            d="M100 50 C146 50 162 86 160 124 C158 160 132 178 100 178 C68 178 42 160 40 124 C38 86 54 50 100 50Z"
          />
          <path
            className="bicho__brilho"
            d="M100 56 C140 56 154 88 152 122 C150 154 128 170 100 170 C72 170 48 154 46 122 C44 88 60 56 100 56Z"
            fill="url(#brilho)"
          />

          <g className="bicho__rosto">
            <g className="bicho__olhos">
              <g className="olho olho--aberto">
                <g ref={pupilasRef} className="olho__pupilas">
                  <ellipse cx="78" cy="108" rx="8" ry="11" />
                  <ellipse cx="122" cy="108" rx="8" ry="11" />
                  <circle className="olho__luz" cx="81" cy="103" r="3" />
                  <circle className="olho__luz" cx="125" cy="103" r="3" />
                </g>
              </g>
              <g className="olho olho--feliz">
                <path d="M68 110 Q78 98 88 110" />
                <path d="M112 110 Q122 98 132 110" />
              </g>
              <g className="olho olho--cansado">
                <path d="M68 110 Q78 116 88 110" />
                <path d="M112 110 Q122 116 132 110" />
              </g>
            </g>
            <ellipse className="bochecha" cx="62" cy="128" rx="10" ry="6" />
            <ellipse className="bochecha" cx="138" cy="128" rx="10" ry="6" />
            <path className="boca boca--sorriso" d="M88 132 Q100 146 112 132" />
            <path className="boca boca--aberta" d="M86 130 Q100 154 114 130 Q100 136 86 130Z" />
            <path className="boca boca--reta" d="M90 138 Q100 134 110 138" />
          </g>
        </g>
      </svg>
    </div>
  );
}
