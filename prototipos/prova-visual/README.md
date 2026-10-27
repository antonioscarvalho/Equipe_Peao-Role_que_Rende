# Prova visual — bichinho, missões e respiração

Protótipo para validar animações e visual no estilo do Rolê que Rende. Serve de referência para as skills `criar-personagem` e `animar-componente`.

## Rodar
```bash
cd prototipos/prova-visual
npm install
npm run dev   # abre em http://localhost:5180
```
Na rede corporativa (Zscaler), se o `npm install` falhar por certificado:
```bash
export NODE_EXTRA_CA_CERTS=/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem
```

## O que tem
- **Bichinho** (`src/Bichinho.tsx`): SVG original em camadas, humores calmo, feliz, orgulhoso, cansado e apoio. Nunca morre nem culpa.
- **Missões**: concluir faz a moeda girar, o "dinheiro protegido" subir, o bairro crescer e brotar folha no bichinho.
- **Deu vontade** (`src/Respiracao.tsx`): respiração 4-4-6 e atalhos para CVV 188 e autoexclusão gov.br.
- **Reduzir animações**: interruptor no topo, também respeita `prefers-reduced-motion`.
- Animações em CSS/SVG com os tokens `rqr-*` do `guia-estilo-role-que-rende` e três Lottie de teste.

## Dados e créditos
- Dados da demonstração são sintéticos.
- Ícones: [Lucide](https://lucide.dev), licença ISC, obtidos via API do Iconify (`src/icones-data.ts`).
- Lottie: Noto Animated Emoji (Google), licença CC BY 4.0 (`src/lottie/`). Confirmar a licença na página oficial e registrar com `/registrar-asset` antes da entrega.
- Fontes: Nunito Sans (Google Fonts, OFL) como substituta da fonte BB.
- Código gerado com apoio de IA (Kiro, Claude) — registrar com `/registrar-uso-ia`.
