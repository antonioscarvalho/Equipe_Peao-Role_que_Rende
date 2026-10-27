# Spec 004 — Plano de Prevenção de Recaída (Planos Se/Então) e Círculo de Confiança

- **Estado:** ✅ aprovada
- **Autor(es):** Ian Costa Guimarães
- **Aprovada por:** Equipe Peão em 2026-10-27
- **Prioridade:** Should

## 1. Contexto e problema

A força de vontade individual isolada é insuficiente para resistir a gatilhos fortes e repetitivos (dia do pagamento, tédio, discussões familiares, jogos de futebol na televisão). A psicologia comportamental demonstra que intenções de implementação formuladas no modelo "Se [gatilho acontecer], então [ação concreta que tomarei]" reduzem significativamente o risco de recaídas. Da mesma forma, ter uma rede de apoio pessoal e privada reduz o isolamento característico do transtorno de apostas.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [ ] Reorganizar a vida financeira
- [x] Fortalecer redes de apoio
- [ ] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** Usuário que já reconhece situações de risco e deseja criar barreiras prévias; e familiares que atuam como suporte.
- **Cenário:** O usuário configura seus planos de enfrentamento durante um momento de tranquilidade, para que estejam disponíveis de forma imediata quando a fissura surgir.

## 4. Histórias de usuário

- Como pessoa propensa a recaídas em situações previsíveis, quero mapear meus gatilhos e definir ações alternativas para cada um deles.
- Como pessoa em recuperação, quero cadastrar até 3 pessoas de minha extrema confiança para chamá-las rapidamente em momentos de vulnerabilidade.
- Como usuário que valoriza sua privacidade, quero que meus contatos fiquem salvos apenas no meu aparelho, sem que o app publique nada em redes sociais.

## 5. Critérios de aceite

- **CA-1:** Tela de seleção de gatilhos frequentes com chips de seleção (dia do pagamento, solidão, briga, tédio, bebida, jogo na TV) e opção de texto livre.
- **CA-2:** Construtor intuitivo de até 5 planos do tipo *"Se [gatilho], então [ação alternativa]"*, sugerindo ações saudáveis de descompressão (caminhada, ligar para alguém, ouvir música).
- **CA-3:** Os planos cadastrados são automaticamente disponibilizados como opções práticas de escolha na etapa de desfecho do Botão SOS (Spec 002).
- **CA-4:** Módulo "Círculo de Confiança" permite registrar nome e telefone de até 3 contatos de apoio, com armazenamento 100% local no dispositivo (LGPD estrita).
- **CA-5:** Botão "Chamar apoio" gera link pré-preenchido para WhatsApp/SMS com mensagem respeitosa (*"Estou com vontade de apostar, pode conversar comigo agora?"*), exigindo sempre a confirmação e o envio voluntário pelo próprio usuário.
- **CA-6:** Fluxo integrado para edição e ajuste rápido dos planos Se/Então após o registro de um lapso no check-in diário.

## 6. Acessibilidade

- Formulários simples, com rótulos semânticos e foco ordenado para navegação via teclado.
- Botões de chamada para contatos com contraste mínimo de 8:1 e ícones com texto alternativo claro.
- Compatibilidade integral com leitores de tela no Android e iOS.

## 7. Conteúdo e mensagens

- Alinhado a `docs/02-produto/microcopy.md` (Fluxos F5 e F8).
- Mensagens para o Círculo de Confiança sempre claras, diretas e sem tom de pânico: *"Oi! Lembra do combinado? Tô sentindo vontade de apostar e queria trocar uma ideia rápida com você."*

## 8. Fora do escopo

- Envio automático de mensagens ou notificações em segundo plano sem consentimento do usuário.
- Compartilhamento em redes sociais abertas (Instagram, Facebook, etc.).
- Armazenamento em nuvem ou compartilhamento de contatos com terceiros.

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas (ou, se simula, é educativo e explícito)
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos ou públicos

## 10. Dúvidas em aberto

- Nenhuma. Fluxos alinhados com `docs/02-produto/fluxos.md` (F5 e F8).
