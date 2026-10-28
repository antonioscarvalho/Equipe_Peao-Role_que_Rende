# Spec 008 — Configurações, Privacidade e Acessibilidade

- **Estado:** 📝 rascunho (criada na revisão de 27/10/2026 para cobrir o fluxo F10, que não tinha spec)
- **Autor(es):** Maykon Júnio (com apoio de IA)
- **Aprovada por:** _—_ em _aaaa-mm-dd_
- **Prioridade:** Must
- **Responsável:** Maykon Júnio
- **Issue:** [#16](https://github.com/antonioscarvalho/equipepeao/issues/16) · **Fluxo:** [F10](../../docs/02-produto/fluxos.md)

## 1. Contexto e problema

Dados de saúde são **dados sensíveis** (LGPD, art. 5º, II, e art. 11). A skill `design-etico-saude-digital` exige uso sem cadastro, dados no aparelho, **exportar e apagar tudo com 1 ação**, PIN opcional e cuidado com outra pessoa da casa abrindo o celular. O edital dá até **5% de bônus** a recursos de acessibilidade efetivos **e demonstrados** no pitch. O fluxo F10 reúne tudo isso, mas nenhuma spec o cobria.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar (confiança para usar o app no dia a dia)
- [ ] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [x] Acessar ajuda especializada (o app é acessível a quem tem baixa visão ou dificuldade de leitura)

## 3. Persona e cenário

- **Personas:** **Marcos**, que tem medo de a família ver o app; **Dona Célia**, que lê melhor com letra grande ([personas](../../docs/02-produto/publico-e-personas.md)).
- **Cenário:** Marcos protege o app com PIN e deixa o nome neutro; Dona Célia aumenta o texto e liga o alto contraste.

## 4. Histórias de usuário

- Como **Marcos**, quero proteger o app com um PIN e deixá-lo discreto na tela do celular.
- Como **Marcos**, quero baixar ou apagar todos os meus dados quando eu quiser.
- Como **Dona Célia**, quero aumentar o texto e ver tudo com mais contraste.
- Como pessoa sensível a movimento, quero desligar as animações.

## 5. Critérios de aceite

- **CA-1:** Dado as configurações, então há **Tamanho do texto** com 3 níveis (normal, grande, maior); ao trocar, todas as telas mudam na hora e nada fica cortado em 360 px de largura.
- **CA-2:** Dado **Alto contraste** ligado, então todos os textos ficam com contraste **≥ 7:1** e nada depende só de cor.
- **CA-3:** Dado **Reduzir animações** ligado (ou `prefers-reduced-motion` no aparelho), então nenhuma animação roda; a respiração mostra só o texto "Inspire / Solte".
- **CA-4:** Dado **Proteger com PIN** (4 números, opcional), quando ligado, então o app pede o PIN ao abrir, **exceto** o botão "Preciso de ajuda agora", que continua acessível **sem PIN**.
- **CA-5:** Dado **Modo discreto**, quando ligado, então o app passa a usar nome e ícone neutros onde o sistema permitir, e nenhum texto de notificação cita apostas, dívidas ou vício.
- **CA-6:** Dado **Baixar meus dados**, quando a pessoa toca, então recebe um arquivo com todos os seus registros, plano, contatos e preferências.
- **CA-7:** Dado **Apagar tudo**, quando a pessoa confirma numa única tela de confirmação, então todos os dados do aparelho são apagados e o app volta às boas-vindas.
- **CA-8:** Dado a seção **Sobre**, então ela diz quem fez o app, a base científica, que ele não substitui atendimento profissional e que os textos clínicos ainda passam por revisão.
- **CA-9:** Dado qualquer tela do app, então a navegação funciona só pelo teclado, com foco visível, e os alvos de toque têm pelo menos 44×44 px.

## 6. Acessibilidade

Esta spec é a fonte dos recursos de acessibilidade do app. Ela deve ser **demonstrável no pitch** (bônus de até 5%): tamanho do texto, alto contraste, reduzir animações e navegação por teclado. Ver [acessibilidade](../../docs/03-design/acessibilidade.md).

## 7. Conteúdo e mensagens

- [Microcopy](../../docs/02-produto/microcopy.md), seções F1 (tela 5, PIN) e Configurações.
- *"Isso apaga seus registros deste celular e não dá pra desfazer."*

## 8. Fora do escopo

- Conta, login ou sincronização entre aparelhos.
- Recuperação de PIN esquecido (só "apagar tudo e recomeçar").
- Analytics ou telemetria.

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte (LGPD)
- [x] Só dados do próprio usuário, no aparelho

## 10. Dúvidas em aberto

- [PRECISA ESCLARECER: o PIN precisa também criptografar os dados no aparelho ou só bloquear a abertura do app no protótipo?]
- [PRECISA ESCLARECER: o texto de consentimento para dados de saúde (LGPD art. 11) precisa de revisão jurídica?]
