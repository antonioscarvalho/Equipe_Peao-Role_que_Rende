---
name: controle-estimulos-financas
description: Use ao projetar funcionalidades de bloqueio de sites/apps de apostas, autoexclusão, barreiras financeiras (PIX, cartão), gestão de dívidas e contador de dinheiro preservado; aplica controle de estímulos e redução do acesso.
---

# Controle de estímulos e barreiras financeiras

## Base conceitual
Na análise comportamental, comportamentos frequentes dependem de **acesso fácil** e **pistas no ambiente**. Reduzir o acesso (fricção) e as pistas é uma das estratégias mais práticas da TCC para jogo: quanto mais passos entre o impulso e a aposta, mais tempo a fissura tem para passar. Controle financeiro também reduz dano mesmo antes da abstinência completa.

> **Atualização regulatória (verificada em 27/10/2026, ver `docs/pesquisa/04-contexto-brasil.md`):** a MP 1.394/2026 (25/09/2026) proibiu toda a oferta de apostas de quota fixa no Brasil e as autorizações das operadoras foram extintas. Com isso, **todo site de bet que ainda funcionar é ilegal** e não respeita autoexclusão, o que torna os bloqueios técnico e financeiro ainda mais importantes. A MP ainda pode cair no Congresso (prazo inicial em 23/11/2026) ou ser suspensa pelo STF. Antes de usar qualquer texto regulatório, confira de novo.

## Como transformar em funcionalidades
1. **Guia passo a passo de bloqueios** (o app orienta; a pessoa executa):
   - Bloqueio de sites por DNS/filtro e controle de conteúdo do celular (Android/iOS) — verificar opções atuais na Fase 1.
   - Desinstalar apps de bets e sair de grupos/canais de "tips".
   - Deixar de seguir influenciadores de apostas; silenciar palavras-chave.
   - **Autoexclusão**: explicar a plataforma oficial de autoexclusão do governo para operadores autorizados (verificar nome, funcionamento e link atuais na Fase 1) e deixar claro que **sites ilegais não respeitam autoexclusão**, por isso bloqueio técnico e financeiro importam mais.
2. **Barreiras financeiras**: guia para reduzir limite de PIX, desativar PIX noturno, pedir ao banco bloqueio de transações para apostas quando o banco oferecer, entregar o controle do cartão a uma pessoa de confiança temporariamente (só com consentimento livre).
3. **Contador de dinheiro preservado**: a pessoa informa quanto costumava apostar por semana (estimativa); o app mostra o valor preservado e permite associar a uma meta concreta ("pagar a fatura", "presente pra filha"). Sem confetes nem sons de cassino.
4. **Organizador de dívidas**: lista de dívidas, ordem sugerida de prioridade (essenciais e juros altos primeiro), link para renegociação oficial e orientação para procurar Defensoria Pública/Procon em superendividamento. **Nunca** sugerir empréstimo.
5. **Checklist de ambiente**: horários e lugares de risco, notificações de bets desativadas, dinheiro em espécie limitado.
6. **"Fricção consciente"**: lembrete opcional que a pessoa agenda para os momentos de pagamento (dia do salário).

## Regras
- O app não é instituição financeira e não acessa conta bancária. Apenas orienta.
- Informações regulatórias (lei, autoexclusão, bancos) mudam — guarde em arquivo de conteúdo com data de verificação e fonte.
- Valores digitados pelo usuário ficam no dispositivo, criptografados.
- Dívidas são assunto de vergonha: tom acolhedor, sem números em notificação.

## Checklist
- [ ] A funcionalidade aumenta a fricção entre impulso e aposta?
- [ ] Diferencia sites autorizados vs. ilegais quando fala de autoexclusão?
- [ ] Informação regulatória tem fonte e data?
- [ ] Nada de recomendação de crédito, investimento ou "recuperar dinheiro"?
