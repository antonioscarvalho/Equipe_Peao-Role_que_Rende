type Peca = { tipo: "casa" | "arvore" | "praca" | "quadra" | "banco"; x: number; cor: string };

const pecas: Peca[] = [
  { tipo: "casa", x: 18, cor: "var(--rqr-rosa-escuro)" },
  { tipo: "arvore", x: 70, cor: "var(--rqr-verde-agro)" },
  { tipo: "quadra", x: 108, cor: "var(--rqr-azul-claro)" },
  { tipo: "casa", x: 168, cor: "var(--rqr-roxo)" },
  { tipo: "arvore", x: 220, cor: "var(--rqr-verde-agro)" },
  { tipo: "praca", x: 256, cor: "var(--rqr-amarelo)" },
];

function Desenho({ p }: { p: Peca }) {
  switch (p.tipo) {
    case "casa":
      return (
        <g>
          <rect x="0" y="22" width="40" height="34" rx="4" fill={p.cor} />
          <path d="M-4 24 L20 2 L44 24Z" fill="var(--rqr-azul-escuro)" />
          <rect x="14" y="36" width="12" height="20" rx="2" fill="var(--rqr-amarelo)" />
        </g>
      );
    case "arvore":
      return (
        <g>
          <rect x="14" y="34" width="8" height="22" rx="3" fill="var(--rqr-azul-escuro)" />
          <circle cx="18" cy="24" r="18" fill={p.cor} />
          <circle cx="11" cy="18" r="5" fill="#fff" opacity=".35" />
        </g>
      );
    case "quadra":
      return (
        <g>
          <rect x="0" y="38" width="52" height="18" rx="4" fill={p.cor} />
          <line x1="26" y1="38" x2="26" y2="56" stroke="#fff" strokeWidth="2" />
          <circle cx="26" cy="47" r="5" fill="none" stroke="#fff" strokeWidth="2" />
          <rect x="4" y="18" width="3" height="20" fill="var(--rqr-azul-escuro)" />
          <rect x="45" y="18" width="3" height="20" fill="var(--rqr-azul-escuro)" />
        </g>
      );
    case "praca":
      return (
        <g>
          <ellipse cx="22" cy="52" rx="24" ry="6" fill="var(--rqr-verde-claro)" />
          <path d="M8 46 h28 v-6 h-28z" fill="var(--rqr-azul-escuro)" />
          <circle cx="22" cy="22" r="12" fill={p.cor} stroke="var(--rqr-azul-escuro)" strokeWidth="3" />
          <path d="M22 10 v-6 M22 40 v-6 M10 22 h-6 M40 22 h-6" stroke="var(--rqr-ouro)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

/** Bairro que se reconstrói conforme as missões. Nada some numa recaída. */
export function Bairro({ construidas }: { construidas: number }) {
  return (
    <svg className="bairro" viewBox="0 0 300 80" role="img"
      aria-label={`Seu bairro tem ${construidas} de ${pecas.length} lugares reconstruídos`}>
      <path className="bairro__chao" d="M0 64 Q75 58 150 64 T300 64 V80 H0Z" />
      {pecas.map((p, i) => (
        <g key={i} transform={`translate(${p.x} 6)`}>
          <g className={`bairro__peca ${i < construidas ? "is-on" : ""}`} style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
            <Desenho p={p} />
          </g>
          {i >= construidas && <rect className="bairro__vaga" x="0" y="44" width="40" height="12" rx="6" />}
        </g>
      ))}
    </svg>
  );
}

