# Microcopy (Fase 3)

> Textos de interface dos [fluxos](fluxos.md). Base: skill `entrevista-motivacional` (perguntas abertas, autonomia, sem confronto), `design-etico-saude-digital`, guia [conteúdo e tom de voz](../03-design/conteudo-e-tom-de-voz.md) e o "sotaque" do Rolê que Rende (`guia-estilo-role-que-rende/references/voz-e-tom.md`).
> Linguagem: português do Brasil simples, frases curtas, sem jargão, sem julgamento.
> ⚠️ Textos marcados com 🩺 são **conteúdo clínico** e precisam de revisão por profissional de psicologia antes do lançamento.
> Ao implementar, estes textos vão para `web/src/content/*.json`, não para o código.

## Regras rápidas

| Sempre | Nunca |
|---|---|
| "você", "a gente", "pra", "tá" | "usuário", "paciente", "viciado", "apostador compulsivo" |
| Perguntar o que faz sentido pra pessoa | Mandar ("você precisa", "você deve") |
| "Teve um dia difícil" / "retomou o caminho" | "Fracassou", "recaiu", "voltou ao dia 0" |
| "Compromissos financeiros a reorganizar" | "Você está cheio de dívidas" |
| "Estimativa" quando mostrar dinheiro | "Ganhe", "aposte", "jackpot", "prêmio", "sorte", "desbloqueado" |
| Reconhecer esforço e valores | "Parabéns, campeão!!! 🏆" |

## F1 · Onboarding

| Tela | Texto |
|---|---|
| 1 · Título | **Bora construir uma vida sem apostas? Um passo de cada vez.** |
| 1 · Corpo | Este app é um apoio pra você lidar com a vontade de apostar, organizar a grana e encontrar ajuda. Ele não substitui atendimento profissional. É pra maiores de 18 anos. |
| 1 · Botão | **Começar** |
| 2 · Pergunta | **O que te trouxe aqui hoje?** |
| 2 · Chips | Minha família · A grana · Meu sono · Meu trabalho · Minha saúde · Como eu me sinto comigo · Outro motivo |
| 2 · Campo livre | Se quiser, conta com suas palavras. (opcional) |
| 3 · Pergunta | **Quão importante é mudar isso pra você agora?** (0 = nada, 10 = muito) |
| 3 · Seguimento | Você marcou **{n}**. O que faz ser {n} e não {n−3}? (opcional) |
| 4 · Pergunta | **O que faz sentido pra você neste momento?** |
| 4 · Opções | Parar de apostar · Diminuir primeiro · Ainda não sei |
| 4 · "Ainda não sei" | Tudo bem não ter certeza. Muita gente sente as duas coisas ao mesmo tempo. O app fica aqui pra quando você precisar. |
| 4 · Nota | Se puder, conversa sobre essa meta com um profissional de saúde. |
| 5 · Privacidade | **Seus registros ficam só neste celular.** A gente não tem conta, não tem cadastro e não manda nada pra lugar nenhum. Você pode apagar tudo quando quiser. |
| 5 · PIN | Quer proteger o app com uma senha de 4 números? **Proteger** · Agora não |
| 5 · Botão | **Bora** |

## Início

| Elemento | Texto |
|---|---|
| Botão SOS | **Bateu a vontade?** |
| Seu motivo | Seu motivo: "{motivo}" |
| Contador | **{n} dias sem apostar este mês** · sequência atual: {m} dias |
| Dinheiro | Grana preservada (estimativa): **≈ R$ {valor}** — {meta} |
| Check-in | Como foi hoje? **Não apostei** · **Apostei** |
| Ajuda fixa | **Preciso de ajuda agora** |

## F2 · SOS 🩺

| Passo | Texto |
|---|---|
| 1 | **Quanto tá a vontade agora?** (0 a 10) |
| 1 · opção | Não tô aguentando → leva para a crise |
| 2 · título | **Respira. A gente passa por esse momento junto.** |
| 2 · frases (rotativas) | A vontade sobe, chega no pico e passa. · Você não precisa decidir nada agora. · Só observa: onde a vontade aparece no corpo? · Espera esse tempo terminar antes de decidir. |
| 2 · botão | Ir pro próximo passo |
| 3 | Lembra do seu motivo: **"{motivo}"** |
| 4 · cabeçalho | **Pare e examine** |
| 5 · título | **O que dá pra fazer agora?** |
| 5 · opções | Usar meu plano · Falar com alguém do meu Círculo · Sair de perto do celular por 10 minutos |
| 6 | **E agora, quanto tá a vontade?** |
| 6 · resultado (caiu) | Começou em {a}, agora tá em {b}. Você atravessou essa onda. |
| 6 · resultado (igual/subiu) | Tá difícil hoje. Quer falar com alguém agora? **Ligar pro CVV · 188** · Chamar alguém do Círculo |
| 7 | Voltar pro início |

### Cards "Pare e examine" 🩺
(skill `tcc-reestruturacao-cognitiva`; uma distorção por card, sem resposta pronta)

| Card | Pensamento | Perguntas |
|---|---|---|
| Recuperar o que perdi | "Se eu apostar mais uma vez, recupero o que perdi." | Quantas vezes essa tentativa já fez a conta crescer? · O que você diria pra um amigo pensando isso? |
| Eu entendo do jogo | "Eu manjo de futebol, sei analisar." | Se fosse habilidade, por que a casa sempre sai ganhando no longo prazo? · Seus palpites certos pagaram os errados? |
| Agora vai | "Perdeu 5 seguidas, agora vai ganhar." | A próxima partida sabe o que aconteceu antes? |
| Quase deu | "Faltou um gol, quase ganhei!" | Quase ganhar é perder. Quem ganha quando você sente isso? |
| Só diversão | "É só diversão, aposto pouco." | Quanto somou no mês? Quem mais sabe disso? |
| Única saída | "É o único jeito de pagar as contas." | Que outras saídas existem, mesmo difíceis? Quer ver onde pedir ajuda com as contas? |

Validação antes do questionamento (sempre no topo do card): *"Faz sentido pensar isso. Bora olhar com calma?"*

## F3 · Crise 🩺 (REVISÃO CLÍNICA PENDENTE)

| Elemento | Texto |
|---|---|
| Título | **Parece que você tá passando por um momento muito difícil.** |
| Corpo | Você não tá só nessa. Tem gente pronta pra conversar agora. |
| Botão 1 | **Ligar pro CVV · 188** — gratuito, 24 horas |
| Botão 2 | **SAMU · 192** — se você corre risco agora |
| Botão 3 | Chamar alguém do meu Círculo |
| Botão 4 | Onde encontrar um CAPS |
| Depois | Quer respirar um pouco comigo enquanto isso? |
| Plano | Meu plano de segurança |
| Limite | Este app não é um serviço de emergência. Em perigo, ligue 192. |
| Saída | Voltar quando eu quiser |

## F4 · Check-in e pós-lapso 🩺

| Elemento | Texto |
|---|---|
| Não apostei | Anotado. |
| Apostei · 1 | **Obrigado por registrar.** Isso não apaga o que você já construiu. |
| Apostei · 2 | O que aconteceu antes? (dia do pagamento · jogo na TV · tédio · briga · solidão · bebida · notificação · outro) |
| Apostei · 3 | **O que dá pra ajustar no seu plano?** Editar meu plano · Agora não |
| Apostei · 4 | Este mês você já tem **{n} dias sem apostar**. Bora retomar o caminho? |
| Opção | Tô mal com isso → leva para a crise |

## F5 · Plano

| Elemento | Texto |
|---|---|
| Título | **Seu plano pros momentos difíceis** |
| Gatilhos | O que costuma trazer a vontade? |
| Se/Então | **Se** {gatilho}, **então** eu vou {ação}. |
| Vazio | Ainda sem plano. Que tal começar por um momento que costuma ser difícil? |

## F6 · Guia de bloqueio

| Elemento | Texto |
|---|---|
| Título | **Mais passos entre a vontade e a aposta** |
| Explicação | Quanto mais difícil chegar numa aposta, mais tempo a vontade tem pra passar. |
| Aviso regulatório | Desde 25/09/2026 as bets são proibidas no Brasil. Site que ainda aparece é ilegal e não respeita autoexclusão. Por isso o bloqueio no celular e no banco faz diferença. *(conferido em {data})* |
| Passo concluído | Feito. |
| Passo adiado | Tudo bem, fica aqui pra depois. |

## F7 · Hub de apoio

| Elemento | Texto |
|---|---|
| Título | **Falar com alguém ajuda** |
| Grupos | Quero conversar agora · Quero tratamento · Quero um grupo · Tô com contas atrasadas |
| Rodapé | Informação conferida em {data}. |

## F8 · Círculo de Confiança

| Elemento | Texto |
|---|---|
| Título | **Seu Círculo de Confiança** |
| Explicação | Até 3 pessoas pra chamar quando apertar. Os contatos ficam só neste celular. |
| Mensagem 1 | Tô com vontade de apostar, pode falar comigo? |
| Mensagem 2 | Hoje tá difícil, me liga quando puder? |
| Botão | Enviar pelo meu WhatsApp |
| Nota | A gente nunca manda mensagem sozinho. |

## Guardião e marcos

| Marco | Texto |
|---|---|
| 7 dias | **7 dias no controle da sua grana.** Isso rende. Como você se sente? |
| 30 dias | **30 dias.** O que mudou pra você nesse tempo? |
| 90 dias | **90 dias.** Lembra do seu motivo? "{motivo}" |
| Depois de um lapso | O Guardião continua aqui. Recomeçar faz parte. |

## Configurações

| Elemento | Texto |
|---|---|
| Modo discreto | Mostrar o app com nome e ícone neutros |
| Apagar tudo | **Apagar todos os meus dados** — Isso apaga seus registros deste celular e não dá pra desfazer. **Apagar** · Cancelar |
| Exportar | Baixar meus dados |
| Sobre | Feito pela Equipe Peão no hackathon Rolê que Rende – BBDW 2026. Baseado em pesquisas sobre apoio a pessoas que enfrentam problemas com apostas. Não substitui atendimento profissional. |

## Notificações (só opt-in; fora do MVP)
Texto sempre neutro na tela de bloqueio: *"Oi, como tá seu dia?"* — nunca "aposta", "vício", "dívida".
