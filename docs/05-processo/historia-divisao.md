# Divisão da história do Broto

> Definida em 28/10/2026. A história completa está em [narrativa do Broto](../03-design/narrativa-broto.md). Prazo de entrega: 29/10/2026, 11h.

Uma **base comum** e **frentes independentes**: cada pessoa tem a própria pasta e o próprio jogo, para quase não haver conflito de merge.

## Antes de começar

1. **A base sai primeiro.** O componente de diálogo e o progresso dos capítulos ficam com quem faz o capítulo 1. Os outros podem começar já pelo jogo, que não depende da base.
2. **O app publicado (`web/`) não tem as funções que os capítulos oferecem.** Balança decisória, Círculo de Confiança, plano "Se… então…" e pós-lapso estão em `lixo/web-antigo/`. Cada frente traz de lá uma versão simples da função que oferece.

## Responsáveis

| Quem | Entrega | Jogo | Função do app que precisa trazer |
|---|---|---|---|
| **Atyrson** | **Base** e **Cap. 1, A Queda** | Pulo do Bichinho (pronto) | — |
| **Maykon** | **Cap. 2, O Cometa da Sorte** | Desvia dos Cometas (novo) | Balança decisória simples ("o que dá" × "o que custa") |
| **Ian** | **Cap. 3, As Luzes da Casa** | Acende a Casa, jogo da memória (novo) | Link para o "Dinheiro protegido" (`Contador` já existe) |
| **Danillo** | **Cap. 4, O Segredo** e **Cap. 6, Dia Nublado** | Liga as Estrelas (novo) e Rolê de Carrinho (pronto) | Círculo de Confiança simples (contato e mensagem pronta pelo WhatsApp) e fluxo pós-lapso |
| **Antonio** | **Cap. 5, O Sinal**, **Epílogo** e **integração final** | Monta o Farol (novo; usa as folhas de todos os jogos) | Plano "Se… então…", CVV 188 e autoexclusão |

Por quê:
- **Maykon** fez a skill de gamificação ética, e o Desvia dos Cometas é o jogo que mais corre risco de lembrar aposta.
- **Ian** fez a parte visual e o Bichinho no app; o capítulo 3 é visual (casa, lâmpadas, família).
- **Danillo** escreveu a spec do check-in e do pós-lapso e a skill de acessibilidade; o capítulo 4 é o jogo calmo e sem tempo.
- **Antonio** faz os merges do repositório; o Farol e o epílogo juntam o que todo mundo fez.
- O **Rolê de Carrinho** é um jogo de equilíbrio em que o carrinho escorrega e continua, por isso combina com o capítulo 6.

## Contrato

A base define este formato. Quem mudar o contrato avisa no grupo.

### Pastas

| Caminho | Dono |
|---|---|
| `web/src/historia/Dialogo.tsx`, `Historia.tsx`, `progresso.ts`, `tipos.ts`, `useModal.ts`, `historia.css` | Base (Atyrson) |
| `web/src/historia/capitulos/capN.ts` | Dono do capítulo |
| `web/src/historia/capitulos/index.ts` | Todos, **uma linha** por capítulo (ex.: `cap2: { capitulo: cap2, jogo: DesviaDosCometas, nomeJogo: "Desvia dos Cometas" },`) |
| `web/src/jogos/<nome>/` (com o CSS próprio) | Dono do jogo |
| `web/src/App.tsx` | Só a base e a integração final (Antonio) |

### Formato de um capítulo

```ts
interface Capitulo {
  id: 'cap1' | 'cap2' | 'cap3' | 'cap4' | 'cap5' | 'cap6' | 'epilogo'
  titulo: string
  falaAbertura: string
  perguntas: { pergunta: string; resposta: string }[]
  perguntaDoBroto: {
    texto: string
    opcoes: { rotulo: string; resposta: string; abreCrise?: boolean }[]
  }
  oferta?: { rotulo: string; acao: string }
  licao: string
}
```

### Formato de um jogo

```ts
interface PropsJogo {
  aoTerminar: (resultado: { folhas: number }) => void
  aoFechar: () => void
  reduzir: boolean
}
```

Partida de cerca de 3 minutos, usando `web/src/partida.ts`.

### Branches e PRs

- Nome: `feat/historia-capN-nome` (ex.: `feat/historia-cap2-cometas`).
- PR para a `development`. Rodar a skill `orquestrar-branches` antes de abrir.
- Antes do PR: `tsc` e build no `web/` passando, e o capítulo testado no navegador.

## Regras para todos

- Textos do capítulo **exatamente** como estão em [narrativa do Broto](../03-design/narrativa-broto.md), marcados com `// REVISÃO CLÍNICA PENDENTE`.
- Toda conversa tem "Agora não". As respostas da pessoa não são salvas.
- Opção com `abreCrise` leva ao protocolo de crise (CVV 188, SAMU 192, contato de confiança).
- Skills obrigatórias: `design-etico-saude-digital`, `seguranca-e-crise`, `entrevista-motivacional` e `acessibilidade-wcag`.
- Sem sorteio, moeda, loja, vidas, derrota ou som de cassino. O Broto nunca morre.
- Registrar o uso de IA em `docs/07-conformidade/declaracao-de-uso-de-ia.md`.

## Ordem e prioridade

1. **Agora:** base e capítulo 1 (Atyrson). Ao mesmo tempo, cada pessoa constrói o seu jogo isolado.
2. **Quando a base entrar na `development`:** cada pessoa liga os textos do seu capítulo.
3. **Para a demo:** capítulos **1 e 2** são obrigatórios. Os capítulos 3 a 6 entram se ficarem prontos; os outros aparecem como "em breve".
4. **No fim:** Antonio integra, Danillo roda a revisão de acessibilidade e de crise em tudo.

## Andamento

| Capítulo | Responsável | Branch | Estado |
|---|---|---|---|
| Base + Cap. 1 | Atyrson | `feat/historia-cap1-queda` | Em revisão (PR) |
| Cap. 2 | Maykon | — | A fazer |
| Cap. 3 | Ian | — | A fazer |
| Cap. 4 | Danillo | — | A fazer |
| Cap. 5 + Epílogo | Antonio | — | A fazer |
| Cap. 6 | Danillo | — | A fazer |
