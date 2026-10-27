# Spec 001 — Onboarding "Seu Motivo" e Companheiro Guardião

- **Estado:** ✅ aprovada
- **Autor(es):** Ian Costa Guimarães
- **Aprovada por:** Equipe Peão em 2026-10-27
- **Prioridade:** Must

## 1. Contexto e problema

Pessoas que enfrentam problemas com apostas online chegam à aplicação em momento de vulnerabilidade, carregando vergonha, culpa e medo de julgamento. Abordagens tradicionais com sermão ou cadastros burocráticos causam abandono imediato. É necessário acolher sem julgar, explicitar os limites da ferramenta (apoio complementar, não tratamento clínico) e evocar a motivação interna da própria pessoa (Entrevista Motivacional), apresentando o Guardião como companheiro empático que nunca pune recaídas.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [ ] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [ ] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona principal:** Marcos, 33 anos, autônomo, usuário de smartphone Android. Aposta na tentativa de complementar a renda e sente vergonha perante a família.
- **Cenário:** Marcos baixa/abre a aplicação após um dia difícil de apostas. Ele precisa se sentir acolhido nos primeiros 60 segundos, sem exigência de criar conta ou expor dados bancários.

## 4. Histórias de usuário

- Como pessoa afetada pelo uso problemático de apostas, quero definir com clareza o motivo pelo qual desejo parar ou diminuir, para que esse motivo me sirva de âncora nos momentos de crise.
- Como pessoa em recuperação, quero um companheiro digital (Guardião) que me acompanhe de forma empática e respeitosa, sem me punir ou fazer sermão quando eu tiver dificuldades.
- Como usuário que ainda não decidiu se quer parar totalmente, quero ter a liberdade de escolher a opção "Ainda não sei", sem ser empurrado para um plano de ação forçado.

## 5. Critérios de aceite

- **CA-1:** O fluxo de onboarding contém no máximo 5 telas rápidas e lineares, permitindo pular etapas não obrigatórias.
- **CA-2:** A tela inicial do onboarding esclarece o papel complementar do aplicativo e contém botão fixo de socorro ("Preciso de ajuda agora") com saída em ≤ 2 toques.
- **CA-3:** A seleção de motivos oferece chips rápidos (família, sono, trabalho, saúde, autoestima, dívidas) e campo opcional de texto livre.
- **CA-4:** A régua de prontidão avalia de 0 a 10 a importância da mudança, usando pergunta aberta da Entrevista Motivacional (*"Por que você escolheu essa nota e não uma menor?"*).
- **CA-5:** O Guardião é introduzido com visual acolhedor, expressando suporte incondicional (sem mecânicas de adoecimento ou morte).
- **CA-6:** Todos os dados informados no onboarding são armazenados exclusivamente na memória local do dispositivo (offline-first).

## 6. Acessibilidade

- Botão de ativação do **Modo Alto Contraste** visível na primeira tela (meta do Edital para bônus de 5%).
- Rótulos acessíveis em todos os botões e seletores (compatível com TalkBack e VoiceOver).
- Área mínima de toque de 48x48px para todos os elementos interativos.
- Navegação por teclado completa e sem armadilhas de foco.

## 7. Conteúdo e mensagens

- Textos curtos, diretos e sem jargões, alinhados a `docs/02-produto/microcopy.md`.
- Linguagem estritamente livre de estigma: evita palavras como "viciado", "derrota" ou "fracasso".
- Tom acolhedor e seguro: *"Você não está sozinho. Vamos dar um passo de cada vez."*

## 8. Fora do escopo

- Exigência de login, senha, e-mail ou CPF.
- Armazenamento em nuvem ou envio de dados a servidores remotos nesta etapa.
- Mecânicas de bichinho virtual punitivo (Tamagotchi que adoece ou chora se o usuário falhar).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas (ou, se simula, é educativo e explícito)
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos ou públicos

## 10. Dúvidas em aberto

- Nenhuma no momento. Fluxo alinhado com `docs/02-produto/fluxos.md` (F1).
