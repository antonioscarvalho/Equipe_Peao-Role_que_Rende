# Fluxos principais (Fase 3)

> Fluxos do MVP definido na [matriz](matriz-conceito-funcionalidade.md#4-mvp-proposto-10-funcionalidades). Textos de cada tela em [microcopy](microcopy.md).
> Regras que valem para **todos** os fluxos (skills `seguranca-e-crise` e `design-etico-saude-digital`):
> - **Saída para a crise a ≤ 2 toques** de qualquer tela: botão "Preciso de ajuda agora" fixo no menu, sempre visível.
> - **SOS a 1 toque** na tela inicial.
> - SOS, crise e Hub **funcionam offline**.
> - Uma ação principal por tela, grande e ao alcance do polegar.
> - Nada é enviado para fora do aparelho (ver [privacidade](../04-tecnico/privacidade-e-dados-locais.md)).

## Mapa de telas

```
                         ┌──────────────────────────┐
  primeira vez ────────► │ F1 Onboarding "Seu motivo"│
                         └────────────┬─────────────┘
                                      ▼
┌──────────────────────────────── INÍCIO (Guardião) ────────────────────────────────┐
│  [ SOS · Bateu a vontade ]  ← 1 toque                                               │
│  Seu motivo · Dias sem apostar no mês · Dinheiro preservado · Check-in de hoje       │
│  Menu: Plano · Guia de bloqueio · Apoio · Círculo · Configurações · [Preciso de ajuda]│
└──┬─────────┬────────────┬────────────┬────────────┬────────────┬───────────────┬────┘
   ▼         ▼            ▼            ▼            ▼            ▼               ▼
  F2 SOS   F4 Check-in  F5 Plano     F6 Guia      F7 Hub       F8 Círculo     F3 CRISE
           / pós-lapso   Se/Então    bloqueio     de apoio     de Confiança   (de qualquer tela)
```

## F1 · Onboarding "Seu motivo" (≤ 5 telas)
Skill: `entrevista-motivacional`.

```
1. Boas-vindas + o que o app é e não é (apoio, não tratamento) + aviso 18+
2. "O que te trouxe aqui hoje?"  → chips (família, grana, sono, trabalho, saúde, autoestima) + campo livre opcional
3. Régua: "Quão importante é mudar isso pra você?" (0–10)
     → "Por que [N] e não [N−3]?" (pergunta de EM; resposta opcional)
4. Meta escolhida pela pessoa: [Parar de apostar] [Diminuir primeiro] [Ainda não sei]
     → "Ainda não sei" é aceito: o app segue sem plano de ação forçado
5. Privacidade em 3 linhas + [Começar]  (+ "Quer proteger com PIN?" opcional)
→ INÍCIO
```
Saídas: botão "Preciso de ajuda agora" visível desde a tela 1. Pular é permitido em 2, 3 e 4.

## F2 · SOS "Bateu a vontade" (1 toque, offline)
Skills: `prevencao-recaida`, `tcc-reestruturacao-cognitiva`, `seguranca-e-crise`.

```
1. "Quanto tá a vontade agora?" (0–10)
     → se a pessoa marcar "Não tô aguentando" (opção explícita) ──────────────► F3 CRISE
2. Onda: timer de 10–15 min, respiração guiada, frases curtas
     ("A vontade sobe, chega no pico e passa.")  [Pular para o próximo passo]
3. Seu motivo (o que a pessoa escreveu no F1)
4. Card "Pare e examine" (1 distorção, 2–3 perguntas)  [Outro card] [Pular]
5. O que fazer agora:  [Meu plano Se/Então] [Falar com alguém do Círculo] [Sair pra caminhar…]
6. "E agora, quanto tá a vontade?" (0–10)
     → mostra a mudança: "Começou em 8, agora tá em 4."
     → se continuar ≥ 9 ou a pessoa marcar desespero ─────────────────────────► F3 CRISE
7. [Voltar pro início]   (registro local: fissura antes/depois)
```

## F3 · Protocolo de crise (≤ 2 toques de qualquer tela, offline)
Skill: `seguranca-e-crise`. ⚠️ **REVISÃO CLÍNICA PENDENTE** de todos os textos.

```
1. Tela calma: "Parece que você tá passando por um momento muito difícil. Você não tá só nessa."
2. Ajuda com 1 toque (os telefones aparecem mesmo sem internet):
     [Ligar pro CVV · 188]  [SAMU · 192 se for risco imediato]
     [Chamar alguém do meu Círculo]  [Onde fica o CAPS mais perto]  (link oficial; sem pedir localização)
3. Depois das opções: [Respirar um pouco comigo] (exercício de 2 min)
4. [Meu plano de segurança] (sinais de alerta, o que me acalma, pessoas, profissionais, ambiente mais seguro)
5. [Voltar quando eu quiser] — sem pressa, sem registro em lugar nenhum além do aparelho
```

## F4 · Check-in diário e pós-lapso
Skills: `prevencao-recaida`, `entrevista-motivacional`.

```
Check-in (1 toque, opcional, no INÍCIO):  "Como foi hoje?"  [Não apostei] [Apostei]  (+ humor opcional)

[Não apostei] → "Anotado." (sem confete, sem som) → INÍCIO

[Apostei] → pós-lapso, sem punição:
  1. "Obrigado por registrar. Isso não apaga o que você já construiu."
  2. "O que aconteceu antes?" → chips de gatilho (+ livre)
  3. "O que dá pra ajustar no seu plano?" → [Editar meu plano] [Agora não]
  4. Volta ao INÍCIO mostrando o TOTAL de dias sem apostar no mês (nunca "você voltou ao dia 0")
  → se a pessoa marcar "Tô mal com isso" ──────────────────────────────────────► F3 CRISE
```

## F5 · Plano de prevenção de recaída
Skill: `prevencao-recaida`.

```
1. Meus gatilhos: chips (dia do pagamento, jogo na TV, tédio, briga, solidão, bebida, notificação…) + livre
2. Até 5 planos "Se [gatilho], então [ação]" — ações sugeridas por função (adrenalina → esporte; companhia → ligar pra alguém)
3. Os planos aparecem no passo 5 do SOS
```

## F6 · Guia de bloqueio e autoexclusão
Skill: `controle-estimulos-financas`.

```
Checklist em passos, cada um com "Como fazer" e [Feito] / [Agora não]:
  · Desinstalar apps de bets
  · Bloquear sites no celular (DNS com filtro / controle de conteúdo)
  · Sair de grupos de "tips"; deixar de seguir influenciadores; silenciar palavras
  · Reduzir o limite do Pix e desligar o Pix noturno no app do banco
  · Combinar com alguém de confiança sobre o cartão (só com consentimento)
  · Autoexclusão gov.br — aparece SÓ se o conteúdo estiver marcado como confirmado
Aviso fixo: "Desde 25/09/2026 as bets são proibidas no Brasil (MP 1.394). Site que ainda aparece é ilegal e não respeita autoexclusão — por isso o bloqueio no celular e no banco ajuda tanto."  (texto vem do arquivo de conteúdo, com data)
```

## F7 · Hub de apoio
Skill: `seguranca-e-crise`.

```
Lista por necessidade:
  · Quero conversar agora → CVV 188
  · Quero tratamento → UBS / CAPS (SUS); teleatendimento (só se confirmado)
  · Quero um grupo → Jogadores Anônimos
  · Tô com dívidas → Defensoria Pública, Procon, Desenrola (a partir de fev/2027)
Cada item mostra "conferido em DD/MM/AAAA".
```

## F8 · Círculo de Confiança
Skills: `prevencao-recaida`, `design-etico-saude-digital`.

```
1. Até 3 contatos (nome + telefone, só no aparelho)
2. Mensagens prontas e editáveis:
     "Tô com vontade de apostar, pode falar comigo?"  /  "Hoje tá difícil, me liga?"
3. [Enviar] abre o WhatsApp/SMS da pessoa com o texto preenchido — o app nunca envia sozinho
```

## F9 · Guardião e contador (no INÍCIO)
Skills: `design-etico-saude-digital`, `controle-estimulos-financas`.

```
· Dias sem apostar no mês (total) + sequência atual em texto pequeno e neutro
· Dinheiro preservado: estimativa semanal × semanas → "≈ R$ 600 — dá pra conta de luz" (sempre "estimativa")
· Guardião muda de forma em marcos anunciados (7, 30, 90 dias); depois de um lapso, acolhe e não "piora"
· Sem sons, confete, prêmio, ranking ou item colecionável
```

## F10 · Configurações e privacidade

```
[PIN] [Modo discreto] [Tamanho da fonte] [Alto contraste] [Reduzir animações]
[Exportar meus dados] [Apagar tudo] (confirmação em 1 tela)
[Sobre: quem fez, base científica, limites — "o app não substitui atendimento profissional"]
```
