# Spec 007 — Demonstração de Open Finance com dados sintéticos

- **Estado:** 📝 rascunho (criada na revisão de 27/10/2026, a partir do antigo CA-6 da spec 004)
- **Autor(es):** Maykon Júnio (com apoio de IA), a partir do texto de Ian Costa Guimarães
- **Aprovada por:** _—_ em _aaaa-mm-dd_
- **Prioridade:** Could
- **Responsável:** _a definir_
- **Issue:** [#15](https://github.com/antonioscarvalho/equipepeao/issues/15)

## 1. Contexto e problema

A [visão do produto](../../docs/02-produto/visao-do-produto.md) propõe o Open Finance como diferencial: mostrar, sem esforço manual, quanto dinheiro a pessoa preservou. A [matriz](../../docs/02-produto/matriz-conceito-funcionalidade.md) (linha 16) classificou isso como **alto risco**: dado financeiro é sensível; "detectar recaída" vira vigilância; com sites ilegais, os intermediários de pagamento mudam o tempo todo; e o edital veda dados de clientes do BB (Seção 8.5). Por isso, no Game Jam, o Open Finance entra **só como demonstração com dados sintéticos**, que mostra o potencial sem nenhum desses riscos.

## 2. Pilar do desafio

- [ ] Enfrentar momentos de vontade de jogar
- [x] Reorganizar a vida financeira
- [ ] Fortalecer redes de apoio
- [ ] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** **Marcos** ([personas](../../docs/02-produto/publico-e-personas.md)).
- **Cenário:** na apresentação à Banca, alguém da equipe mostra como seria ver o dinheiro preservado "automaticamente", com uma conta fictícia.

## 4. Histórias de usuário

- Como **Marcos**, quero entender como uma conexão com meu banco poderia mostrar meu dinheiro preservado sem eu digitar nada.
- Como **Marcos**, quero ter certeza de que nada é conectado sem eu pedir e de que posso desfazer tudo.

## 5. Critérios de aceite

- **CA-1:** Dado o card de dinheiro preservado ([spec 004](../004-contador-e-dinheiro/spec.md)), então o modo **manual** é o padrão e funciona sem nenhuma conexão.
- **CA-2:** Dado a opção "Ver demonstração com conta fictícia", quando a pessoa toca nela, então o app explica em até 3 linhas o que seria compartilhado e pede **confirmação explícita** antes de mostrar a demo.
- **CA-3:** Dado a demonstração ativa, então **toda** a tela mostra o selo **"DEMONSTRAÇÃO — dados fictícios"**, e nenhum dado real, credencial ou nome de banco real é usado.
- **CA-4:** Dado as transações fictícias, então o app mostra só uma **estimativa de dinheiro preservado** e, no máximo, a sugestão neutra *"Quer registrar como foi seu dia?"*; ele **nunca** afirma ter detectado aposta ou recaída.
- **CA-5:** Dado a demonstração ativa, quando a pessoa toca em **"Sair da demonstração"**, então os dados fictícios somem e o app volta ao modo manual.
- **CA-6:** Dado qualquer tela da demo, então não aparecem as marcas Banco do Brasil ou BB enquanto a organização não autorizar.

## 6. Acessibilidade

- O selo "DEMONSTRAÇÃO" é texto (lido pelo leitor de tela), não só cor.
- Valores lidos por extenso pelo leitor de tela.
- Mesmos recursos da [spec 008](../008-configuracoes-privacidade-acessibilidade/spec.md).

## 7. Conteúdo e mensagens

- *"Isto é uma demonstração com dados fictícios. Nada da sua conta é usado."*
- Nunca: "detectamos", "pegamos", "você apostou".

## 8. Fora do escopo

- Conexão real com banco, mesmo de teste com dados de pessoas.
- Detecção automática de aposta ou recaída.
- Marca Banco do Brasil (até autorização).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas (sem BB até autorização)
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte
- [x] Só dados sintéticos

## 10. Dúvidas em aberto

- [PRECISA ESCLARECER: quem fica responsável por esta spec?]
- [PRECISA ESCLARECER: a organização autoriza citar o Banco do Brasil ou o Open Finance do BB no pitch?]
