---
name: ui-ux-designer
description: Como desenhar e construir tela e componente reutilizável no web (React) e no mobile (Expo): tokens de tema, catálogo de componentes, estados de carga, vazio e erro, acessibilidade e texto. Use antes de criar qualquer tela ou componente visual, e ao revisar tela que ficou inconsistente ou difícil de usar.
---

# UI/UX Designer

O quadro da equipe pede **alta reutilização de componentes para facilitar os agentes de IA**. O motivo: o agente que compõe peças prontas e documentadas acerta muito mais do que o que desenha tela do zero, e o produto fica com uma cara só.

## Passos

1. **Quem, onde, em que momento.** Diga em uma frase quem usa a tela e em que estado está (ver `docs/02-produto/publico-e-personas.md` e `jornada-do-usuario.md`). Pessoa no momento da vontade de apostar tem pressa e pouca paciência: uma ação por tela, a principal grande e no alcance do polegar.
2. **Procure antes de criar.** Leia o catálogo (`web/src/components/README.md` e `mobile/src/components/README.md`). Se a peça existe, use. Se quase existe, acrescente uma prop. Só crie peça nova se nenhuma das duas resolver.
3. **Peça nova é genérica.** Ela não sabe de regra de negócio, recebe tudo por prop e mora em `components/`. Quem conhece "meta", "dívida" ou "apoiador" é a tela.
4. **Desenhe os quatro estados**: carregando (esqueleto com a forma do conteúdo, não girador), vazio (diz o que fazer a seguir), erro (diz o que houve e oferece tentar de novo) e pronto.
5. **Registre a peça** no catálogo com uma linha: nome, para que serve, props principais.
6. Confira acessibilidade com `docs/03-design/acessibilidade.md` e texto com `docs/03-design/conteudo-e-tom-de-voz.md`.

## Tokens

Cor, espaço, raio e fonte saem de `theme/`, nunca escritos direto no componente. A fonte dos valores é a skill `guia-estilo-role-que-rende`: o web importa `assets/tokens.css` dela e o mobile lê `assets/tokens.json`, com os **mesmos nomes** de token nos dois. Paleta, contraste por par de cor, tipografia, grafismo e logo seguem aquela skill, que decide o visual; esta decide reuso e estrutura.

## Regras

- Contraste mínimo WCAG AA: 4,5:1 para texto, 3:1 para borda e ícone de controle.
- Foco visível no web; área de toque de 44×44 no mobile.
- Cor nunca é a única pista: erro tem texto, sucesso tem texto.
- Nada que lembre aposta: sem roleta, sem caça-níquel, sem "tente a sorte", sem contagem de prêmio (Seção 8.4 do edital).
- Animação curta (150 a 250 ms) e desligada com `prefers-reduced-motion`.
