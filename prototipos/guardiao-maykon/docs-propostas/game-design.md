# Game design / experiência

> O Guardião não é um jogo: é um app de apoio com uma camada leve de gamificação. Este documento descreve a experiência e por que ela **não** usa a lógica das apostas.
> Rascunho de 27/10/2026 para revisão de Game Design (Atyrson Souto).

## Conceito em uma frase

Um companheiro calmo, o **Guardião**, que acompanha a pessoa nos dias sem apostar, ajuda a atravessar a onda da vontade e nunca pune quando ela escorrega.

## Loop principal

```
[vontade ou fim do dia] → [SOS ou registro em 1 toque] → [feedback calmo: "a vontade foi de 8 para 3", "obrigado por registrar"]
        → [progresso previsível: total de dias, dinheiro preservado, Guardião cresce nos marcos] → [volta quando precisar]
```

A meta é a pessoa **precisar menos** do app com o tempo (skill `design-etico-saude-digital`), não passar mais tempo nele.

## Mecânicas

| Mecânica | Objetivo (qual pilar do desafio atende) | Como funciona |
|---|---|---|
| SOS com régua antes/depois | Vontade de jogar | Mede a vontade de 0 a 10, segura 10–15 min com respiração e mostra a queda: constrói a confiança de que "a onda passa" |
| Plano Se/Então | Vontade de jogar | A pessoa combina com ela mesma o que fazer em cada gatilho; o plano aparece no SOS |
| Registro de 1 toque + pós-lapso | Vontade de jogar | "Apostei / não apostei"; o lapso vira ajuste do plano, sem destaque negativo |
| Total de dias sem apostar | Vida financeira / vontade | O número principal é o **total** do período, que um lapso não zera; a sequência atual aparece pequena e neutra |
| Dinheiro preservado | Vida financeira | Estimativa a partir do gasto semanal informado, ligada a uma meta concreta da pessoa |
| Guardião | Diferencial | Ganha cachecol (7 dias), broto (30) e estrela (90); os marcos são anunciados antes; abre os braços depois de um lapso |
| Checklist de bloqueio | Vida financeira | Passos concretos (apagar apps, DNS, limite de Pix); mostra "3 de 8 passos" |
| Círculo de Confiança | Rede de apoio | Até 3 pessoas, ligação ou mensagem pronta enviada pela própria pessoa |

## Progressão e recompensas

- **O que motiva a pessoa a voltar?** A vontade (o SOS resolve um problema real naquele minuto) e ver o próprio progresso ligado aos valores dela (a viagem, as contas, a família).
- Recompensas **não** têm valor monetário nem imitam aposta (Seção 8.4): nada de pontos, moedas, loja, sorteio, caixa-surpresa, ranking ou som de vitória.
- Os marcos são **previsíveis e anunciados** ("Próximo marco: 30 dias, faltam 18"). Nada é aleatório: até o card "Pare e examine" segue uma ordem fixa.

## Mecânicas de sorte (se houver)

O MVP **não tem** mecânica de sorte. As micro-lições sobre probabilidade (#13, Could) só entram com:

- [ ] Está claro para o usuário que a mecânica demonstra um risco
- [ ] A probabilidade real é exibida
- [ ] Não há recompensa que incentive repetir a ação
- [ ] Decisão registrada no [diário de bordo](../../../docs/05-processo/diario-de-bordo.md)

## Direção de arte e som

- **Estilo visual:** o "modo calmo" do [guia de estilo Rolê que Rende](../../../.claude/skills/guia-estilo-role-que-rende/SKILL.md): fundo claro, cartões com borda arredondada e o Guardião desenhado à mão. O amarelo fica só no botão SOS e nos destaques. Sem grafismos nas telas de SOS e de crise.
- **Paleta:** azul-escuro `#3333BD` (texto), branco, amarelo `#FCFC30` (SOS), amarelo-claro `#FFF7B5` (destaque), azul-claro `#54DCFC` e rosa (Guardião). Contraste validado em [acessibilidade](../../../docs/03-design/acessibilidade.md).
- **Tipografia:** BancoDoBrasil Títulos/Textos quando a organização fornecer; sem elas, a fonte do sistema (nada carregado de CDN, para funcionar offline).
- **Áudio:** nenhum no MVP. Se entrar, só sons suaves e opcionais (nunca de "vitória"), desligados por padrão.

Todos os assets de terceiros entram em [licenças e assets](../../../docs/07-conformidade/licencas-e-assets.md). O Guardião e o ícone são arte original da equipe.
