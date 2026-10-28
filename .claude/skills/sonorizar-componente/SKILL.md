---
name: sonorizar-componente
description: Adiciona sons e feedback sonoro a um componente ou tela do Rolê que Rende, combinando com as animações rqr-*. Sons de missão ligados por padrão (SOS em silêncio), suaves e sem estética de cassino. Use quando for colocar som em missões, conquistas, moeda, bichinho ou respiração.
---

# Sonorizar componente

**Alvo:** $ARGUMENTS

## Antes de começar
1. Leia o componente alvo e a animação que ele já usa (skill `animar-componente`).
2. Veja o exemplo pronto em `web/src/sons.ts` e como ele é chamado em `App.tsx` e `Respiracao.tsx`.

## De onde vem o som (nesta ordem)
1. **Síntese com Web Audio** (padrão): adicione uma receita em `sons.ts`. Não tem arquivo, não tem licença, funciona offline e na rede corporativa.
2. **MCP `sfxmint`** (`https://sfxmint.com/mcp`, CC0, sem chave): quando precisar de um som gravado. Bloqueado na rede corporativa; use fora dela. Baixe o arquivo para `public/sons/` (não faça hotlink) e registre com `/registrar-asset`.
3. Freesound só com licença CC0 confirmada. CC BY exige crédito no README e em `/registrar-asset`.

## Combinar som e animação
| Animação | Som | Momento |
|---|---|---|
| `rqr-pop` / missão concluída | `tocarMissao(feitas, total)`: sobe na escala e ganha notas a cada missão; a última fecha com acorde | no clique |
| `rqr-moeda` + contador | `moeda` (duas notas, uma moeda só) | ~250 ms depois |
| Todas as missões do dia concluídas | `conquista` (arpejo + acorde aberto) | ~1,3 s depois, após moeda e folha |
| Folha brotando no bichinho | `folha` (plim subindo) | ~650 ms depois |
| Respiração 4-4-6 | `inspira` / `expira` (tom grave longo); "Segure" em silêncio | início de cada fase |
| `rqr-tremida` (erro) | nenhum, ou `clique` | nunca som de erro/buzina |

Escalone os sons como as animações escalonadas: um evento, um som de cada vez.

## Regras obrigatórias
- Sons de missão **ligados por padrão**, com interruptor "Sons" visível ao lado de "Reduzir animações". O navegador só libera áudio após o primeiro toque, o que já acontece ao marcar uma missão.
- No SOS / respiração, som **desligado por padrão** (spec 003 CA-3), com botão próprio para ligar.
- Volume baixo (ganho ≤ 0,1), timbres seno ou triângulo, duração ≤ 0,6 s na UI. Respiração pode ter tons longos e graves.
- Som nunca é a única informação: o mesmo evento precisa de texto (`aria-live`) e visual.
- No SOS / crise: nada de som de recompensa, só ritmo calmo e opcional.

## Proibido (tema apostas)
- Jackpot, caça-níquel, chuva de moedas, sirene, contagem com tique-taque, fanfarra de "você ganhou", sons de cassino ou de app de aposta.
- Som ligado a sorte. Som de conquista só para escolha e esforço.

## Checklist final
- [ ] Interruptor "Sons" desliga tudo; SOS começa em silêncio.
- [ ] Nenhum som em loop na UI.
- [ ] Assets externos registrados com `/registrar-asset`.
- [ ] Rodar `/conformidade-legal-br` e `/design-etico-saude-digital` no componente.
