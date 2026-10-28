# Rolê que Rende — app web (antiga prova visual)

Protótipo para validar animações e visual no estilo do Rolê que Rende. Serve de referência para as skills `criar-personagem`, `animar-componente` e `sonorizar-componente`.

Este é o app publicado na Vercel (pasta `web/`). O app web anterior está em `lixo/web-antigo/`.

## Rodar
```bash
cd web
npm install
npm run dev   # abre em http://localhost:5180
```
Na rede corporativa (Zscaler), se o `npm install` falhar por certificado:
```bash
export NODE_EXTRA_CA_CERTS=/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem
```

### Testar no celular (giroscópio)
O sensor de inclinação só funciona em HTTPS:
```bash
npm run certs       # uma vez: certificado local em ./certs (fora do git)
npm run dev:https   # abre em https://<ip-do-pc>:5443
```
No celular, aceite o aviso de certificado. No iPhone, o jogo pede permissão de movimento ao tocar em **Começar**.

## O que tem
- **Pulo do Bichinho** (`src/PuloDoBichinho.tsx`): mini jogo de pulo infinito no estilo Sky Jump. Inclinar o celular, setas/A-D ou segurar um lado da tela. Plataformas verdes, azuis (andam), nuvens (somem) e molas; folhas para coletar. O bichinho nunca morre: cai na grama e tenta de novo.
- **Bichinho** (`src/Bichinho.tsx`): SVG original em camadas, humores calmo, feliz, orgulhoso, cansado e apoio. Nunca morre nem culpa.
- **Missões**: concluir faz a moeda girar, o "dinheiro protegido" subir, o bairro crescer e brotar folha no bichinho.
- **Deu vontade** (`src/Respiracao.tsx`): respiração 4-4-6 e atalhos para CVV 188 e autoexclusão gov.br.
- **Reduzir animações**: interruptor no topo, também respeita `prefers-reduced-motion`.
- **Sons** (`src/sons.ts`): sintetizados com Web Audio, ligados por padrão nas missões (interruptor "Sons" no topo desliga); na respiração começam desligados. Missão concluída toca acorde, moeda e folha em sequência; a respiração tem tons calmos na inspiração e expiração. Ver skill `sonorizar-componente`.
- Animações em CSS/SVG com os tokens `rqr-*` do `guia-estilo-role-que-rende` e três Lottie de teste.

## Dados e créditos
- Dados da demonstração são sintéticos.
- Ícones: [Lucide](https://lucide.dev), licença ISC, obtidos via API do Iconify (`src/icones-data.ts`).
- Lottie: Noto Animated Emoji (Google), licença CC BY 4.0 (`src/lottie/`). Confirmar a licença na página oficial e registrar com `/registrar-asset` antes da entrega.
- Fontes: Nunito Sans (Google Fonts, OFL) como substituta da fonte BB.
- Código gerado com apoio de IA (Kiro, Claude) — registrar com `/registrar-uso-ia`.
