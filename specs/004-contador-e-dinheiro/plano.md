# Plano 004 — Check-in diário, contador de dias e dinheiro preservado

- **Spec:** [spec.md](spec.md)
- **Estado:** ✅ aprovado
- **Aprovado por:** Danillo Meira em 2026-10-27, com as quatro decisões da seção 5: (1) opção **a**; (2), (3) e (4) como propostas

## 1. Abordagem

Em cima do `web/` da spec 001, sem dependência nova. A regra fica em funções puras em `web/src/domain/`, testadas sem tela: o que conta como dia sem apostar, quanto dinheiro foi preservado e o que a simulação de Open Finance enxerga. As telas só mostram o resultado.

O check-in e a estimativa de gasto ficam no IndexedDB do aparelho, no mesmo banco `guardiao` e no mesmo molde do repositório de episódios do SOS (`web/src/lib/episodiosSos.ts`). Nada vai para o Supabase, como decidido em [privacidade e dados locais](../../docs/04-tecnico/privacidade-e-dados-locais.md).

A conta do contador parte do `contador.ts` do protótipo do Maykon (`prototipos/guardiao-maykon/src/domain/contador.ts`), adaptada para o **mês corrente**, que é o que o CA-4 pede.

## 2. Componentes afetados

| Componente / arquivo | Mudança |
|---|---|
| `web/src/domain/datas.ts` | novo: data local `AAAA-MM-DD`, início do mês, dias entre duas datas |
| `web/src/domain/progresso.ts` | novo: dias sem apostar no mês e dinheiro preservado |
| `web/src/domain/openFinance.ts` | novo: lê o extrato sintético e separa os Pix para intermediadora de aposta |
| `web/src/lib/db.ts` | alterado: versão 2 do banco, com as stores `checkins` e `configuracao` |
| `web/src/lib/checkins.ts` | novo: repositório local do check-in (um por dia, o último vale) |
| `web/src/lib/configuracao.ts` | novo: repositório local da estimativa de gasto semanal |
| `web/src/hooks/useProgresso.ts` | novo: lê check-ins e configuração e devolve o progresso do mês, com carregando e erro |
| `web/src/hooks/useRota.ts` | alterado: rotas `/checkin` e `/dinheiro` |
| `web/src/app/inicio/Inicio.tsx` | alterado: card "Como foi hoje?", contador do mês e atalho para o dinheiro preservado |
| `web/src/app/checkin/Checkin.tsx` | novo: fluxo F4 (não apostei · apostei → pós-lapso) |
| `web/src/app/dinheiro/Dinheiro.tsx` | novo: estimativa de gasto, dinheiro preservado em reais ou em metas, painel da simulação |
| `web/src/components/Chips.tsx` | novo e genérico: seleção múltipla com `aria-pressed`, usado pelos gatilhos e reutilizável na 005 |
| `web/src/components/Cartao.tsx` | novo e genérico: bloco com título, para o card do check-in e os painéis |
| `web/src/content/checkin.json` | novo: textos do F4 e lista de gatilhos, iguais aos de `docs/02-produto/microcopy.md` |
| `web/src/content/metas.json` | novo: metas tangíveis com valor de referência e fonte |
| `web/src/content/open-finance-demo.json` | novo: extrato **sintético** de um mês, com destinatários fictícios |

## 3. Modelo de dados

Tudo local, no banco `guardiao` (IndexedDB), que sobe da versão 1 para a 2. O `upgrade` cria só o que falta, para não apagar os episódios do SOS de quem já usou a 001.

```ts
// store 'checkins', chave = data
interface Checkin {
  data: string            // 'AAAA-MM-DD', no fuso do aparelho
  apostou: boolean
  gatilhos?: string[]      // só quando apostou; a 005 lê daqui para o plano Se/Então
  registradoEm: string     // ISO, para saber qual foi o último registro do dia
}

// store 'configuracao', chave = 'financas'
interface ConfiguracaoFinancas {
  gastoSemanalEstimado: number | null   // em reais; null = a pessoa ainda não informou
}
```

O conteúdo das metas e do extrato da simulação é público e sintético. Fica em JSON dentro do build, não no IndexedDB.

```jsonc
// metas.json (valores a conferir na fonte antes do pitch)
{ "metas": [
  { "id": "botijao", "nome": "botijão de gás", "valorReferencia": 0, "fonte": "ANP, preço médio do GLP 13 kg", "link": "…" },
  { "id": "luz", "nome": "conta de luz", "valorReferencia": 0, "fonte": "…", "link": "…" },
  { "id": "compras", "nome": "compras da semana", "valorReferencia": 0, "fonte": "DIEESE, cesta básica", "link": "…" }
] }
```

## 4. Fluxo

```
INÍCIO
 ├─ Card "Como foi hoje?"  [Não apostei] [Apostei]
 │    ├─ Não apostei → grava → "Anotado." (sem som, sem confete) → contador atualiza
 │    └─ Apostei → /checkin
 │         1. "Obrigado por registrar. Isso não apaga o que você já construiu."
 │         2. "O que aconteceu antes?" → Chips de gatilho (opcional)
 │         3. "O que dá pra ajustar no seu plano?" → [Agora não]  ([Editar meu plano] quando a 005 existir)
 │         4. "Este mês você já tem {n} dias sem apostar. Bora retomar o caminho?" → INÍCIO
 │         └─ [Tô mal com isso], em qualquer passo → /ajuda (F3)
 ├─ Contador: "{n} dias sem apostar em {mês}"
 └─ [Dinheiro preservado] → /dinheiro
       ├─ Sem estimativa → "Quanto você costumava gastar por semana?" (valor) → grava
       ├─ Com estimativa → "Estimativa: R$ {x} este mês" ⇄ "Isso dá {k} {meta}"
       └─ "Simulação de Open Finance (dados de exemplo)" → painel do CA-6
```

## 5. Decisões (confirmadas em 2026-10-27)

> **Revisão de 27/10/2026 (spec 004 revisada):** a decisão 1 continua valendo, mas a contagem deixou de ser do mês: o número principal é o total desde o primeiro registro, e o mês e a sequência atual aparecem em texto pequeno. A sequência conta os dias seguidos de "Não apostei" até hoje ou até ontem, e some da tela quando é zero, para não soar como placar perdido. A decisão 2 passou a multiplicar pelo total. A meta é texto livre da pessoa, opcional, gravado junto com o gasto. Tarefa T011.

1. **O que conta como "dia sem apostar".** A spec diz "total de dias sem apostar no mês corrente", e o check-in é opcional. Há dois jeitos de contar:
   - **(a) Só os dias registrados como "Não apostei"** _(recomendado)_. O número é sempre algo que a pessoa afirmou, e o app não inventa dado. A tela mostra "{n} dias sem apostar" e, embaixo, quantos dias do mês ainda não têm registro, sem cobrança.
   - **(b) Dias do mês até hoje menos os dias com "Apostei"**, como no protótipo do Maykon. O número fica mais alto e anima mais, mas conta como sem aposta um dia que a pessoa nunca registrou.
2. **Dinheiro preservado** = (gasto semanal estimado ÷ 7) × dias sem apostar no mês, arredondado para baixo e sempre com a palavra "estimativa" (CDC). Sem estimativa informada, a tela pede o valor em vez de chutar um.
3. **Valores das metas.** São referência pública com fonte (ANP para o botijão, DIEESE para a cesta básica), conferidos e datados em `docs/07-conformidade/fontes-e-referencias.md` antes do pitch. Enquanto não forem conferidos, a tela mostra só a visão em reais.
4. **"Editar meu plano"** depende da spec 005 (Atyrson). Até lá, o passo 3 mostra só "Agora não", e os gatilhos ficam gravados no check-in para a 005 aproveitar.

## 6. Dependências, assets e APIs novas

| Item | Tipo | Licença | Registrado com /registrar-asset? |
|---|---|---|---|
| Nenhuma dependência nova | — | — | — |
| Valores de referência das metas | dado público | fonte citada | ⬜ (registrar em fontes e referências) |

O Open Finance é **só simulação**, com extrato sintético embutido no build. Não há chamada a API, nem à Pluggy nem ao BB, e nenhum dado real de cliente (Seção 8.5). Os destinatários do extrato são nomes fictícios, sem marca de casa de aposta (Seção 8.4).

## 7. IA no produto

Não há.

## 8. Acessibilidade — como será implementada

- O contador é texto, e não só número grande: "12 dias sem apostar em outubro", lido inteiro pelo leitor de tela.
- O dinheiro preservado tem rótulo completo ("Estimativa de dinheiro preservado em outubro: R$ 180").
- A troca entre reais e metas é um par de botões com `aria-pressed`, não um interruptor só visual.
- "Anotado." chega por `role="status"`, sem mover o foco.
- Os chips de gatilho são botões de alvo ≥ 48 px, com estado em `aria-pressed`.
- O campo de gasto tem `inputmode="decimal"`, rótulo visível e mensagem de erro em texto.

## 9. Riscos e plano B da demo

| Risco | Mitigação |
|---|---|
| A demo cai no dia 1 do mês e o contador mostra 0 | O modo demo carrega check-ins sintéticos (pode reaproveitar o `?demo` do protótipo do Maykon) |
| Subir o banco para a versão 2 apaga os episódios do SOS | O `upgrade` checa `oldVersion` e só cria as stores novas; há teste cobrindo a subida da 1 para a 2 |
| Fuso horário: um check-in às 23h vira outro dia em UTC | A data do check-in é a data local do aparelho, nunca `toISOString().slice(0, 10)` |
| IndexedDB indisponível (modo anônimo) | O check-in mostra a resposta mesmo se gravar falhar, como o SOS da 001 |
| Valor de meta sem fonte conferida | A visão em metas só aparece com fonte conferida (decisão 3) |

## 10. Como verificar

| CA | Como |
|---|---|
| CA-1 | Teste de tela: o card da tela inicial grava com um toque em cada opção |
| CA-2 | Teste: "Não apostei" mostra "Anotado." num `role="status"`; o JSON não tem palavra de comemoração exagerada |
| CA-3 | Teste do fluxo: "Apostei" passa pelos quatro passos; "Tô mal com isso" leva a `/ajuda` |
| CA-4 | Teste de domínio: um lapso no meio do mês não zera o total; o JSON não contém "perdeu a sequência", "dia zero" nem variações |
| CA-5 | Teste de domínio do cálculo e da conversão em metas; teste de tela da troca reais ⇄ metas |
| CA-6 | Teste de domínio: o extrato sintético separa os Pix para intermediadora; o painel diz "simulação" e "dados de exemplo" |
| CA-7 | Teste de tela: sem conectar nada, check-in, contador e dinheiro preservado funcionam |
| Todos | `npm test && npm run build` em `web/` (Node 22+) e conferência manual offline com `npm run preview` |
