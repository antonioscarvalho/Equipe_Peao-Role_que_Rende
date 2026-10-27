# Spec 005 — Protocolo de Crise, Hub de Apoio Especializado e Guia de Bloqueio

- **Estado:** ✅ aprovada
- **Autor(es):** Ian Costa Guimarães
- **Aprovada por:** Equipe Peão em 2026-10-27
- **Prioridade:** Must

## 1. Contexto e problema

Estudos oficiais comprovam que pessoas com transtorno do jogo apresentam taxa de mortalidade por suicídio 15 vezes maior que a população geral. Momentos de perda financeira aguda ou cobranças extremas podem gerar desespero e ideação suicida. O aplicativo não pode, em hipótese alguma, atuar como barreira ou substituto de ajuda profissional (conforme expressamente vetado pelo Anexo 2 do Edital). É mandatório oferecer uma saída imediata e calma para serviços públicos de socorro humano (CVV 188, SAMU 192, CAPS), além de orientações práticas para desinstalação e bloqueio de estímulos no celular.

## 2. Pilar do desafio

- [ ] Enfrentar momentos de vontade de jogar
- [x] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [x] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** Usuário em situação de sofrimento severo, desespero pós-perda ou familiares em busca de socorro especializado.
- **Cenário:** Em qualquer tela do app, o usuário sente que perdeu o controle total e precisa de ajuda profissional humana com urgência máxima.

## 4. Histórias de usuário

- Como pessoa em crise emocional profunda, quero ligar para o CVV (188) ou SAMU (192) em no máximo 2 toques, para receber ajuda humana imediata e gratuita.
- Como pessoa querendo se proteger de recaídas, quero um guia passo a passo para bloquear DNS de apostas e limpar aplicativos de bets do meu celular.
- Como usuário endividado, quero acessar canais legítimos do SUS, Jogadores Anônimos e órgãos de defesa do consumidor para negociar débitos sem intermediários fraudulentos.

## 5. Critérios de aceite

- **CA-1:** O botão "Preciso de ajuda agora" está fixo e visível no cabeçalho ou menu de navegação de todas as telas, acessível em no máximo 2 toques e com funcionamento 100% offline.
- **CA-2:** A tela do Protocolo de Crise utiliza visual calmo e sereno (sem estímulos visuais agressivos) e apresenta botões diretos de discagem rápida:
  - [Ligar pro CVV · 188] (Apoio emocional e prevenção do suicídio, gratuito 24h).
  - [Ligar pro SAMU · 192] (Emergências médicas e psiquiátricas).
  - [Chamar alguém do meu Círculo] (acesso aos contatos de confiança).
  - [Onde fica o CAPS mais perto] (orientação para busca de atendimento presencial sem coleta invasiva de GPS).
- **CA-3:** Exercício breve de respiração de 2 minutos e plano de segurança pessoal são oferecidos logo abaixo dos botões de socorro humano, sem nunca bloqueá-los.
- **CA-4:** O Hub de Apoio Especializado lista serviços verificados com links e contatos oficiais: Meu SUS Digital, Plataforma Centralizada de Autoexclusão (Ministério da Fazenda), Jogadores Anônimos e Procon/Defensoria Pública para renegociação de dívidas.
- **CA-5:** O Guia de Bloqueio oferece instruções práticas para Android: configuração de DNS de proteção familiar/bloqueio, desinstalação de atalhos e aplicativos de bets, saída de grupos de mensagens de "tips" e redução de limites de Pix noturno.

## 6. Acessibilidade

- Botões de chamada para emergências com tamanho extragrande e contraste extremo.
- Compatibilidade absoluta com leitores de tela em modo de emergência.
- Todos os links e números de telefone com atributos semânticos para discagem direta no aparelho.

## 7. Conteúdo e mensagens

- Alinhado com `docs/02-produto/microcopy.md` (Fluxos F3, F6 e F7).
- Mensagem serena de acolhimento: *"Parece que você está passando por um momento muito difícil. Você não está só. Estamos aqui para te conectar com ajuda agora."*
- Textos clínicos pendentes de validação final por profissional de saúde mental.

## 8. Fora do escopo

- Qualquer pretensão de diagnóstico médico, prescrição clínica ou substituição de atendimento profissional (cumprimento estrito do Anexo 2 do Edital).
- Rastreamento por geolocalização / GPS (orientações de busca por CAPS fornecidas via link de busca oficial).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas (ou, se simula, é educativo e explícito)
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos ou públicos

## 10. Dúvidas em aberto

- Nenhuma. Fluxos alinhados com `docs/02-produto/fluxos.md` (F3, F6 e F7).
