# Implementação 005 — Plano Se/Então e Círculo de Confiança

- **Spec:** [spec.md](spec.md) · **Plano:** [plano.md](plano.md) · **Tarefas:** [tarefas.md](tarefas.md)
- **Branch:** `feat/005-prevencao-e-circulo-atyrson` (a partir de `development` em `a510791`)
- **Responsável:** Atyrson Souto (com apoio de IA: Kiro CLI, Claude Opus 5.5)
- **Data:** 2026-10-27
- **Estado:** T001–T009, T011 e T012 ✅ · T010 ⬜ bloqueada pela 004

## 1. O que foi implementado

| Tarefa | Commit | Resumo |
|---|---|---|
| T001 | `69d0e4e` | Banco `guardiao` na **versão 3**, com upgrade incremental (`< 1`, `< 2`, `< 3`). O `< 2` cria as stores da 004 (`checkins`, `configuracao`) se ainda não existirem |
| T002 | `07209a9` | Textos do F5 e do F8 em `prevencao.json`; o teste de vocabulário proibido cobre o arquivo novo |
| T003 | `28757cd` | `normalizarTelefone`, `formatarTelefone`, `linkWhatsApp` e `linkSms` |
| T004 | `cc1e38d` | Repositório de gatilhos e planos, com limite de 5 conferido dentro da transação |
| T005 | `076663e` | Repositório do Círculo, com limite de 3 e validação de telefone |
| T006 | `d6620b2` | Rotas `/plano` e `/circulo`, estado `gatilhosIniciais` no `App` e atalhos no Início |
| T007 | `b031125` | Tela "Seu plano": chips de gatilhos + "outro", criador Se/Então com exemplos e limite |
| T008 | `9af8573` | Tela "Seu Círculo": cadastro, edição, remoção, escolha da mensagem e links de WhatsApp/SMS |
| T009 | `c11a15b` | `AcoesDoPlano` no passo "O que dá pra fazer agora?" do SOS, com estado vazio (convite + CVV 188) |
| T011 | `3021586` | Testes de uso só pelo teclado nas duas telas e teste de contraste (8,9:1 nos botões de envio) |
| T012 | `e37c221` | Revisão de conformidade, checklist de conteúdo, declaração de uso de IA e registro do `wa.me` |

> O commit da T007 ficou com um erro de typecheck em `circulo.test.ts`, corrigido no commit da T008.

### Critérios de aceite

| CA | Estado | Onde está a prova |
|---|---|---|
| CA-1 | ✅ | `Plano.test.tsx`: chips com `aria-pressed`, seleção múltipla, campo "outro", persistência ao reabrir |
| CA-2 | ✅ | `Plano.test.tsx` e `prevencao.test.ts`: dois campos, um botão salvar, exemplos, 6º plano recusado |
| CA-3 | ✅ | `AcoesDoPlano.test.tsx` e `Sos.test.tsx`: planos salvos aparecem no passo de ação |
| CA-4 | ✅ | `circulo.test.ts` e `Circulo.test.tsx`: até 3 pessoas, só no aparelho, nenhum `fetch` |
| CA-5 | ✅ | `mensagem.test.ts` e `Circulo.test.tsx`: o envio é sempre `<a href="https://wa.me/…">` ou `sms:` |
| CA-6 | ⬜ | T010. A parte da 005 está pronta: `App.abrirPlano(gatilhos)` e `Plano` com `gatilhosIniciais` (teste em `Plano.test.tsx`) |
| CA-7 | ✅ (SOS) | `AcoesDoPlano.test.tsx` e `Sos.test.tsx`: convite e CVV 188, e o "Próximo" segue. A parte da crise (006) ainda não existe |

### Mudanças em relação ao plano

- **`autocomplete="off"`** nos campos do Círculo, em vez de `name` e `tel`: o dado é de outra pessoa, e o navegador sugeriria o nome e o telefone da dona do aparelho.
- **Gatilhos salvos ao tocar no chip**, sem botão "Salvar gatilhos"; o campo "outro" salva ao sair dele.
- **Componente novo `EnviarMensagem`**, usado pelo Círculo e pelo SOS, para os links de envio ficarem num lugar só.
- **Chips só aparecem depois de carregar** os gatilhos salvos. Antes, um toque rápido era apagado pelo carregamento.
- **Mensagem pronta:** no Círculo a pessoa escolhe entre as duas do microcopy; no SOS vai a padrão ("Tô com vontade de apostar, pode falar comigo?").

## 2. Arquivos

**Novos**

| Arquivo | Para que serve |
|---|---|
| `web/src/lib/prevencao.ts` (+ teste) | Repositório de gatilhos e planos |
| `web/src/lib/circulo.ts` (+ teste) | Repositório do Círculo |
| `web/src/lib/limite.ts` | Erro `LimiteAtingido`, usado pelos dois repositórios |
| `web/src/lib/db.test.ts` | Migração a partir das versões 1 e 2 |
| `web/src/domain/mensagem.ts` (+ teste) | Telefone e links de WhatsApp/SMS |
| `web/src/content/prevencao.json` | Todos os textos das telas novas, os limites e os dados de demo |
| `web/src/app/plano/Plano.tsx` (+ teste) | Tela "Seu plano" |
| `web/src/app/circulo/Circulo.tsx` (+ teste) | Tela "Seu Círculo" |
| `web/src/components/AcoesDoPlano.tsx` (+ teste) | Bloco do passo de ação do SOS |
| `web/src/components/EnviarMensagem.tsx` | Links de WhatsApp e SMS |
| `web/src/components/Chips.tsx` (+ teste) | **Cópia idêntica** da branch 004 |
| `web/src/test/contraste.test.ts` | Contraste das cores dos tokens |
| `docs/revisoes/prevencao-e-circulo.md` | Revisão de conformidade |

**Alterados**

| Arquivo | Mudança |
|---|---|
| `web/src/lib/db.ts` | Versão 3; tipos `Checkin` e `ConfiguracaoFinancas` iguais aos da 004; tipos `GatilhosPessoa`, `PlanoSeEntao`, `ContatoCirculo` |
| `web/src/app/sos/Sos.tsx` | O passo `acoes` usa `<AcoesDoPlano acoes={conteudoSos.acoes} />` (2 linhas entram, 5 saem) |
| `web/src/hooks/useRota.ts`, `web/src/App.tsx` | Rotas `/plano` e `/circulo`; `gatilhosIniciais` só em memória |
| `web/src/app/inicio/Inicio.tsx` | Atalhos "Seu plano" e "Seu Círculo" abaixo do "Bateu a vontade?" |
| `web/src/content/conteudo.ts` / `conteudo.test.ts` | `conteudoPrevencao`, `preencher()` e testes do conteúdo novo |
| `web/src/index.css` | Chips (iguais aos da 004), campos, cartões, links com cara de botão |
| `docs/07-conformidade/*`, `docs/04-tecnico/integracoes-externas.md` | Uso de IA (item 17), `wa.me` e `sms:` registrados, revisão no checklist de conteúdo |

## 3. Dados

Tudo no IndexedDB do aparelho (banco `guardiao`, versão 3). Nada vai para servidor, URL ou log.

| Store | Chave | Conteúdo | Limite |
|---|---|---|---|
| `prevencao` | fixa `'gatilhos'` | gatilhos marcados e o texto do "outro" | — |
| `planos` | `id` (índice `porCriacao`) | `se`, `entao`, datas | 5 |
| `circulo` | `id` (índice `porCriacao`) | `nome`, `telefone` (só dígitos, com 55) | 3 |

Os limites estão em `prevencao.json` e são conferidos no repositório e na tela. `apagarBanco()` já apaga as stores novas.

## 4. O que isso afeta em outras specs

| Spec / dono | Efeito | O que fazer |
|---|---|---|
| **001/003 SOS** (Ian, Antonio) | O passo "O que dá pra fazer agora?" passa a mostrar planos, Círculo, as ações gerais de `sos.json` e, sem dados, convite + CVV 188. Os testes antigos do SOS seguem passando | Aprovar o diff do `Sos.tsx` |
| **004 Contador e dinheiro** (Danillo) | As duas branches mexem em `db.ts`, `useRota.ts`, `App.tsx`, `Inicio.tsx`, `conteudo.ts`, `conteudo.test.ts`, `App.test.tsx` e `index.css`. A simulação de merge deu conflito nesses arquivos, sempre por blocos somados dos dois lados | Quem fizer o merge mantém os dois lados; em `db.ts` vale a versão 3; em `index.css` sai o bloco `.chip` repetido. `Chips.tsx` não conflita |
| **004** | A lista de gatilhos está duplicada em `checkin.json` e `prevencao.json` | Decidir um dono da lista depois do merge |
| **004 → T010** | Falta o botão "Editar meu plano" no `Checkin.tsx`, chamando `abrirPlano(gatilhos)` do `App` | Fazer depois do merge da 004 |
| **006 Crise e hub** | O CA-7 também vale para a crise. `AcoesDoPlano` pode ser reaproveitado | Combinar quando a 006 começar |
| **008 Configurações** | "Apagar tudo" e PIN ainda não têm tela; a tela de privacidade deve citar WhatsApp e SMS como apps de terceiros | Incluir na 008 |
| **002 Guardião** | As telas novas não têm gamificação (de propósito, pela skill `design-etico-saude-digital`). O Guardião pode reconhecer o primeiro plano ou contato, sem pontos | Proposta a combinar com o Ian |

## 5. Pendências

- T010 (CA-6), bloqueada pelo merge da 004.
- Revisão clínica dos textos de `prevencao.json` (`"revisaoClinica": "pendente"`).
- Criptografia local com PIN (mesma pendência do SOS).
- Nota "Seu plano fica só neste celular." na tela do plano (sugestão da revisão).
- Teste com TalkBack e VoiceOver em aparelho real.

## 6. Como verificar

```bash
cd web
npm test          # 225 testes
npm run typecheck
npm run lint
npm run dev
```

No navegador: Início → **Seu plano** (marque chips, crie um plano, use "Carregar exemplo", tente passar de 5) → **Seu Círculo** ("Carregar exemplo" cria o "Irmão (exemplo)", `(61) 90000-0000`; não envie a mensagem) → Início → **Bateu a vontade?** até "O que dá pra fazer agora?". Para ver o estado vazio, apague o IndexedDB `guardiao` no DevTools e recarregue.
