# Métricas de impacto

> O pitch precisa mostrar os "resultados esperados e como o impacto poderia ser medido" (Seção 9.2). Isso pesa em Viabilidade (30%).
> Rascunho de 27/10/2026, a partir da [matriz conceito → funcionalidade](../../../docs/02-produto/matriz-conceito-funcionalidade.md). Metas ilustrativas, sem base em dados reais do Guardião.

## Teoria da mudança

```
[SOS, plano Se/Então, registro, guia de bloqueio, Círculo de Confiança, hub de apoio]
   → [Resultados imediatos: a vontade cai durante o SOS; a pessoa monta um plano e um bloqueio; sabe onde pedir ajuda]
   → [Mudança de comportamento: mais dias sem apostar; lapsos viram ajuste de plano em vez de "já estraguei tudo"; procura apoio humano]
   → [Impacto de longo prazo: menos dano financeiro e emocional; mais pessoas chegando ao SUS, ao CVV e aos grupos de ajuda]
```

A métrica principal é de **desfecho** (dias sem apostar), não de retenção: sucesso é a pessoa precisar menos do app.

## Indicadores propostos

| Pilar | Indicador | Como medir | Meta ilustrativa |
|---|---|---|---|
| Vontade de jogar | Queda média da vontade no SOS (antes − depois, 0–10) | Réguas do SOS, no aparelho | queda média ≥ 3 pontos |
| Vontade de jogar | % de episódios de SOS que terminam sem aposta | Autorrelato no registro do dia | ≥ 70% |
| Vontade de jogar | Dias sem apostar por mês (desfecho principal) | Contador (total do período) | aumento mês a mês, comparado só consigo mesmo |
| Vida financeira | % de pessoas com pelo menos 3 passos do guia de bloqueio feitos | Checklist de bloqueio | ≥ 50% em 2 semanas |
| Vida financeira | % com meta concreta para o dinheiro preservado | Onboarding | ≥ 60% |
| Rede de apoio | % com pelo menos 1 contato no Círculo de Confiança | Círculo de Confiança | ≥ 40% |
| Ajuda especializada | Toques em canais de ajuda profissional (CVV, UBS/CAPS, Meu SUS Digital, JA) | Contagem agregada e opt-in | crescente; nunca ligada à identidade |
| Ajuda especializada | % de telas com acesso ao protocolo de crise em até 2 toques | Teste automatizado (`web/src/App.test.tsx`) | 100% (já atingido) |
| Engajamento | Uso na primeira semana e nos momentos de vontade (não tempo de tela) | Episódios de SOS e registros | — (não é meta de sucesso) |

## Como medir de verdade (pós-hackathon)

- Hoje os dados ficam **só no aparelho** e nada é enviado. Para medir em escala, seria preciso um consentimento **opt-in**, específico e destacado (dado de saúde é dado sensível, LGPD art. 11), com envio **agregado e anônimo**.
- Estudo-piloto com a rede de saúde (UBS/CAPS) ou com os Jogadores Anônimos, comparando dias sem apostar e uso de ajuda profissional em 4 e 12 semanas.
- Autoavaliação PGSI só depois de verificar licença e validação brasileira ([instrumentos](../../../docs/pesquisa/03-instrumentos.md)).

## Cuidados

- Métricas não podem exigir coleta de dados sensíveis sem consentimento (LGPD). Prefira métricas agregadas e anônimas.
- Engajamento alto não é sempre bom: a meta é a autonomia da pessoa, não o tempo de tela.
- No protótipo, use **dados sintéticos** para ilustrar os painéis de métricas (modo `?demo`).
