---
name: registrar-asset
description: Registra uma biblioteca, engine, asset (imagem, fonte, som) ou API externa e sua licença em docs/07-conformidade/licencas-e-assets.md. Use sempre que algo de terceiros entrar no projeto, ou quando pedir /registrar-asset.
---

# Registrar asset, biblioteca ou API

O edital (Seções 8.5 e 9.1) exige identificar código aberto e assets de terceiros na entrega.

## Passos

1. Identifique o tipo: biblioteca/engine, asset gráfico, asset sonoro ou API/serviço.
2. Descubra a licença **na fonte oficial** (arquivo LICENSE, página do asset, termos da API). Se não encontrar, avise: item sem licença **não pode** ser usado.
3. Confira na tabela "Licenças compatíveis" de `docs/07-conformidade/licencas-e-assets.md`:
   - ❌: avise o usuário e não registre como aprovado;
   - ⚠️: explique a restrição e peça confirmação.
4. Adicione a linha na tabela correta, com nome, versão, licença, link, uso, se foi gerado por IA e a atribuição exigida.
5. Se for API, registre também em `docs/04-tecnico/integracoes-externas.md` e rode o checklist dela.
6. Se o asset foi gerado por IA, lembre de rodar `/registrar-uso-ia`.
7. Se a licença exigir atribuição (ex.: CC BY), lembre de colocar os créditos também dentro do produto (tela de créditos).

## Regras

- Nunca registre marcas de casas de apostas, clubes ou atletas (Seção 8.4).
