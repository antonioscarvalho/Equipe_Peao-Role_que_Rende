# Spec 001 — MVP do Guardião (caminho da demo)

- **Estado:** 📝 rascunho — **implementado antes da aprovação**, a pedido de Maykon Júnio em 27/10/2026, para ganhar tempo no Game Jam. Precisa de revisão e aprovação de um humano da equipe (Produto e Gestão).
- **Autor(es):** Maykon Júnio, com Claude Code (ver [declaração de uso de IA](../../../docs/07-conformidade/declaracao-de-uso-de-ia.md))
- **Aprovada por:** _—_ em _aaaa-mm-dd_
- **Prioridade:** Must
- **Base:** [matriz conceito → funcionalidade](../../../docs/02-produto/matriz-conceito-funcionalidade.md), seções 3 e 4

## 1. Contexto e problema

Cerca de 7% da população brasileira com 14 anos ou mais está em risco ou com jogo problemático (III LENAD). A taxa chega a 66,8% entre quem aposta em plataformas digitais e a 52,8% entre quem tem renda abaixo de 1 salário mínimo. A vontade de apostar chega em ondas, muitas vezes à noite e no dia do pagamento, e depois de um lapso a pessoa tende a pensar "já estraguei tudo" e apostar mais. Falta uma ferramenta gratuita, discreta e que funcione no celular simples, sem internet e sem cadastro, que acompanhe a pessoa nesses momentos e faça a ponte para a ajuda humana.

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar (SOS, plano, registro pós-lapso)
- [x] Reorganizar a vida financeira (contador de dinheiro preservado, guia de barreiras financeiras)
- [x] Fortalecer redes de apoio (Círculo de Confiança)
- [x] Acessar ajuda especializada (hub de apoio, protocolo de crise)

## 3. Persona e cenário

Persona principal: **Rafael** ([personas](../../../docs/02-produto/publico-e-personas.md)). Cenário da demo: sexta à noite, o salário caiu e tem jogo na TV. Ele abre o Guardião, toca no SOS e atravessa a vontade.

## 4. Histórias de usuário

1. Como **Rafael**, quero dizer com as minhas palavras por que quero mudar, para lembrar disso quando a vontade vier. (#1 Onboarding "Seu motivo")
2. Como **Rafael**, quero um botão de um toque quando bater a vontade, para conseguir esperar a onda passar. (#2 SOS + cards "Pare e examine")
3. Como **Rafael**, quero combinar comigo o que fazer em cada gatilho, para não decidir no impulso. (#3 Plano Se/Então)
4. Como **Rafael**, quero registrar o dia em um toque e, se apostei, entender o que aconteceu sem me sentir julgado. (#4 Registro + pós-lapso)
5. Como **Rafael**, quero ver quantos dias fiquei sem apostar e quanto dinheiro preservei, ligado a algo que importa para mim. (#5 Contador)
6. Como **Rafael**, quero um passo a passo para dificultar as apostas no celular e no banco. (#6 Guia de bloqueio)
7. Como **qualquer pessoa em sofrimento**, quero chegar a ajuda humana em 1 toque de qualquer tela, mesmo sem internet. (#7 Protocolo de crise)
8. Como **Rafael**, quero saber onde buscar ajuda profissional gratuita. (#8 Hub de apoio)
9. Como **Rafael**, quero chamar alguém de confiança com uma mensagem pronta, sem que o app envie nada por mim. (#9 Círculo de Confiança)
10. Como **Rafael**, quero um companheiro que acompanhe minha jornada e me acolha quando eu errar, sem me punir. (#10 Guardião)

## 5. Critérios de aceite

- **CA-1:** Dado que é o primeiro acesso, quando a pessoa abre o app, então vê as boas-vindas com os limites do app (não é emergência, dados só no aparelho) e precisa confirmar antes de guardar respostas.
- **CA-2:** Dado o onboarding concluído, quando a pessoa abre a tela inicial, então o SOS é o primeiro controle da tela e o "Seu motivo" aparece logo abaixo.
- **CA-3:** Dado o SOS, quando a pessoa conclui o fluxo, então o app mostra a vontade antes e depois (0–10) e faz a pergunta direta e **opcional** sobre risco; "Sim" leva ao protocolo de crise.
- **CA-4:** Dado qualquer tela, inclusive antes do onboarding, quando a pessoa toca em "Preciso de ajuda agora", então chega ao protocolo de crise com CVV 188 e SAMU 192 em `tel:`, sem depender de internet.
- **CA-5:** Dado um registro de "Apostei", quando a pessoa salva, então vê "Obrigado por registrar" e os dias sem apostar do período **não** são zerados.
- **CA-6:** Dado texto livre com sinal de risco no pós-lapso, quando a pessoa salva, então o app **oferece** ver opções de ajuda, sem bloquear nem rotular.
- **CA-7:** Dado o contador, quando há gasto semanal informado, então o dinheiro preservado aparece rotulado como **estimativa**.
- **CA-8:** Dado o Guardião, quando a pessoa chega a 7, 30 e 90 dias sem apostar no total, então ele ganha um elemento visual novo, anunciado antes na tela inicial; ele nunca adoece nem some.
- **CA-9:** Dado o Círculo de Confiança, quando a pessoa toca em "Mensagem", então o WhatsApp abre com o texto pronto e **ela** decide enviar.
- **CA-10:** Dado as configurações, quando a pessoa toca em "Apagar tudo" e confirma, então todos os dados do aparelho são apagados.

## 6. Acessibilidade

Contraste AA em todos os pares de cor; navegação completa por teclado com foco visível; link "Pular para o conteúdo"; um `h1` por tela, que recebe o foco ao trocar de tela; régua 0–10 como grupo de rádio; chips com `aria-pressed`; Guardião com descrição para leitor de tela; tamanho de texto ajustável (3 níveis); alto contraste; reduzir animações (e respeito a `prefers-reduced-motion`); alvos de toque de 44–48 px. Detalhes em [acessibilidade](../../../docs/03-design/acessibilidade.md).

## 7. Conteúdo e mensagens

Todos os textos clínicos estão em `web/src/content/*.json`, com fonte e data de verificação, marcados **REVISÃO CLÍNICA PENDENTE**. Mensagens-chave: "Bateu a vontade? Toque aqui"; "A onda vai subir e vai passar"; "Obrigado por registrar. Isso não apaga o que você já conquistou"; "Recomeçar faz parte do processo"; "Você não precisa passar por isso sozinho(a)".

## 8. Fora do escopo

- Open Finance (mesmo sintético), saldo real, micro-lições, organizador de dívidas, mindfulness avulso (Could).
- Agenda de alto risco com notificações e PGSI (Won't agora).
- Supabase, login e sincronização: o MVP é offline-first e sem cadastro.
- App mobile em Expo (o PWA é instalável no Android).
- Criptografia local com PIN (pendência registrada em [dados e privacidade](../../../docs/07-conformidade/dados-e-privacidade.md)).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário (o valor preservado é estimativa digitada pela pessoa)
- [x] Sem marcas proibidas: nome "Guardião", sem logo do BB ou do Rolê que Rende até autorização
- [x] Linguagem sem estigma ([tom de voz](../../../docs/03-design/conteudo-e-tom-de-voz.md))
- [x] Informações sensíveis com fonte (nos arquivos de conteúdo)
- [x] Só dados sintéticos (`?demo`) ou digitados pela própria pessoa, que ficam no aparelho

## 10. Dúvidas em aberto

- [PRECISA ESCLARECER: a organização autoriza "Rolê que Rende" no nome do app?]
- [PRECISA ESCLARECER: quem faz a revisão clínica dos textos de crise e dos cards?]
- [PRECISA ESCLARECER: política de idade (menores de 18 anos), com orientação jurídica]
- [PRECISA ESCLARECER: a plataforma gov.br de autoexclusão continua ativa depois da MP 1.394/2026?]
