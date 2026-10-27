---
name: criar-personagem
description: Cria ou evolui o bichinho virtual (mascote) do app, com ficha, estados emocionais, SVG animável e prompts de ilustração no estilo pincel seco do Rolê que Rende. Use quando for desenhar, ilustrar ou adicionar um novo estado ao personagem.
---

# Criar personagem (bichinho virtual)

**Pedido:** $ARGUMENTS

## Antes de começar
1. Leia `.claude/skills/guia-estilo-role-que-rende/references/cores.md`, `grafismos-e-icones.md` e `animacoes.md`.
2. Leia `.claude/skills/design-etico-saude-digital/SKILL.md` e `.claude/skills/prevencao-recaida/SKILL.md`, se existirem.
3. Veja a referência viva em `prototipos/prova-visual/` (componente `Bichinho`).

## Regras do personagem (não negociáveis)
- **Nunca morre, nunca adoece de forma grave, nunca "culpa" o usuário.** Na recaída ele fica cansado ou cabisbaixo e se recupera com cuidado. Isso segue o pilar "acolher sem julgar" do edital.
- Nada que lembre cassino: sem moedas caindo aleatórias, sem roleta, sem cartas, sem fichas, sem "sorte".
- A moeda dourada só aparece como **dinheiro protegido conquistado**, nunca como prêmio aleatório.
- Personagem fictício e original. Não copiar mascotes existentes (Pou, Tamagotchi, Duolingo) nem usar marcas.
- Acessível: cada estado tem um `aria-label` em linguagem simples ("Bichinho feliz e dançando").

## Estados mínimos
| Estado | Quando | Corpo | Rosto | Animação |
|---|---|---|---|---|
| `feliz` | Missão concluída, dia sem apostar | quica | olhos abertos, sorriso | `rqr-pop` + pulo |
| `calmo` | Padrão | respira devagar | olhos semiabertos | respirar 4s |
| `cansado` | Recaída ou dia difícil | encolhido, cor mais fria | olhos baixos, boca reta | balanço lento, **sem** tremer de forma punitiva |
| `orgulhoso` | Meta financeira atingida | cresce um pouco, brilho | olhos fechados de alegria | `rqr-moeda` ao lado |
| `apoio` | Botão "Deu vontade" | estende os braços | olhar atento | respira junto com o usuário |
| `crescendo` | Evolução por hábitos | ganha folha/acessório | — | transição 600ms `--rqr-ease-pop` |

## Entregáveis
1. **Ficha** em `docs/03-design/personagem.md`: nome, personalidade (2–3 traços), voz (frases de exemplo no tom do guia), estados e regras acima.
2. **SVG em camadas** (corpo, olhos, boca, braços, acessórios) com `id` em cada parte, para animar por CSS. Paleta: corpo `--rqr-azul-claro` ou `--rqr-rosa-claro`, contorno `--rqr-azul-escuro` com 4–6px, bochechas `--rqr-rosa-escuro`.
3. **Prompts de ilustração** (para Figma `generate_image`, Krita ou outra IA), sempre com:
   > "personagem mascote fofo e original, estilo ilustração à mão com textura de pincel seco, contorno azul-escuro #3333BD grosso e irregular, cores chapadas #54DCFC e #FFA7D3, fundo amarelo #FCFC30, sem texto, sem moedas, sem elementos de cassino, estado: <estado>"
4. Registrar: `/registrar-uso-ia` se usar IA para gerar arte; `/registrar-asset` para qualquer asset de terceiros.

## Checklist final
- [ ] Todos os estados existem e trocam sem "pulo" visual (mesmas camadas).
- [ ] Contraste do contorno sobre o fundo ≥ 3:1.
- [ ] Animações desligam com `prefers-reduced-motion` e com o interruptor "Reduzir animações".
- [ ] Rodar `/conformidade-legal-br` no componente.
