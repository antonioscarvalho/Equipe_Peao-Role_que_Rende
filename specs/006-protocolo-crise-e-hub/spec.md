# Spec 006 — Protocolo de Crise, Hub de Apoio Especializado e Guia de Bloqueio

- **Estado:** ✅ aprovada (Equipe Peão, 27/10/2026) · 🔄 **alterada pela revisão de 27/10/2026 — aguarda reaprovação**
- **Autor(es):** Ian Costa Guimarães · revisão: Maykon Júnio (com apoio de IA)
- **Aprovada por:** Equipe Peão em 2026-10-27 · reaprovação: _—_
- **Prioridade:** Must
- **Issue:** [#9](https://github.com/antonioscarvalho/equipepeao/issues/9) · **Fluxos:** [F3, F6 e F7](../../docs/02-produto/fluxos.md)

> **O que mudou na revisão:** o dado de suicídio foi corrigido para o que a pesquisa sustenta; a ajuda fica a **1 toque**, como na 001; "visual calmo" e "extragrande" viraram números; serviços não confirmados passam a ser **condicionais e datados** (CA-4); não há link oficial de busca de CAPS (dúvida reaberta); guia de bloqueio com o mínimo para iPhone (CA-5).

## 1. Contexto e problema

Um estudo de registro nacional sueco encontrou mortalidade por suicídio cerca de **15 vezes maior** entre pessoas com diagnóstico de transtorno do jogo; um estudo de 2025 com o mesmo registro sugere que parte dessa associação passa por outras condições de saúde mental ([pesquisa](../../docs/pesquisa/01-transtorno-do-jogo.md)). O risco é alto o bastante para que o protocolo de crise seja obrigatório (skill `seguranca-e-crise`) — mas esse número **não** aparece no app para assustar. Perdas e cobranças podem gerar desespero. O app não pode atuar como barreira ou substituto de ajuda profissional (Anexo 2 do edital): precisa oferecer saída imediata e calma para serviços públicos (CVV 188, SAMU 192, UBS/CAPS) e orientações práticas para bloquear estímulos no celular.

## 2. Pilar do desafio

- [ ] Enfrentar momentos de vontade de jogar
- [x] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [x] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** **Marcos** ([personas](../../docs/02-produto/publico-e-personas.md)) em sofrimento intenso depois de uma perda; ou **Dona Célia**, que procura ajuda para alguém da família.
- **Cenário:** em qualquer tela, a pessoa sente que perdeu o controle e precisa de ajuda humana agora.

## 4. Histórias de usuário

- Como **Marcos**, em crise, quero ligar para o CVV (188) ou o SAMU (192) com 1 toque, de qualquer tela.
- Como **Marcos**, quero um passo a passo para bloquear sites e apps de apostas no meu celular.
- Como **Marcos**, endividado, quero chegar a canais oficiais do SUS, aos Jogadores Anônimos e à defesa do consumidor, sem intermediários.

## 5. Critérios de aceite

- **CA-1:** Dado qualquer tela, inclusive antes do onboarding, então **"Preciso de ajuda agora"** fica visível no topo e leva ao protocolo de crise com **1 toque**, sem internet.
- **CA-2:** Dado a tela de crise, então: não há grafismos decorativos nem animação (exceto a respiração opcional), os botões de ligação têm **pelo menos 64 px de altura** e contraste **≥ 7:1**, e eles aparecem nesta ordem, cada um a 1 toque:
  - **Ligar pro CVV · 188** (apoio emocional e prevenção do suicídio, gratuito, 24h);
  - **Ligar pro SAMU · 192** (risco imediato);
  - **Chamar alguém do meu Círculo** (se houver contato; senão, convite da [spec 005](../005-prevencao-e-circulo/spec.md), CA-7);
  - **Procurar atendimento no SUS**: texto orientando ir à UBS do bairro ou ao CAPS, sem pedir localização.
- **CA-3:** Dado a tela de crise, então a respiração breve (cerca de 2 minutos) e o plano de segurança pessoal (sinais de alerta, o que acalma, pessoas e lugares, profissionais, ambiente seguro) aparecem **abaixo** dos botões de ajuda humana e nunca os escondem; o plano de segurança é editável e fica só no aparelho.
- **CA-4:** Dado o Hub de Apoio, então cada serviço mostra a **data de verificação**; CVV, UBS/CAPS, Jogadores Anônimos e Procon/Defensoria aparecem normalmente; a **Plataforma Centralizada de Autoexclusão** e o **teleatendimento do Meu SUS Digital** aparecem com o aviso *"situação não confirmada em fonte oficial"* até serem verificados.
- **CA-5:** Dado o Guia de Bloqueio, então há passos para **Android** (DNS com filtro, apagar apps e atalhos, sair de grupos de "tips", baixar o limite do Pix noturno) e o mínimo para **iPhone** (Ajustes › Tempo de Uso › Restrições de Conteúdo e Privacidade); cada passo pode ser marcado como feito; o texto deixa claro que, desde a MP 1.394/2026, sites de apostas que ainda funcionam são ilegais e não respeitam autoexclusão.

## 6. Acessibilidade

- Botões de emergência com pelo menos 64 px de altura e contraste ≥ 7:1.
- Compatível com leitor de tela; a tela de crise tem um único título claro.
- Números de telefone como link de discagem (`tel:`).

## 7. Conteúdo e mensagens

- [Microcopy](../../docs/02-produto/microcopy.md), seções F3, F6 e F7 (🩺 revisão clínica pendente).
- *"Parece que você está passando por um momento muito difícil. Você não precisa passar por isso sozinho(a)."*

## 8. Fora do escopo

- Diagnóstico, prescrição ou substituição de atendimento profissional (Anexo 2).
- Geolocalização / GPS.
- Detecção automática de crise por análise de texto (só perguntas diretas e opcionais, skill `seguranca-e-crise`).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte e data de verificação
- [x] Só dados sintéticos ou do próprio usuário, no aparelho

## 10. Dúvidas em aberto

- [PRECISA ESCLARECER: existe link oficial do Ministério da Saúde para localizar CAPS? Até lá, só orientação em texto]
- [PRECISA ESCLARECER: a Plataforma Centralizada de Autoexclusão continua ativa depois da MP 1.394/2026?]
- [PRECISA ESCLARECER: quem faz a revisão clínica dos textos de crise e do plano de segurança?]
