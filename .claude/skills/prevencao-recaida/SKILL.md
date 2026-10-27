---
name: prevencao-recaida
description: Use ao projetar funcionalidades de gatilhos, fissura/urgência de apostar, botão SOS, plano de enfrentamento e resposta a lapsos; aplica o modelo de Prevenção de Recaída (Marlatt & Gordon), urge surfing e técnicas de enfrentamento.
---

# Prevenção de Recaída aplicada a apostas

## Base conceitual
O modelo de Marlatt & Gordon descreve como **situações de alto risco** (emoções negativas, conflitos, pressão social, dinheiro na mão, jogos ao vivo, tédio, álcool) levam à recaída quando faltam respostas de enfrentamento. Pontos-chave:
- **Gatilhos** externos (propaganda, jogo na TV, salário caindo, notificação de bet, amigos) e internos (raiva, solidão, ansiedade, euforia, "estou devendo").
- **Fissura (craving)** é uma onda: sobe, atinge pico e passa — geralmente em minutos. *Urge surfing* (Marlatt; mindfulness) ensina a observar sem agir.
- **Efeito de violação da abstinência**: depois de um lapso, a pessoa pensa "já estraguei tudo" e aposta mais. O app precisa **interromper esse efeito**.
- **Lapso ≠ recaída**: um episódio é informação para ajustar o plano.
- **Estilo de vida equilibrado**: atividades prazerosas que substituam a função da aposta (emoção, socialização, fuga).

## Como transformar em funcionalidades
1. **Mapa de gatilhos**: a pessoa marca seus gatilhos (lista + personalizado) e o app os usa para personalizar avisos e o plano.
2. **Plano "Se… então…"** (intenções de implementação): "Se o Flamengo jogar e eu sentir vontade, então vou ligar pro meu irmão / sair pra caminhar". Até 5 planos, editáveis.
3. **Botão SOS (fissura)** — sempre a 1 toque, inclusive na tela inicial e widget:
   - Passo 1: "Quanto está a vontade agora? (0–10)"
   - Passo 2: timer de **urge surfing** de 10–15 min com respiração guiada e frases curtas ("A onda vai subir e vai passar")
   - Passo 3: lembrete do "Porquê" pessoal + card de distorção (skill TCC)
   - Passo 4: ação do plano Se/Então ou ligar para contato de apoio
   - Passo 5: "E agora? (0–10)" — mostra a queda, construindo autoeficácia
   - Se a resposta indicar desespero ou risco → protocolo da skill `seguranca-e-crise`
4. **Atrasar a decisão**: "Espere 15 minutos antes de decidir" — o timer em si é a intervenção.
5. **Fluxo pós-lapso** (sem punição): "Obrigado por registrar. Isso não apaga o que você já conquistou." → o que aconteceu antes? → qual gatilho? → o que ajustar no plano? → contagem retoma mostrando **total de dias sem apostar no período**, não só a sequência atual.
6. **Agenda de alto risco**: a pessoa indica dias/horários de risco (dia do pagamento, jogos de domingo) e o app oferece check-in leve antes, com consentimento.
7. **Banco de atividades alternativas**: por função (adrenalina → esporte; socializar → ligar para alguém; fugir de pensamentos → atividade manual).
8. **Rede de apoio**: até 3 contatos de confiança, com mensagem pronta "Estou com vontade de apostar, pode falar comigo?" (o usuário envia; o app nunca envia sozinho).

## Regras
- O SOS funciona offline e abre em menos de 1 segundo.
- Nunca reinicie a contagem com destaque negativo ("Você voltou ao dia 0").
- Notificações de alto risco só com opt-in e com texto discreto (não revelar "apostas" na tela de bloqueio).

## Checklist
- [ ] Interrompe o efeito de violação da abstinência?
- [ ] Ensina que a fissura passa (medida antes/depois)?
- [ ] O SOS está a 1 toque e funciona offline?
- [ ] Conecta com ajuda humana e com o protocolo de crise?
