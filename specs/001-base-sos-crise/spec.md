# Spec 001 — Base do app, SOS de fissura e protocolo de crise

- **Estado:** ✅ aprovada (Antonio Carvalho, 27/10/2026 — "pode executar", depois das Fases 1 a 3)
- **Autor(es):** Antonio Carvalho, com apoio de IA (ver declaração)
- **Prioridade:** Must

## 1. Contexto e problema
No momento da vontade de apostar, a pessoa tem pressa e pouca paciência. Ela precisa de uma ajuda que abra na hora, mesmo sem internet, e de um caminho rápido para ajuda humana se estiver em sofrimento intenso. Ver [pesquisa](../../docs/pesquisa/00-sintese.md), conclusões 3 e 7.

## 2. Pilar do desafio
- [x] Enfrentar momentos de vontade de jogar
- [ ] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [x] Acessar ajuda especializada

## 3. Persona e cenário
Pessoa que enfrenta problemas com apostas, com Android de entrada, num momento de fissura (ex.: dia do pagamento, jogo na TV), possivelmente sem internet.

## 4. Histórias de usuário
- Como pessoa com vontade de apostar, quero um botão que me ajude a atravessar a vontade agora, para não apostar.
- Como pessoa em sofrimento intenso, quero achar ajuda humana em poucos toques, de qualquer tela.

## 5. Critérios de aceite
- **CA-1:** Dado que abro o app, quando estou na tela inicial, então o botão **"Bateu a vontade?"** está visível e leva ao SOS com 1 toque.
- **CA-2:** Dado qualquer tela, quando procuro ajuda, então **"Preciso de ajuda agora"** está visível e leva ao protocolo de crise com 1 toque.
- **CA-3:** Dado o SOS, quando marco a vontade de 0 a 10, então passo pela respiração com timer (que posso pular), pelo meu motivo (se houver), por um card "Pare e examine" e pelas ações possíveis, e no fim marco a vontade de novo e vejo a mudança.
- **CA-4:** Dado o SOS, quando escolho "Não tô aguentando" ou termino com vontade ≥ 9, então o app me oferece CVV 188 e o protocolo de crise.
- **CA-5:** Dado o protocolo de crise, então vejo CVV 188, SAMU 192 e orientação sobre UBS/CAPS **antes** de qualquer exercício, com ligação em 1 toque, sem internet.
- **CA-6:** Dado que concluo um SOS, então o par vontade antes/depois fica salvo **só no aparelho** (IndexedDB).
- **CA-7:** Dado que o app foi aberto uma vez, quando fico sem internet, então o app, o SOS e a crise continuam abrindo.

## 6. Acessibilidade
Botões nativos com rótulo; régua 0–10 como grupo de botões grandes (≥ 44 px) com `aria-pressed`; foco visível; contraste AA; timer anunciado sem tique-taque (`aria-live` só nos marcos); animação desligada com `prefers-reduced-motion`.

## 7. Conteúdo e mensagens
Textos de [microcopy](../../docs/02-produto/microcopy.md) (F2 e F3), guardados em `web/src/content/`. Textos 🩺 marcados para revisão clínica.

## 8. Fora do escopo
Onboarding, plano Se/Então, Círculo de Confiança, plano de segurança editável, PIN e criptografia (próximos módulos). Sem login e sem Supabase neste módulo.

## 9. Conformidade com o edital (Seção 8.4)
- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma (teste automatizado de vocabulário)
- [x] Informações sensíveis com fonte e data (arquivo de conteúdo)
- [x] Só dados sintéticos ou do próprio usuário, guardados no aparelho

## 10. Dúvidas em aberto
- [PRECISA ESCLARECER: link oficial para localizar CAPS — por ora só orientação em texto, sem link]
