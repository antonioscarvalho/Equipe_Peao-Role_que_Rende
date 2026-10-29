---
name: seguranca-e-crise
description: Obrigatória em toda tela, notificação, conteúdo ou fluxo do app. Define o protocolo de detecção de risco, encaminhamento a ajuda humana (CVV 188, SAMU 192, CAPS) e limites clínicos do produto.
---

# Segurança e protocolo de crise

## Por que é obrigatória
Problemas com jogo estão associados a maior risco de depressão, endividamento grave, violência doméstica e **suicídio**. Um app para esse público vai encontrar pessoas em crise. Toda funcionalidade precisa saber o que fazer quando isso acontece.

## Sinais de risco que o app deve reconhecer
- Respostas explícitas de desesperança, vontade de morrer ou de se ferir (em check-ins, diário, SOS).
- Fissura máxima combinada com desespero ("não aguento mais", "não tem saída").
- Dívidas descritas como impagáveis + isolamento.
- Menção a violência ou ameaça de credores/agiotas.

Prefira **perguntas diretas e opcionais** em pontos definidos (ex.: check-in semanal; final do SOS) a tentar adivinhar risco por análise automática de texto livre. Se houver detecção por palavras-chave no diário, ela só **oferece** ajuda; nunca bloqueia nem rotula.

## Protocolo (fluxo de crise)
1. Tela calma, sem alarmismo: "Parece que você está passando por um momento muito difícil. Você não precisa passar por isso sozinho(a)."
2. Ação imediata com 1 toque:
   - **CVV — 188** (ligação gratuita, 24h) e chat pelo site do CVV
   - **SAMU — 192** em risco imediato
   - Contato de confiança cadastrado
   - Encontrar o **CAPS** mais próximo (link oficial; sem coletar localização sem consentimento)
3. Exercício de estabilização curto (respiração) **depois** das opções de ajuda, nunca no lugar delas.
4. Plano de segurança simples (estilo Stanley-Brown, adaptado): sinais de alerta, o que me acalma, pessoas e lugares, profissionais, como deixar o ambiente mais seguro. Revisável.
5. Volta ao app sem pressa; não registrar o episódio em analytics.

## Limites do produto
- O app não faz diagnóstico, não é atendimento de emergência e diz isso de forma clara e gentil.
- Nenhuma promessa de confidencialidade absoluta ou sobre o que os serviços de crise farão.
- Conteúdo clínico (rastreios, textos de crise, plano de segurança) precisa de revisão por psicólogo(a) antes de publicar — marque com `// REVISÃO CLÍNICA PENDENTE`.
- Usuário menor de 18 anos: apostas são proibidas para menores; o app deve orientar a buscar um adulto de confiança e a rede de saúde, e o projeto precisa decidir (com assessoria jurídica) a política de idade.
- Números de telefone e links ficam em arquivo de conteúdo com data de verificação.

## Checklist (rodar em todo módulo)
- [ ] Este fluxo pode encontrar alguém em crise? Se sim, há saída para o protocolo a ≤ 2 toques?
- [ ] O protocolo funciona offline (telefones visíveis sem internet)?
- [ ] Nenhum texto minimiza sofrimento ou culpa a pessoa?
- [ ] Nenhum dado de crise vai para analytics ou servidor sem consentimento?
- [ ] Conteúdo clínico marcado para revisão profissional?
