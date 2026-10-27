# Equipe Peão — Rolê que Rende · BBDW 2026

Repositório da **Equipe Peão** no **Rolê que Rende – BBDW 2026**, hackathon oficial da BB Digital Week 2026, no formato Game Jam presencial. A maratona é promovida pelo Banco do Brasil e organizada pela Açaí Valley (Associação Paraense de Tecnologia e Inovação).

- **Quando:** 27, 28 e 29 de outubro de 2026
- **Onde:** Centro de Convenções Ulysses Guimarães, Brasília-DF

---

## 👥 A equipe

| Integrante | GitHub | Perfil principal |
|---|---|---|
| Antonio Carvalho | [@antonioscarvalho](https://github.com/antonioscarvalho) | Produto e Gestão |
| Atyrson Souto | [@Atyrson](https://github.com/Atyrson) | Game Design |
| Danillo Meira | [@danillomeira](https://github.com/danillomeira) | Desenvolvimento |
| Ian Costa Guimarães | [@iancostag](https://github.com/iancostag) | Desenvolvimento |
| Maykon Júnio | [@maykonjuso](https://github.com/maykonjuso) | Arte e Som |
| Vanessa Ramos | [@vanessaramos-byte](https://github.com/vanessaramos-byte) | Narrativa e Conteúdo |

> Perfis previstos no edital (Seção 5.1): **Desenvolvimento** (Técnico), **Game Design** (Visionário), **Arte e Som** (Criativo), **Narrativa e Conteúdo** (Estratégico) e **Produto e Gestão** (Colaborador). Cada equipe tem de 3 a 6 integrantes.

---

## 📚 Documentação

Toda a documentação do projeto está em [`docs/`](docs/README.md): produto, design, parte técnica, processo, entrega e conformidade com o edital.

O desenvolvimento segue **SDD (Spec-Driven Development)** com agentes de IA. As skills ficam em [`.claude/`](.claude/README.md) e as especificações em [`specs/`](specs/README.md).

---

## 🎯 O desafio

As apostas online preocupam cada vez mais a sociedade brasileira. Elas afetam a saúde financeira, emocional e social de milhões de pessoas e famílias, com endividamento, desorganização do orçamento doméstico, rotina prejudicada e vínculos afetivos desgastados.

O objetivo do hackathon é **criar protótipos de produtos ou serviços digitais que apoiem pessoas afetadas pelo uso problemático de apostas online na transição para uma vida sem apostas**, com recursos práticos para:

- 🧠 **enfrentar os momentos de vontade de jogar**;
- 💰 **reorganizar a vida financeira**;
- 🤝 **fortalecer as redes de apoio**;
- 🩺 **acessar ajuda especializada**.

## 💡 Nossa solução

- **Nome:** **Guardião** (o uso de "Rolê que Rende" no nome depende de autorização da organização)
- **Formato:** aplicativo web instalável (PWA), com gamificação ética, que funciona **sem internet e sem cadastro**
- **Público-alvo:** pessoas adultas que apostavam em plataformas digitais e querem parar ou reduzir, em grande parte de baixa renda e com Android simples ([personas](docs/02-produto/publico-e-personas.md))
- **Proposta:** um companheiro calmo que ajuda a atravessar a vontade de apostar, proteger o dinheiro, chamar a rede de apoio e chegar à ajuda especializada, sem nunca punir quem escorrega
- **Jornada do usuário:** boas-vindas e "Seu motivo" → tela inicial com SOS → registro do dia → SOS de fissura → plano e bloqueios → apoio ([jornada](docs/02-produto/jornada-do-usuario.md))
- **Principais funcionalidades** ([spec 001](specs/001-mvp-guardiao/spec.md)):
  - **SOS de fissura** a 1 toque: vontade 0–10, respiração de 10–15 min ("a onda vai passar"), seu motivo, card "Pare e examine", plano ou contato, vontade de novo
  - **Onboarding "Seu motivo"** com Entrevista Motivacional
  - **Plano Se/Então** e mapa de gatilhos
  - **Registro de 1 toque** e fluxo pós-lapso sem punição
  - **Contador** de dias sem apostar (um lapso não zera) e de dinheiro preservado (estimativa ligada a uma meta)
  - **Guardião**, personagem que cresce em marcos anunciados (7, 30, 90 dias) e acolhe nos lapsos
  - **Guia de bloqueio** e barreiras financeiras
  - **Círculo de Confiança** (até 3 contatos, mensagem pronta enviada pela própria pessoa)
  - **Hub de apoio** (CVV, UBS/CAPS, Meu SUS Digital, Jogadores Anônimos, Defensoria/Procon)
  - **Protocolo de crise** com CVV 188 e SAMU 192 a 1 toque de qualquer tela, offline
- **Como medir o impacto:** dias sem apostar por mês, queda da vontade no SOS e uso de ajuda profissional, nunca tempo de tela ([métricas](docs/06-entrega/metricas-de-impacto.md))

> ⚠️ Os textos clínicos (em `web/src/content/`) ainda precisam de **revisão por profissional de psicologia**. O Guardião não faz diagnóstico e não substitui tratamento.

### Acessibilidade

O edital dá até **5% de bônus** a soluções com recursos efetivos de acessibilidade ([detalhes](docs/03-design/acessibilidade.md)):

- [x] Textos alternativos (o Guardião tem descrição para leitor de tela); legendas não se aplicam, porque não há áudio nem vídeo
- [x] Modo de alto contraste
- [ ] Compatibilidade com leitores de tela (implementada; falta testar com NVDA ou TalkBack)
- [x] Modos para daltonismo (nada depende só de cor)
- [x] Navegação por teclado
- [x] Tamanho de texto ajustável e opção de reduzir animações

---

## 🛠️ Tecnologias

React 19 + Vite 8 + TypeScript, como PWA offline (`vite-plugin-pwa`), testes com Vitest e Testing Library. Os dados ficam só no aparelho. Supabase, Expo e o backend em Fastify estão planejados para depois do MVP ([arquitetura](docs/04-tecnico/arquitetura.md), [stack e motivação](docs/04-tecnico/stack-e-motivacao.md)).

### Como executar

```bash
cd web
npm install
npm run dev          # http://localhost:5173  (demo com dados sintéticos: http://localhost:5173/?demo)
npm run check        # typecheck + testes + build
```

Passo a passo completo, deploy e plano B offline em [setup e execução](docs/04-tecnico/setup-e-execucao.md).

---

## ⚠️ Regras de conteúdo (Seção 8.4 do edital)

O tema é sensível e regulado. Por isso, a solução **não pode**:

- promover, incentivar, divulgar ou anunciar apostas, casas de apostas ou jogos de azar, nem de forma indireta;
- integrar-se a plataformas de apostas ou usar dinheiro real, criptoativos ou itens com valor monetário;
- usar mecânicas de sorte, recompensa ou simulação de apostas, **exceto** com finalidade educativa explícita de mostrar os riscos;
- usar marcas, logos ou nomes de casas de apostas, clubes ou atletas sem autorização, nem as marcas Banco do Brasil e BBDW além do que a organização autorizar;
- usar linguagem que estigmatize as pessoas afetadas.

Informações sobre saúde, finanças ou legislação precisam estar corretas e, sempre que possível, citar as fontes.

### Dados, IA e assets de terceiros (Seção 8.5)

- **Dados:** usamos só dados públicos, sintéticos ou fornecidos pela organização. Nenhum dado de cliente, sistema interno ou credencial do Banco do Brasil.
- **IA:** é permitida como apoio, e o uso deve ser declarado na entrega (veja abaixo).
- **Código aberto e assets:** apenas com licença compatível, todos listados abaixo.

#### Declaração de uso de IA, código aberto e assets de terceiros

Veja [docs/07-conformidade/declaracao-de-uso-de-ia.md](docs/07-conformidade/declaracao-de-uso-de-ia.md) e [docs/07-conformidade/licencas-e-assets.md](docs/07-conformidade/licencas-e-assets.md).

---

## 📅 Cronograma do Game Jam

| Dia | Data | Atividades |
|---|---|---|
| 1 | 27/10 (ter) | Credenciamento, abertura, leitura do edital, formação das equipes e início do desenvolvimento |
| 2 | 28/10 (qua) | Desenvolvimento e mentorias |
| 3 | 29/10 (qui) | Finalização até 11h, etapa eliminatória com a Banca (11h–12h), pitches dos finalistas no palco (16h–17h) e premiação (17h–18h) |

## 📦 Entregáveis da etapa eliminatória

- [x] Protótipo demonstrável (`web/`; falta testar em 2 notebooks)
- [ ] Pitch deck em PDF (rascunho em [docs/06-entrega/pitch-deck.pdf](docs/06-entrega/pitch-deck.pdf))
- [ ] Declaração de uso de IA, código aberto e assets de terceiros

**Pitch (3 minutos, sem leitura):** problema e público-alvo; como a solução apoia a pessoa afetada (funcionalidades, jornada e mensagem); demonstração ao vivo ou em vídeo; recursos de acessibilidade; resultados esperados e como medir o impacto.

## 🏆 Critérios de avaliação

| Critério | Peso | O que é avaliado |
|---|---|---|
| Impacto e alinhamento ao desafio | 30% | Se a solução responde de forma clara e efetiva ao problema das apostas online |
| Viabilidade | 30% | Potencial de uso prático, alcance do público-alvo e geração de valor social |
| Inovação | 20% | Originalidade da abordagem, das mecânicas e da experiência |
| Qualidade | 10% | Coerência, acabamento, usabilidade e cumprimento das regras de conteúdo |
| Apresentação e pitch | 10% | Clareza, objetividade e poder de persuasão |

**Bônus:** até 5% por acessibilidade e 5% pela presença de todos os integrantes na apresentação final.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).

Conforme a Seção 11 do edital, os direitos autorais pertencem igualmente aos integrantes da equipe, e o Banco do Brasil recebe uma licença gratuita e não exclusiva para uso institucional, sem fins comerciais e com crédito aos autores.
