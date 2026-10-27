# Spec 002 — Botão SOS de Fissura: Urge Surfing e Cards "Pare e Examine"

- **Estado:** ✅ aprovada
- **Autor(es):** Ian Costa Guimarães
- **Aprovada por:** Equipe Peão em 2026-10-27
- **Prioridade:** Must

## 1. Contexto e problema

A fissura (vontade intensa e impulsiva de apostar) atua neurobiologicamente em formato de onda: sobe rápido, atinge um pico desconfortável de dopamina/ansiedade e diminui progressivamente em 10 a 15 minutos. Quando a pessoa está no ápice da onda, a capacidade de julgamento crítico diminui, favorecendo distorções como a "ilusão de controle" e o *chasing* (tentativa de recuperar dinheiro perdido). É necessário um mecanismo imediato de 1 toque, offline, para acolher a onda (técnica de *urge surfing*) e desarmar distorções cognitivas.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [ ] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [x] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** Marcos ou familiares enfrentando momento agudo de crise impulsiva.
- **Cenário:** É domingo à tarde ou dia de pagamento; Marcos sente o impulso incontrolável de abrir um site de apostas no celular. Ele clica no botão SOS flutuante para não apostar.

## 4. Histórias de usuário

- Como pessoa enfrentando uma fissura intensa, quero acionar um botão SOS com apenas 1 clique em qualquer lugar do aplicativo, para ter apoio imediato antes de ceder ao impulso.
- Como pessoa ansiosa no pico da vontade, quero um exercício guiado de respiração com cronômetro sereno, para que meu corpo relaxe e a onda da fissura diminua.
- Como pessoa tentada a apostar para recuperar perdas, quero ler cards reflexivos com perguntas socráticas, para desconstruir a ilusão de que vou "ganhar de volta".
- Como usuário em sofrimento severo, quero uma saída de emergência para o Ligue 188 caso sinta que não vou aguentar sozinho.

## 5. Critérios de aceite

- **CA-1:** O botão SOS está presente e fixado na tela inicial e no menu superior, abrindo em menos de 500ms e funcionando 100% offline.
- **CA-2:** A primeira tela do SOS pergunta a intensidade da vontade (escala de 0 a 10) e inclui a opção explícita *"Não tô aguentando"*, que transfere imediatamente para a tela do Protocolo de Crise (CVV 188).
- **CA-3:** O fluxo de *urge surfing* apresenta cronômetro sereno (10 a 15 min), frases curtas de ancoragem (*"A vontade sobe, chega no pico e passa"*) e respiração diafragmática guiada com opção de pular.
- **CA-4:** Apresenta o "Seu Motivo" configurado no onboarding e pelo menos um card da série "Pare e Examine" com perguntas reflexivas sem tom moralista.
- **CA-5:** A etapa de encerramento sugere alternativas de ação: [Ver meu plano Se/Então], [Falar com alguém do Círculo] ou [Sair para caminhar].
- **CA-6:** Ao final, o sistema afere novamente a fissura (0 a 10) e mostra a evolução de alívio (*"Começou em 8, agora tá em 4"*), salvando os registros apenas localmente.

## 6. Acessibilidade

- Suporte completo a `prefers-reduced-motion` no cronômetro e nas animações de respiração.
- Contraste visual elevado com a paleta oficial (amarelo `#FCFC30`, azul-escuro `#3333BD`).
- Sons sutis e suaves com opção de silenciamento total.
- Compatibilidade integral com leitores de tela.

## 7. Conteúdo e mensagens

- Conforme `docs/02-produto/microcopy.md` (Fluxo F2).
- Zero julgamentos: *"Respire fundo. A fissura é como uma onda no mar: desconfortável, mas ela sempre passa."*

## 8. Fora do escopo

- Minigames rápidos com elementos de sorte, pontuação, moedas ou efeitos estridentes de vitória.
- Chatbot automatizado com inteligência artificial fingindo ser terapeuta.
- Exigência de conexão de rede ou autenticação para liberar o socorro.

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas (ou, se simula, é educativo e explícito)
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos ou públicos

## 10. Dúvidas em aberto

- Nenhuma. Fluxo alinhado com `docs/02-produto/fluxos.md` (F2).
