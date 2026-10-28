# Plano 005 — Prevenção de Recaída (Planos Se/Então) e Círculo de Confiança

- **Spec:** [spec.md](spec.md)
- **Estado:** ✅ aprovado
- **Aprovado por:** Atyrson Souto em 2026-10-27
- **Autor:** Atyrson Souto (com apoio de IA)

## 1. Abordagem

Duas telas novas no `web/` (React + Vite, PWA), sem backend e sem dependência nova:

- **Seu plano** (`/plano`, fluxo F5): a pessoa marca os gatilhos em chips e cria até 5 planos com dois campos ("Se…" e "Então eu vou…").
- **Seu Círculo de Confiança** (`/circulo`, fluxo F8): até 3 contatos (nome e telefone). O botão "Enviar pelo meu WhatsApp" (ou SMS) só **abre** o app de mensagens da pessoa com o texto pronto.

Tudo fica no IndexedDB do aparelho, no mesmo banco `guardiao` das specs 001 e 004, numa nova versão (3). Os planos e os contatos aparecem no passo "O que dá pra fazer agora?" do SOS (CA-3). Quando ainda não existem, o SOS mostra um convite e o CVV 188 (CA-7). O pós-lapso da spec 004 abre o editor com o gatilho já marcado (CA-6).

**Reaproveita:** `Botao`, `LinkTelefone`, `Chips` (da 004), `idb`, o padrão de repositório local (`episodiosSos.ts`), o padrão de foco no título a cada passo (da 004) e o teste de vocabulário proibido (`conteudo.test.ts`).

## 2. Componentes afetados

| Componente / arquivo | Mudança |
|---|---|
| `web/src/lib/db.ts` | alterado: versão 3, stores `prevencao`, `planos`, `circulo` |
| `web/src/lib/prevencao.ts` (+ teste) | novo: repositório de gatilhos e planos (limite de 5) |
| `web/src/lib/circulo.ts` (+ teste) | novo: repositório de contatos (limite de 3) |
| `web/src/domain/mensagem.ts` (+ teste) | novo: normaliza telefone BR e monta os links de WhatsApp e SMS |
| `web/src/content/prevencao.json` | novo: textos do F5 e do F8 (microcopy) e exemplos de ação |
| `web/src/content/conteudo.ts` / `conteudo.test.ts` | alterado: tipos do novo conteúdo; vocabulário proibido cobre `prevencao.json` |
| `web/src/app/plano/Plano.tsx` (+ teste) | novo: gatilhos + criador de planos (CA-1, CA-2, CA-6) |
| `web/src/app/circulo/Circulo.tsx` (+ teste) | novo: cadastro e envio (CA-4, CA-5) |
| `web/src/components/AcoesDoPlano.tsx` (+ teste) | novo: bloco usado no passo de ação do SOS (CA-3, CA-7) |
| `web/src/app/sos/Sos.tsx` | alterado: passo `acoes` passa a usar `AcoesDoPlano` (combinar com Ian e Antonio, donos da 001/003) |
| `web/src/app/checkin/Checkin.tsx` | alterado: botão "Editar meu plano" no passo `plano` (combinar com Danillo, dono da 004) |
| `web/src/hooks/useRota.ts`, `web/src/App.tsx` | alterado: rotas `/plano` e `/circulo`; estado `gatilhosIniciais` no `App` |
| `web/src/app/inicio/Inicio.tsx` | alterado: atalhos "Seu plano" e "Seu Círculo" |
| `web/src/index.css` | alterado: estilos dos formulários e cartões de plano/contato |

## 3. Modelo de dados

Tudo em IndexedDB local (banco `guardiao`). Nada sai do aparelho. "Apagar tudo" (`apagarBanco`) já remove essas stores.

```ts
// store 'prevencao' (chave fixa 'gatilhos')
interface GatilhosPessoa { selecionados: string[]; outro?: string; atualizadoEm: string }

// store 'planos' (keyPath 'id'), no máximo 5
interface PlanoSeEntao { id: string; se: string; entao: string; criadoEm: string; atualizadoEm: string }

// store 'circulo' (keyPath 'id'), no máximo 3 — dado de terceiro (LGPD)
interface ContatoCirculo { id: string; nome: string; telefone: string /* só dígitos, com 55 */; criadoEm: string }
```

**Versão do banco:** a 004 (branch `feat/004-contador-e-dinheiro`) usa a versão 2. A 005 usa a **versão 3**, com o mesmo padrão de upgrade incremental (`if (versaoAnterior < 3) { … }`). Assim, quem já usa o app não perde nada, em qualquer ordem de merge.

**Gatilhos:** a lista de chips é a mesma do pós-lapso da 004 (`checkin.json`), para o gatilho marcado lá aparecer selecionado aqui (CA-6). O "outro" vira um campo de texto livre.

**Dados sintéticos para a demo:** um plano "Se for dia do pagamento, então eu vou pagar as contas antes de abrir o celular" e um contato "Irmão (exemplo)" com o telefone fictício `(61) 90000-0000`. Ficam num botão "Carregar exemplo" que só aparece no build de desenvolvimento (`import.meta.env.DEV`), nunca por parâmetro de URL (ver riscos).

## 4. Fluxo

```
INÍCIO ──► [Seu plano] ──► /plano
              1. Gatilhos: chips (seleção múltipla) + "Outro" (texto livre)       CA-1
              2. Planos: lista + [Novo plano] → campos "Se…" / "Então eu vou…"    CA-2
                 exemplos prontos (caminhar, ligar pra alguém, ouvir música)
                 ao chegar em 5: "Dá pra ter até 5 planos. Edite ou apague um."
       └──► [Seu Círculo] ──► /circulo
              1. Até 3 contatos (nome + telefone)                                 CA-4
              2. Por contato: [Enviar pelo meu WhatsApp] [Enviar por SMS]          CA-5
                 → abre wa.me / sms: com "Tô com vontade de apostar, pode falar comigo?"
                 nota fixa: "A gente nunca manda mensagem sozinho."

SOS passo 5 "O que dá pra fazer agora?" ──► <AcoesDoPlano/>                      CA-3
   com planos/contatos: "Se {se}, então eu vou {entao}" + botões de envio do Círculo
   sem dados: convite "Quer montar seu plano depois?" + CVV 188 (sem travar)      CA-7

Pós-lapso (004) passo "O que dá pra ajustar no seu plano?"
   [Editar meu plano] ──► App guarda gatilhos em memória ──► /plano com chips já marcados   CA-6
```

Nenhuma rota carrega dado da pessoa (`/plano`, nunca `/plano?gatilho=tédio`).

## 5. Dependências, assets e APIs novas

| Item | Tipo | Licença | Registrado com /registrar-asset? |
|---|---|---|---|
| Nenhuma dependência nova | — | — | — |
| `https://wa.me/<número>?text=` | link público do WhatsApp (só abre o app; nenhum dado vai para o nosso servidor) | termos do WhatsApp | ⬜ registrar como "API/link externo" |
| `sms:<número>?body=` | esquema padrão do sistema | — | não se aplica |

## 6. IA no produto

Não há. A IA foi usada só para apoiar a escrita do plano e do código (registrar com `/registrar-uso-ia`).

## 7. Acessibilidade — como será implementada

- Cada campo com `<label>` visível; erros ligados ao campo por `aria-describedby`; foco vai para o primeiro campo com erro.
- A cada passo e ao salvar, o foco vai para o título (padrão da 004) e o aviso sai em `role="status"`.
- Chips com `aria-pressed` (componente `Chips` da 004); alvos de pelo menos 44×44 px.
- Botões de chamada com texto, não só ícone, e contraste de pelo menos 8:1 (azul-escuro `#3333BD` sobre branco = 8,9:1; amarelo sobre azul-escuro = 8,1:1).
- Ordem de tabulação lógica; tudo funciona só pelo teclado.
- Telefone com `type="tel"`, `inputmode="tel"` e `autocomplete="tel"`; nome com `autocomplete="name"`.
- Sem animação nova; respeita "Reduzir animações" (spec 008).

## 8. Riscos e plano B da demo

| Risco | Mitigação |
|---|---|
| A 004 ainda não entrou na `development` e também altera `db.ts`, `useRota.ts`, `App.tsx` e `Inicio.tsx` | Fazer as tarefas que não dependem da 004 primeiro; rebase na `development` assim que a 004 entrar; versão 3 do banco com upgrade incremental. CA-6 só depois do merge |
| Mudar o passo de ação do SOS mexe em código da 001/003 | `AcoesDoPlano` é um componente isolado; a mudança no `Sos.tsx` é de poucas linhas e combinada com Ian e Antonio |
| WhatsApp não instalado ou sem internet na demo | Botão de SMS ao lado; no notebook, `wa.me` abre o WhatsApp Web. Na apresentação, usar o contato fictício e **não** enviar a mensagem |
| Contato fictício na demo virar número real | Usar faixa fictícia `(61) 90000-0000` e o rótulo "(exemplo)". O botão "Carregar exemplo" só aparece em build de desenvolvimento |
| Telefone digitado em formato livre | `normalizarTelefone` aceita máscara, DDD e +55; mensagem de erro clara se não tiver 10 ou 11 dígitos |
| IndexedDB indisponível (navegação anônima) | Mesmo padrão do SOS: salvar é melhor esforço e a tela avisa "Não deu pra salvar neste navegador" |

## 9. Como verificar

| CA | Prova |
|---|---|
| CA-1 | Teste de `Plano`: chips com `aria-pressed`, seleção múltipla e campo "Outro"; gatilhos persistem após recarregar |
| CA-2 | Teste de `Plano` e de `prevencao.ts`: dois campos e um botão salvar; exemplos preenchem o "Então"; o 6º plano é recusado com a explicação |
| CA-3 | Teste de `AcoesDoPlano` e do `Sos`: planos salvos aparecem no passo de ação |
| CA-4 | Teste de `circulo.ts`: o 4º contato é recusado; nada é enviado à rede (sem `fetch`) |
| CA-5 | Teste de `mensagem.ts`: link `https://wa.me/5561900000000?text=T%C3%B4%20com%20vontade…`; o botão é um link (`<a>`), nunca um envio automático |
| CA-6 | Teste do `App`: pós-lapso com "tédio" → "Editar meu plano" → `/plano` com o chip "tédio" marcado; a URL é só `/plano` |
| CA-7 | Teste de `AcoesDoPlano` sem dados: mostra o convite e o CVV 188, e o "Próximo" do SOS continua funcionando |
| Conformidade | `conteudo.test.ts` cobre `prevencao.json`; `/conformidade-legal-br web/src/app/plano web/src/app/circulo` sem ❌ |
