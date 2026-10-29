# Mapa de escolhas

Entre capítulos a história é **linear** (cap. 1 → … → cap. 6 → epílogo): cada capítulo destrava ao jogar o anterior, nunca por sorte. O cap. 6 também pode abrir depois de um check-in de lapso (`narrativa-broto.md`).

Dentro de cada capítulo, as escolhas são **gargalos**: mudam só a próxima fala do Broto e voltam ao mesmo caminho. Nada é salvo, então nenhuma escolha pode ser lida por um capítulo seguinte. **Não crie flag que atravesse capítulos.**

| Capítulo | Escolha | Opções | Volta para | Abre crise? |
|---|---|---|---|---|
| 1 | Perguntas da pessoa | 3, opcionais, qualquer ordem | Pergunta do Broto | Não |
| 1 | "Você já quis resolver tudo de uma vez só?" | Já · Não sei · Prefiro não responder | Lição | Não |
| 3 | "Se fosse você… o que faria com a luz que sobrou?" | Guardava · Tentava recuperar · Não sei · Prefiro não responder | Oferta (Dinheiro protegido) | Não |

Toda pergunta do Broto ganha, na base, a opção "Prefiro não responder". Opção que sinalize sofrimento forte ("não aguento mais") leva `abreCrise: true`.
