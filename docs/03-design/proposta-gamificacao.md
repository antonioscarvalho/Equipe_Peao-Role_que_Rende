# Proposta de gamificação — o que falta no Guardião

> **Estado:** 📝 proposta, **nada implementado**. Criada em 28/10/2026 a partir da skill [`gamificacao-etica`](../../.claude/skills/gamificacao-etica/SKILL.md) e da [auditoria](auditoria-gamificacao.md).
> **Decisão vigente:** as missões do dia, o dinheiro preservado, a moeda e o confete que já estão no app **ficam como estão** (Maykon Júnio, 28/10/2026). Esta proposta só **acrescenta** o que falta; não remove nada.
> Antes de implementar: a equipe escolhe os itens, cada um vira spec ou tarefa (fluxo SDD) e o responsável confirma.

## Resumo

| # | Proposta | Prioridade | Esforço | Spec / onde | Responsável sugerido |
|---|---|---|---|---|---|
| P1 | "Seu motivo" no onboarding, mostrado no início e no SOS | Must | médio | [spec 002](../../specs/002-onboarding-e-guardiao/spec.md) | Ian |
| P2 | Anunciar o próximo marco do Guardião ("faltam N dias") | Must | pequeno | spec 002, CA-9 | Ian |
| P3 | Pergunta de reflexão nos marcos de 7, 30 e 90 dias | Should | pequeno | spec 002 + microcopy "Guardião e marcos" | Vanessa (texto) + Ian |
| P4 | Ligar as missões ao plano Se/Então e ao motivo | Should | pequeno | [spec 005](../../specs/005-prevencao-e-circulo/spec.md) | Atyrson |
| P5 | Card do SOS em ordem fixa | Should | pequeno | [spec 003](../../specs/003-sos-fissura/spec.md), CA-4 | Ian |
| P6 | Texto de convite nos dias sem registro | Should | pequeno | `Contador.tsx` (spec 004) | Danillo |
| P7 | Demo de Open Finance só com a estimativa | Should | pequeno | [spec 007](../../specs/007-open-finance-demo/spec.md), CA-4 | Ian |
| P8 | Um só ritmo de respiração | Should | pequeno | skills `animar-componente`, `sonorizar-componente`, SOS | Atyrson + revisão clínica |
| P9 | Preencher o game design com os 6D | Must (pitch) | pequeno | [game-design.md](game-design.md) | Atyrson |
| P10 | Padrões devolvidos como pergunta | Could | médio | nova spec | a definir |
| P11 | Compartilhar um marco com o Círculo, se a pessoa quiser | Could | pequeno | spec 005 | Atyrson |
| P12 | Dar nome ao Guardião | Could | pequeno | spec 002 | Ian |
| P13 | Domínio: retrospectiva aos 90 dias e "plano de manutenção" | Could (pitch: próximos passos) | médio | nova spec | a definir |

---

## P1 · "Seu motivo" (Must)
- **Por quê:** é a motivação mais forte de chapéu branco (Chou 1: sentido) e o valor da primeira sessão (Kim). Hoje o SOS tem a etapa "motivo", mas **nada fornece o motivo**, então ela nunca aparece.
- **O quê:** o onboarding da spec 002 (motivo em chips + texto livre, régua de importância, meta "parar / diminuir / ainda não sei") e o motivo guardado no aparelho, exibido no início e no SOS.
- **Pronto quando:** depois do onboarding, o início mostra "Seu motivo: …" e o SOS mostra a etapa do motivo.

## P2 · Próximo marco anunciado (Must)
- **Por quê:** recompensa previsível é chapéu branco; surpresa vira chapéu preto (Chou 7; Schell, lente da recompensa). Já é critério aprovado (spec 002, CA-9).
- **O quê:** abaixo do Guardião, "Próximo marco: 30 dias (faltam N)". Depois dos 90 dias, nada a anunciar.
- **Pronto quando:** com 12 dias sem apostar, aparece "faltam 18 para o marco de 30 dias".

## P3 · Pergunta de reflexão nos marcos (Should)
- **Por quê:** o orgulho de conseguir (McGonigal) fica mais forte quando a pessoa diz com as palavras dela o que mudou (Entrevista Motivacional). **Não substitui** a celebração atual; acrescenta.
- **O quê:** ao chegar a 7, 30 e 90 dias, os textos que já estão no microcopy ("7 dias no controle da sua grana… Como você se sente?", "30 dias. O que mudou pra você nesse tempo?", "90 dias. Lembra do seu motivo?"), com resposta opcional guardada no aparelho.
- **Pronto quando:** no dia do marco, a pergunta aparece uma vez e pode ser pulada.

## P4 · Missões ligadas ao plano e ao motivo (Should)
- **Por quê:** componente sem dinâmica é enfeite (Werbach); a pessoa se envolve mais com o que ela mesma escolheu (Chou 3). **Mantém** o formato atual das missões.
- **O quê:** além das missões de exemplo, oferecer como missão as ações do plano Se/Então da pessoa ("ligar pro meu irmão", "caminhar") e mostrar o motivo ao concluir.
- **Pronto quando:** um plano "Se…, então vou caminhar" aparece como missão possível.

## P5 · Card do SOS em ordem fixa (Should)
- **Por quê:** sorteio é imprevisibilidade (Chou 7); a spec 003 revisada pede ordem fixa (CA-4).
- **O quê:** o próximo SOS mostra o card seguinte da lista; "outro card" continua possível, também em ordem.
- **Pronto quando:** dois SOS seguidos mostram cards diferentes, sempre na mesma sequência.

## P6 · Convite nos dias sem registro (Should)
- **Por quê:** "N dias deste mês ainda sem registro" pode soar como cobrança (Chou 8); participação deve ser voluntária (McGonigal).
- **O quê:** trocar por "Se quiser, dá pra registrar os dias que ficaram." com o mesmo número em texto menor.
- **Pronto quando:** o texto não usa "ainda" nem tom de pendência.

## P7 · Open Finance só com a estimativa (Should)
- **Por quê:** "Sem novas saídas desse tipo há N dias" soa como vigilância; a spec 007 (CA-4) pede só a estimativa e, no máximo, a sugestão de registrar o dia.
- **O quê:** tirar a frase dos "dias sem saídas" ou trocá-la por "estimativa preservada no mês".
- **Pronto quando:** a demo não menciona acompanhamento de um tipo de pagamento.

## P8 · Um só ritmo de respiração (Should)
- **Por quê:** coerência; hoje há 4-4-6 nas skills e 4-6 no app e no guia.
- **O quê:** a equipe escolhe um ritmo, com revisão clínica, e alinha skills, guia e SOS.

## P9 · Game design com os 6D (Must para o pitch)
- **Por quê:** a Banca vai perguntar sobre gamificação; o documento está vazio.
- **O quê:** preencher [game-design.md](game-design.md) com os 6D de Werbach (objetivo, comportamentos, jogadores, laços, diversão, ferramentas), o laço principal da [auditoria](auditoria-gamificacao.md) e as respostas da skill [`pitch-gamificacao`](../../.claude/skills/pitch-gamificacao/SKILL.md).

## P10 · Padrões como pergunta (Could)
- **Por quê:** retorno que faz a pessoa pensar (Chou 3; TCC, skill `tcc-reestruturacao-cognitiva`).
- **O quê:** depois de alguns registros, devolver um padrão como pergunta: "A vontade aparece mais depois das 22h. Faz sentido pra você?". Tudo calculado no aparelho.

## P11 · Compartilhar um marco com o Círculo (Could)
- **Por quê:** vínculo sem comparação (Chou 5); a rede de apoio celebra junto.
- **O quê:** no marco, botão "Contar pra alguém do meu Círculo" com mensagem pronta; a pessoa decide enviar.

## P12 · Nome do Guardião (Could)
- **Por quê:** posse leve, sem coleção (Chou 4).
- **O quê:** campo opcional para dar nome ao Guardião; o nome aparece nas frases.

## P13 · Domínio: precisar menos do app (Could · próximos passos)
- **Por quê:** a jornada termina em domínio (Kim), e o objetivo é o da pessoa (Burke).
- **O quê:** aos 90 dias, uma retrospectiva (dias, vontade média no SOS, planos usados) e o convite para um "plano de manutenção" com menos lembretes.

---

## Fora desta proposta (decisão de 28/10/2026)
- Missões do dia com "+R$", moeda girando, brilho e confete: **mantidos**. O risco de leitura pela Seção 8.4 está registrado na [auditoria](auditoria-gamificacao.md).
