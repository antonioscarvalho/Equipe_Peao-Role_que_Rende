# Os 86 critérios da WCAG 2.2, aplicados ao Guardião

Fonte: [WCAG 2.2 (W3C, 2023)](https://www.w3.org/TR/WCAG22/) e o [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/). O 4.1.1 (Análise) foi **removido** na 2.2 e não aparece aqui.

## Como ler a coluna "Aqui"

- **Obrigatório**: bloqueia o PR. Vale para todo critério A e AA **e** para os AAA que este projeto promoveu, marcados com ⬆️, porque o público está em sofrimento, muitas vezes no celular, com atenção e memória reduzidas pela fissura.
- **Meta**: buscar sempre; não bloqueia, mas o relatório diz se passou.
- **Quando houver**: hoje o app não tem esse tipo de conteúdo. **No dia em que tiver, vira Obrigatório** sem discussão. "Não se aplica" sem gatilho escrito não existe.

Coluna **Teste**: 🤖 o `auditar.mjs` pega; 🎨 o `contraste.mjs` mede; ✋ só teste manual (`teste-manual.md`). Script nenhum aprova sozinho.

---

## 1. Perceptível

| SC | Nível | Aqui | O que exige neste app | Teste |
|---|---|---|---|---|
| 1.1.1 Conteúdo não textual | A | Obrigatório | Ilustração do Guardião, bichinho, Lottie e grafismo decorativo: `aria-hidden="true"` (ou `alt=""`). Imagem que informa (estado do bichinho que mostra progresso, gráfico do dinheiro): nome que diz **o que ela comunica**, não o que ela mostra ("Seu broto tem 3 folhas: 3 semanas sem apostar", não "planta verde"). Ícone sozinho num botão: o botão leva `aria-label`. | 🤖 ✋ |
| 1.2.1 Só áudio / só vídeo (gravado) | A | Quando houver | Áudio guiado de respiração ou de urge surfing precisa de **texto equivalente** na tela (as fases já escritas valem, se cobrirem tudo o que o áudio diz). | ✋ |
| 1.2.2 Legendas (gravado) | A | Quando houver | Todo vídeo com fala: `<track kind="captions" srclang="pt-BR">`, legenda revisada à mão, não a automática. Vale também para vídeo do pitch se ele for exibido dentro do app. | 🤖 ✋ |
| 1.2.3 Audiodescrição ou alternativa (gravado) | A | Quando houver | Vídeo cuja imagem informa algo que a fala não diz: audiodescrição ou transcrição completa ao lado. | ✋ |
| 1.2.4 Legendas (ao vivo) | AA | Quando houver | Só se houver transmissão ao vivo (não previsto). | ✋ |
| 1.2.5 Audiodescrição (gravado) | AA | Quando houver | Vídeo informativo: faixa de audiodescrição. | ✋ |
| 1.2.6 Língua de sinais (gravado) | AAA | Meta | Libras é diferencial no Brasil. Widget VLibras depende de CDN e quebra o offline: fica para o "próximos passos" do pitch, não para o protótipo. | ✋ |
| 1.2.7 Audiodescrição estendida | AAA | Quando houver | — | ✋ |
| 1.2.8 Alternativa em mídia (gravado) | AAA | Quando houver | Transcrição completa de todo vídeo. | ✋ |
| 1.2.9 Só áudio (ao vivo) | AAA | Quando houver | — | ✋ |
| 1.3.1 Informações e relações | A | Obrigatório | Um `<h1>` por tela; títulos sem pular nível; grupo de chips em `<fieldset>`+`<legend>` (ou `role="group"` + `aria-labelledby`); lista é `<ul>`; campo ligado ao `<label>`; dica e erro ligados por `aria-describedby`; regiões com `<main>`, `<nav aria-label>`, `<header>`. O que é visual (negrito, cor, posição) tem equivalente na estrutura. | 🤖 ✋ |
| 1.3.2 Sequência com significado | A | Obrigatório | A ordem do DOM é a ordem de leitura. Nada de reordenar com `order`/`flex-direction: row-reverse` se isso trocar o sentido. O "Preciso de ajuda agora" vem **cedo** no DOM. | ✋ |
| 1.3.3 Características sensoriais | A | Obrigatório | Instrução nunca depende só de forma, cor, posição ou som: "toque no botão amarelo à direita" reprova; "toque em **Bateu a vontade?**" passa. | ✋ |
| 1.3.4 Orientação | AA | Obrigatório | Funciona em retrato e paisagem. Nada de travar orientação no manifest (`"orientation"` fora, ou `"any"`). | ✋ |
| 1.3.5 Identificar a finalidade da entrada | AA | Obrigatório | Campo com dado **da própria pessoa**: `autoComplete` correto (`name`, `tel`, `email`). Telefone de **outra pessoa** (Círculo de Confiança) não entra na regra, e `autoComplete="off"` ali está certo. PIN: `autoComplete="current-password"` ou `one-time-code`. | 🤖 ✋ |
| 1.3.6 Identificar a finalidade | AAA | Meta | Marcos (`<main>`, `<nav>`) e ícones sempre com o mesmo significado. | ✋ |
| 1.4.1 Uso de cor | A | Obrigatório | Estado nunca só por cor: chip marcado tem `aria-pressed` **e** marca visual (✓ ou borda grossa); erro tem texto; dia do contador com e sem aposta se distingue por forma ou rótulo; aba ativa tem `aria-current` e sublinhado/forma. Link no meio do texto: sublinhado. | ✋ |
| 1.4.2 Controle de áudio | A | Obrigatório | Som que toca sozinho por mais de 3 s: proibido. Som só por ação da pessoa, com botão de parar e volume. | 🤖 ✋ |
| 1.4.3 Contraste (mínimo) | AA | Obrigatório | Texto ≥ 4,5:1; texto grande (≥ 24 px, ou ≥ 18,66 px em negrito) ≥ 3:1. Inclui placeholder, texto de botão desabilitado **que ainda informa**, texto sobre imagem/gradiente (medir no pior ponto). | 🎨 ✋ |
| 1.4.4 Redimensionar texto | AA | Obrigatório | Até 200% de zoom e com a fonte do navegador em "muito grande": nada cortado, sobreposto ou escondido. Viewport sem `user-scalable=no`/`maximum-scale`. Fonte em `rem`, não `px`. Os três níveis de "Tamanho do texto" da spec 008 testados em 360 px. | 🤖 ✋ |
| 1.4.5 Imagens de texto | AA | Obrigatório | Texto é texto. Exceção: logotipo. Frase dentro de PNG/SVG de ilustração reprova. | ✋ |
| 1.4.6 Contraste (aprimorado) | AAA | ⬆️ Obrigatório no alto contraste e na crise | No tema `data-contraste="alto"` todo texto ≥ 7:1 (spec 008, CA-2). Nas telas **SOS e Crise**, em qualquer tema, texto ≥ 7:1: é onde a pessoa está mais abalada. `contraste.mjs --minimo 7`. | 🎨 |
| 1.4.7 Áudio de fundo baixo ou ausente | AAA | Meta (quando houver) | Áudio com fala: música de fundo 20 dB abaixo, ou sem música. | ✋ |
| 1.4.8 Apresentação visual | AAA | ⬆️ Obrigatório | Linha de texto ≤ 80 caracteres (`max-width: 65ch` no corpo); sem `text-align: justify`; entrelinha ≥ 1,5; parágrafo com espaço ≥ 1,5× a entrelinha; texto não some com zoom de 200% sem rolagem horizontal. Cor de fundo/texto escolhível = o tema de alto contraste. | ✋ |
| 1.4.9 Imagens de texto (sem exceção) | AAA | Meta | Só o logotipo pode ser imagem. | ✋ |
| 1.4.10 Refluxo | AA | Obrigatório | Em 320 px de largura (= 1280 px com zoom de 400%): sem rolagem horizontal, nada cortado. Exceção só para conteúdo que precisa de duas dimensões (nenhum hoje). | 🤖 ✋ |
| 1.4.11 Contraste não textual | AA | Obrigatório | Borda de campo, contorno de botão sem fundo, trilho e botão do interruptor, marca do chip, anel de foco, ícone que é a única pista: ≥ 3:1 contra o vizinho. Estado (marcado/desmarcado, ativo/inativo) também ≥ 3:1 entre si ou com outra pista. | 🎨 ✋ |
| 1.4.12 Espaçamento de texto | AA | Obrigatório | Com entrelinha 1,5, entre parágrafos 2×, entre letras 0,12em e entre palavras 0,16em (bookmarklet do `teste-manual.md`): nada cortado nem sobreposto. Proibido altura fixa em caixa de texto e `white-space: nowrap` + `overflow: hidden` em texto que importa. | 🤖 ✋ |
| 1.4.13 Conteúdo em hover ou foco | AA | Obrigatório | Dica que aparece no hover/foco: some com Esc, deixa o ponteiro ir até ela, fica até a pessoa sair. Melhor ainda: não usar tooltip; texto visível. | 🤖 ✋ |

## 2. Operável

| SC | Nível | Aqui | O que exige neste app | Teste |
|---|---|---|---|---|
| 2.1.1 Teclado | A | Obrigatório | Tudo pelo teclado: SOS, régua de vontade (setas), chips (Espaço), interruptores, abas, fechar modal (Esc), timer (pausar/parar). Nada de `div` clicável. | 🤖 ✋ |
| 2.1.2 Sem armadilha de teclado | A | Obrigatório | Modal prende o foco **enquanto aberto** e devolve ao fechar; nenhum lugar de onde o Tab não sai. | ✋ |
| 2.1.3 Teclado (sem exceção) | AAA | ⬆️ Obrigatório | Nada depende do ritmo do teclado. A régua de vontade aceita setas e Home/End, não só arrasto. | ✋ |
| 2.1.4 Atalhos de uma tecla | A | Obrigatório | Se houver atalho de uma letra (ex.: `S` abre SOS): dá para desligar ou remapear, ou só vale com o foco no controle. Melhor não ter. | 🤖 ✋ |
| 2.2.1 Tempo ajustável | A | Obrigatório | Nenhum conteúdo some ou avança sozinho por tempo. O timer da onda é a atividade em si: tem **Pausar**, **Parar** e "mais 5 min". Mensagem de status que some sozinha: proibido (fica até a próxima ação). | ✋ |
| 2.2.2 Pausar, parar, ocultar | A | Obrigatório | Movimento que começa sozinho e dura mais de 5 s ao lado de outro conteúdo (bichinho respirando, piscar, balançar, círculo da respiração, brilho do esqueleto por muito tempo): para com "reduzir animações" e tem controle de pausa quando é parte da tela. | 🤖 ✋ |
| 2.2.3 Sem tempo | AAA | ⬆️ Obrigatório | Nenhuma tarefa tem prazo. O fim do timer não leva a pessoa a lugar nenhum sozinho (ver 3.2.5). | ✋ |
| 2.2.4 Interrupções | AAA | ⬆️ Obrigatório | Sem pop-up, toast que rouba o foco, pedido de avaliação ou notificação interna no meio de uma tarefa. Combina com a skill `design-etico-saude-digital`. | ✋ |
| 2.2.5 Reautenticação | AAA | ⬆️ Obrigatório | Se o PIN pedir de novo (spec 008), nada do que a pessoa estava preenchendo se perde. | ✋ |
| 2.2.6 Tempos limite | AAA | ⬆️ Obrigatório | Nenhuma perda de dado por inatividade. Rascunho de plano e relato persistem. | ✋ |
| 2.3.1 Três flashes ou abaixo do limite | A | Obrigatório | Nada pisca mais de 3 vezes por segundo. Confete, brilho, "pop" de conquista: conferir no quadro a quadro. | ✋ |
| 2.3.2 Três flashes | AAA | ⬆️ Obrigatório | Nenhum flash acima de 3/s, mesmo pequeno. Público ansioso; e é o oposto do cassino. | ✋ |
| 2.3.3 Animação a partir de interações | AAA | ⬆️ Obrigatório | `prefers-reduced-motion: reduce` **liga** o "reduzir animações" do app na primeira abertura; o CSS tem o `@media`; o toggle do app manda mais que o sistema só se a pessoa mexer nele. Com redução: nada se move, a respiração mostra só o texto (spec 008, CA-3), confete não aparece, Lottie fica parado. | 🤖 ✋ |
| 2.4.1 Ignorar blocos | A | Obrigatório | Link "Pular para o conteúdo" como primeiro foco, ou `<main>` com marco + `<h1>` (o leitor pula por marco). Com cabeçalho e barra de abas fixos, o link de pular é exigido. | ✋ |
| 2.4.2 Página com título | A | Obrigatório | Cada rota muda `document.title`: "Bateu a vontade · Guardião", "Preciso de ajuda agora · Guardião". Em **modo discreto** (spec 008), título neutro sem citar aposta. | 🤖 ✋ |
| 2.4.3 Ordem do foco | A | Obrigatório | Foco segue a leitura; ao trocar de tela, vai para o `<h1>` (`tabIndex={-1}`); ao fechar modal, volta para quem abriu; sem `tabIndex` positivo. | 🤖 ✋ |
| 2.4.4 Finalidade do link (em contexto) | A | Obrigatório | "Ligar para o CVV 188", não "clique aqui". Link `tel:` diz o número e quem atende. | ✋ |
| 2.4.5 Várias formas | AA | Obrigatório | Conjunto de telas: chega-se a cada uma por mais de um caminho (barra de abas + atalhos da tela inicial). Exceção: tela que é passo de fluxo (pós-lapso). | ✋ |
| 2.4.6 Cabeçalhos e rótulos | AA | Obrigatório | Título diz o assunto da tela; rótulo diz o que o campo quer ("Quanto você gastava por semana, mais ou menos?"). | ✋ |
| 2.4.7 Foco visível | AA | Obrigatório | Todo controle mostra foco com `:focus-visible`, contorno ≥ 2 px e ≥ 3:1 contra o fundo **em todos os fundos onde o controle aparece** (amarelo, branco, azul-escuro). `outline: none` sem substituto reprova. | 🤖 🎨 ✋ |
| 2.4.8 Localização | AAA | Meta | Aba ativa com `aria-current="page"`; título da tela sempre visível. | ✋ |
| 2.4.9 Finalidade do link (só o link) | AAA | Meta | O texto do link sozinho já diz aonde vai. | ✋ |
| 2.4.10 Cabeçalhos de seção | AAA | Meta | Tela com mais de um bloco: cada bloco com `<h2>`. | ✋ |
| 2.4.11 Foco não encoberto (mínimo) | AA | Obrigatório | Cabeçalho fixo e barra de abas fixa não cobrem o controle focado: `scroll-padding-top`/`-bottom` no `html` com a altura deles. | 🤖 ✋ |
| 2.4.12 Foco não encoberto (aprimorado) | AAA | ⬆️ Obrigatório | Nem parte do controle focado fica escondida. Mesma correção, com folga. | ✋ |
| 2.4.13 Aparência do foco | AAA | ⬆️ Obrigatório | Indicador com área ≥ contorno de 2 px em volta do controle e ≥ 3:1 entre focado e não focado. O `outline: 3px` atual cumpre a área; a cor precisa cumprir o 3:1 em cada fundo. | 🎨 ✋ |
| 2.5.1 Gestos de ponteiro | A | Obrigatório | Nada exige gesto de vários dedos ou de trajeto (pinça, deslizar). Deslizar entre abas, se existir, tem botão equivalente. | 🤖 ✋ |
| 2.5.2 Cancelamento do ponteiro | A | Obrigatório | Ação dispara no **soltar** (`click`), não no `pointerdown`/`touchstart`. Arrastar o dedo para fora cancela. O SOS também, mesmo com a pressa. | ✋ |
| 2.5.3 Rótulo no nome | A | Obrigatório | O nome acessível **contém** o texto visível, no começo: botão "Bateu a vontade?" não pode ter `aria-label="Abrir SOS"` (quem usa comando de voz fala o que vê). | 🤖 ✋ |
| 2.5.4 Acionamento por movimento | A | Obrigatório | Nada por chacoalhar/inclinar sem alternativa e sem jeito de desligar. | 🤖 |
| 2.5.5 Tamanho do alvo (aprimorado) | AAA | ⬆️ Obrigatório | Alvo ≥ 44×44 CSS px (o projeto usa `--alvo-toque: 48px`). Vale para chip, interruptor, X de fechar, link de telefone, ícone da barra de abas. Exceção: link no meio de um parágrafo. | ✋ |
| 2.5.6 Mecanismos de entrada concorrentes | AAA | ⬆️ Obrigatório | Toque, mouse, teclado e caneta funcionam juntos; nada desliga o teclado porque detectou toque. | ✋ |
| 2.5.7 Movimentos de arrastar | AA | Obrigatório | Régua de vontade, reordenar plano, qualquer slider: alternativa com toques simples (botões − / +, setas). | 🤖 ✋ |
| 2.5.8 Tamanho do alvo (mínimo) | AA | Obrigatório | Coberto pelo 2.5.5 acima. | ✋ |

## 3. Compreensível

| SC | Nível | Aqui | O que exige neste app | Teste |
|---|---|---|---|---|
| 3.1.1 Idioma da página | A | Obrigatório | `<html lang="pt-BR">`. | 🤖 |
| 3.1.2 Idioma das partes | AA | Obrigatório | Termo em outra língua que o leitor deve pronunciar como estrangeiro: `<span lang="en">urge surfing</span>`. Prefira traduzir ("surfar a vontade"). | ✋ |
| 3.1.3 Palavras incomuns | AAA | ⬆️ Obrigatório | Termo técnico explicado na primeira vez, na tela: "urge surfing", "gatilho", "lapso", "autoexclusão", "Open Finance". | ✋ |
| 3.1.4 Abreviações | AAA | ⬆️ Obrigatório | Sigla por extenso na primeira vez em cada tela: "CVV (Centro de Valorização da Vida)", "CAPS (Centro de Atenção Psicossocial)", "SAMU 192". Na crise, o nome por extenso fica no próprio botão. | ✋ |
| 3.1.5 Nível de leitura | AAA | ⬆️ Obrigatório | Linguagem simples: frase curta, voz ativa, palavra do dia a dia; alvo de quem terminou o ensino fundamental. Ver `docs/03-design/conteudo-e-tom-de-voz.md` e `cognitivo-e-crise.md`. | ✋ |
| 3.1.6 Pronúncia | AAA | Meta | — | ✋ |
| 3.2.1 Em foco | A | Obrigatório | Receber foco não muda nada (não abre, não navega, não envia). | ✋ |
| 3.2.2 Em entrada | A | Obrigatório | Marcar chip, mexer na régua ou digitar não troca de tela nem envia. Avanço só por botão. | ✋ |
| 3.2.3 Navegação consistente | AA | Obrigatório | Cabeçalho, "Preciso de ajuda agora" e barra de abas no mesmo lugar e na mesma ordem em toda tela. | ✋ |
| 3.2.4 Identificação consistente | AA | Obrigatório | Mesma função, mesmo nome e mesmo ícone em todo lugar ("Preciso de ajuda agora" não vira "SOS crise" noutra tela). | ✋ |
| 3.2.5 Mudança mediante solicitação | AAA | ⬆️ Obrigatório | Nada muda de contexto sozinho: fim do timer **mostra o resultado na mesma tela** e a pessoa escolhe para onde ir; link que abre outra aba/app (WhatsApp, telefone) diz isso antes. | 🤖 ✋ |
| 3.2.6 Ajuda consistente | A | Obrigatório | "Preciso de ajuda agora" no mesmo lugar relativo em todas as telas, inclusive atrás do PIN (spec 008, CA-4). | ✋ |
| 3.3.1 Identificação de erro | A | Obrigatório | Erro em texto, perto do campo, ligado por `aria-describedby`, campo com `aria-invalid`; foco vai para o primeiro campo com erro; anúncio por `role="alert"` só no erro de envio. | ✋ |
| 3.3.2 Rótulos ou instruções | A | Obrigatório | Todo campo com `<label>` visível; formato esperado dito antes ("só números, com DDD"); placeholder não substitui rótulo. | 🤖 ✋ |
| 3.3.3 Sugestão de erro | AA | Obrigatório | O erro diz como corrigir: "Escreva só números, como 150" e não "Valor inválido". Sem culpa (ver tom de voz). | ✋ |
| 3.3.4 Prevenção de erro (jurídico, financeiro, dados) | AA | Obrigatório | Apagar tudo, apagar plano, apagar contato, enviar dados: confirmação com o que vai acontecer, ou desfazer. | ✋ |
| 3.3.5 Ajuda | AAA | ⬆️ Obrigatório | Ajuda contextual em todo campo que pede reflexão ("o que é gatilho?") e o caminho para ajuda humana sempre a um toque. | ✋ |
| 3.3.6 Prevenção de erro (todos) | AAA | ⬆️ Obrigatório | Toda ação que apaga ou envia é confirmável ou desfazível, não só as financeiras. | ✋ |
| 3.3.7 Entrada redundante | A | Obrigatório | Nada que a pessoa já disse é pedido de novo no mesmo fluxo (gatilho do pós-lapso chega marcado no plano, sem redigitar). | ✋ |
| 3.3.8 Autenticação acessível (mínimo) | AA | Obrigatório | PIN aceita colar e gerenciador de senha (sem `onPaste` bloqueando, `autoComplete` certo), mostra/oculta dígitos, não tem prazo. | 🤖 ✋ |
| 3.3.9 Autenticação acessível (aprimorada) | AAA | ⬆️ Obrigatório | Além do 3.3.8: crise e "Preciso de ajuda agora" **nunca** passam pelo PIN; esqueci o PIN tem saída que não exige lembrar nada (apagar e recomeçar, com aviso). | ✋ |

## 4. Robusto

| SC | Nível | Aqui | O que exige neste app | Teste |
|---|---|---|---|---|
| 4.1.2 Nome, função, valor | A | Obrigatório | Todo controle com nome, papel e estado expostos: chip = `<button aria-pressed>`; interruptor = `<input type="checkbox" role="switch">` ou `<button role="switch" aria-checked>`; aba = `aria-current` (navegação) ou `role="tab"`+`aria-selected` (abas de conteúdo); régua = `<input type="range">` com `aria-valuetext` ("7, vontade forte"); modal = `<dialog>` com `aria-labelledby`. Estado muda no atributo, não só na classe CSS. | 🤖 ✋ |
| 4.1.3 Mensagens de status | AA | Obrigatório | "Anotado", "Plano salvo", "Contato apagado", troca de fase da respiração: em região `role="status"` **que já existe no DOM antes** da mensagem (criar a região junto com o texto não é anunciado). `assertive` só para risco. | 🤖 ✋ |

---

## Além da WCAG, e que também vale aqui

| Fonte | O que traz | Onde entra |
|---|---|---|
| [ABNT NBR 17225:2025](https://www.abntcatalogo.com.br/) | Norma brasileira de acessibilidade em conteúdo e aplicações web, baseada na WCAG. É a referência técnica que a LBI pede no Brasil. | Citar no pitch e no relatório: atender a WCAG 2.2 AA com as promoções acima cobre o núcleo dela. |
| [Lei 13.146/2015 (LBI)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm), art. 63 | Acessibilidade obrigatória em sítios e aplicações. | Skill `conformidade-legal-br`. |
| [eMAG 3.1](https://emag.governoeletronico.gov.br/) | Modelo de acessibilidade do governo federal: atalhos de teclado (Alt+1 conteúdo, Alt+2 menu…), barra de acessibilidade. | Repertório. Atalho de uma tecla esbarra no 2.1.4: se entrar, com modificador. |
| [W3C COGA: Making Content Usable](https://www.w3.org/TR/coga-usable/) | Acessibilidade cognitiva, que a WCAG cobre pouco. | `cognitivo-e-crise.md`. |
| [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) | Padrão de teclado e ARIA de cada componente (abas, diálogo, switch, slider). | `padroes-react.md`. |
