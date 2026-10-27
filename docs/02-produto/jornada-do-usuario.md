# Jornada do usuário

> Descreve o caminho da pessoa dentro da solução. É a espinha da demonstração no pitch.
> Baseada na [spec 001](../../specs/001-mvp-guardiao/spec.md) e implementada em `web/`.

## Jornada principal (persona Rafael)

| Etapa | O que a pessoa sente / precisa | O que a solução oferece | Tela / cena |
|---|---|---|---|
| 1. Primeiro contato | Vergonha, desconfiança: "vão me julgar? vão saber de mim?" | Abre direto no navegador, sem loja e sem cadastro. Diz logo que os dados ficam só no aparelho e quais são os limites do app | `/boas-vindas` |
| 2. Onboarding | Ambivalência: quer parar, mas a aposta também "dava algo" | "O que te trouxe aqui hoje?", chips de motivos, régua de importância e confiança com a pergunta "o que faz ser 7 e não 0?", meta concreta para o dinheiro | `/boas-vindas` (4 passos) |
| 3. Uso no dia a dia | Quer ver que está avançando, sem virar vigilância | Registro do dia em 1 toque; Guardião e total de dias sem apostar; dinheiro preservado como estimativa | `/` e `/registro` |
| 4. Momento de vontade de jogar | Pressa, impulso, "só mais uma" | SOS: vontade 0–10 → 10–15 min de respiração ("a onda vai passar") → seu motivo + card "Pare e examine" → plano Se/Então ou ligar para alguém → vontade de novo | `/sos` |
| 5. Organização financeira | Dívida e culpa; não sabe por onde começar | Guia de bloqueio (apps, DNS, grupos) e de barreiras financeiras (limite de Pix noturno, pessoa de confiança); dinheiro preservado ligado à meta | `/bloqueio`, `/` |
| 6. Pedido de apoio / ajuda especializada | Isolamento; não sabe onde há ajuda gratuita | Círculo de Confiança (até 3 pessoas, mensagem pronta que **ele** envia); hub com CVV, UBS/CAPS, Meu SUS Digital, Jogadores Anônimos, Defensoria/Procon | `/apoio` |
| 7. Progresso e recaídas | Depois de um lapso: "estraguei tudo" | "Obrigado por registrar. Isso não apaga o que você já conquistou." Pós-lapso vira ajuste do plano; o total de dias continua; o Guardião abre os braços | `/registro`, `/` |

## Fluxo de crise

Como a solução reage quando a pessoa sinaliza sofrimento intenso? Ela **sempre** mostra canais de ajuda reais ([fontes e referências](../07-conformidade/fontes-e-referencias.md)).

```
[botão "Preciso de ajuda agora" em toda tela]  ─┐
[resposta "Sim" à pergunta opcional no fim do SOS] ─┼─► tela calma → CVV 188 · SAMU 192 · contato de confiança · chat CVV
[vontade 9–10 ao fim do SOS → oferta do CVV]       │       → UBS/CAPS → respirar (depois das opções) → plano de segurança
[palavra de risco no pós-lapso → só OFERECE ajuda] ─┘
```

- A tela de crise abre **antes** do onboarding e sem internet (telefones no próprio app).
- Nada de crise vai para servidor ou analytics; o app não diagnostica nem bloqueia.
- Ordem definida pela skill `seguranca-e-crise`: ajuda humana primeiro, respiração depois.

## Roteiro da demo (pitch)

Abrir com `?demo` (dados sintéticos de "Rafael", 12 dias de jornada com um lapso). Cerca de 60 segundos:

1. **Tela inicial** (10 s): SOS amarelo no topo, "Seu motivo", Guardião com cachecol (marco de 7 dias), 12 dias sem apostar **mesmo com um lapso**, R$ 257 preservados para a viagem.
2. **SOS** (25 s): marcar vontade 8 → 10 minutos → mostrar a respiração → "Já estou melhor" → card "Mais uma e eu recupero" → plano Se/Então e "Ligar para Irmão" → vontade 3 → "A vontade foi de 8 para 3".
3. **Pergunta opcional e crise** (15 s): responder "Sim" → tela de crise com CVV 188 e SAMU 192 a um toque.
4. **Acessibilidade** (10 s): Configurações → texto "Maior" + alto contraste.
