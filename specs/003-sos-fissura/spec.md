# Spec 003 — Botão SOS de Fissura: Urge Surfing e Cards "Pare e Examine"

- **Estado:** ✅ aprovada (Equipe Peão, 27/10/2026) · 🔄 **alterada pela revisão de 27/10/2026 — aguarda reaprovação**
- **Autor(es):** Ian Costa Guimarães · revisão: Maykon Júnio (com apoio de IA)
- **Aprovada por:** Equipe Peão em 2026-10-27 · reaprovação: _—_
- **Prioridade:** Must
- **Issue:** [#5](https://github.com/antonioscarvalho/equipepeao/issues/5) · **Fluxo:** [F2](../../docs/02-produto/fluxos.md)

> **O que mudou na revisão:** o contexto deixou de citar dopamina e um tempo fixo sem fonte; a spec agora diz **o que acrescenta à 001** (seção 1.1); critérios "sereno" viraram regras verificáveis; estado vazio quando não há plano nem contatos (CA-7); cards em ordem previsível (CA-4); sem som por padrão.

## 1. Contexto e problema

A vontade de apostar (fissura) costuma vir como uma onda: sobe, chega a um pico e passa, em geral em minutos (modelo de Prevenção de Recaída de Marlatt e técnica de *urge surfing* — skill `prevencao-recaida`). No pico, distorções como a "ilusão de controle" e o *chasing* (tentar recuperar o que perdeu) ficam mais fortes. Mindfulness tem efeito moderado sobre a fissura (g ≈ 0,69, evidência tentativa) e a correção de crenças sobre o acaso reduz o jogo (ECR de Ladouceur, 2001) — ver [pesquisa](../../docs/pesquisa/02-intervencoes.md). É preciso um apoio de 1 toque, offline, para atravessar a onda e examinar essas distorções.

### 1.1 Relação com a spec 001

A [spec 001](../001-base-sos-crise/spec.md) já implementou o SOS básico: régua 0–10, timer com respiração que pode ser pulado, "Seu motivo" (se houver), um card "Pare e examine", régua final e oferta de CVV com vontade ≥ 9 ou "Não tô aguentando". **Esta spec acrescenta:** o atalho no topo (CA-1), o motivo vindo do onboarding (002), a sequência previsível de cards (CA-4), as ações do plano Se/Então e do Círculo de Confiança da [spec 005](../005-prevencao-e-circulo/spec.md) (CA-5), o estado vazio (CA-7) e as regras de calma do timer (CA-3).

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [ ] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [x] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** **Marcos** ([personas](../../docs/02-produto/publico-e-personas.md)).
- **Cenário:** domingo à tarde ou dia de pagamento; Marcos sente o impulso de abrir um site de apostas e toca no SOS para não apostar.

## 4. Histórias de usuário

- Como **Marcos**, quero acionar o SOS com 1 toque, de qualquer lugar do app, para ter apoio antes de ceder ao impulso.
- Como **Marcos**, no pico da vontade, quero uma respiração guiada com um timer calmo, para a onda baixar.
- Como **Marcos**, tentado a apostar para recuperar perdas, quero cards com perguntas que me façam pensar, sem sermão.
- Como **Marcos**, se eu sentir que não vou aguentar sozinho, quero uma saída direta para o CVV 188.

## 5. Critérios de aceite

- **CA-1:** Dado qualquer tela do app, então o SOS está a **1 toque** (botão grande na tela inicial e atalho no topo) e abre sem internet.
- **CA-2:** Dado a primeira tela do SOS, então há a régua de vontade (0 a 10) e a opção **"Não tô aguentando"**, que leva direto ao protocolo de crise (CVV 188).
- **CA-3:** Dado o timer de *urge surfing* (10 ou 15 minutos, à escolha), então: não há som por padrão, não há cor vermelha nem contagem com tom de urgência, a única animação é a da respiração (ciclo de pelo menos 4 s), há frases curtas de ancoragem (*"A vontade sobe, chega no pico e passa"*) e o botão **Pular** está sempre visível.
- **CA-4:** Dado o passo de reflexão, então aparece o "Seu motivo" do onboarding (se houver) e **um** card "Pare e examine"; os cards seguem uma **ordem fixa** (o próximo SOS mostra o card seguinte), nunca sorteada.
- **CA-5:** Dado o passo de ação, então o app mostra os planos Se/Então e os contatos do Círculo de Confiança (spec 005), além de "Sair para caminhar".
- **CA-6:** Dado o fim do SOS, quando a pessoa marca a vontade de novo (0 a 10), então o app mostra a mudança (*"Começou em 8, agora tá em 4"*) e guarda o par antes/depois **só no aparelho**.
- **CA-7:** Dado que a pessoa ainda não tem plano nem contatos, quando chega ao passo de ação, então o app mostra o convite **"Montar meu plano depois"** e o botão **"Ligar pro CVV · 188"**, sem bloquear o fim do SOS.

## 6. Acessibilidade

- `prefers-reduced-motion` e a opção "Reduzir animações" ([spec 008](../008-configuracoes-privacidade-acessibilidade/spec.md)) param a animação da respiração; o texto "Inspire / Solte" continua.
- Contraste pela paleta oficial (azul-escuro `#3333BD` sobre amarelo `#FCFC30` = 8,1:1).
- Sons, se existirem, são opcionais e começam desligados.
- Leitor de tela: o tempo restante não é anunciado a cada segundo, só em marcos.

## 7. Conteúdo e mensagens

- [Microcopy](../../docs/02-produto/microcopy.md), seção F2 (textos 🩺 com revisão clínica pendente).
- *"Respire fundo. A vontade é como uma onda: incomoda, mas passa."*

## 8. Fora do escopo

- Minigames, elementos de sorte, pontuação, moedas ou efeitos de vitória.
- Chatbot de IA fingindo ser terapeuta.
- Exigir internet ou login para o SOS.

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte (seção 1, ver pesquisa)
- [x] Só dados sintéticos ou do próprio usuário, no aparelho

## 10. Dúvidas em aberto

- Nenhuma. Fluxo alinhado com `docs/02-produto/fluxos.md` (F2).
