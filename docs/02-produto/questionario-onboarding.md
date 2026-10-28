# Questionário de entrada e de acompanhamento — proposta

> **Estado:** 📝 proposta, **nada implementado** (28/10/2026). Para virar código, precisa revisar a [spec 002](../../specs/002-onboarding-e-guardiao/spec.md) (onboarding) e a [spec 004](../../specs/004-contador-e-dinheiro/spec.md) (dinheiro), no fluxo SDD.
> **Pedido:** um formulário no início para a pessoa dizer **por que** quer ficar longe das apostas, **quem ela é**, **qual meta tem** (economizar para uma viagem, pagar dívida…) e o que a motiva.
> ⚠️ **REVISÃO CLÍNICA PENDENTE** nos textos marcados com 🩺.

## Decisões de 28/10/2026 (Maykon Júnio)

| Ponto | Decisão |
|---|---|
| Telas de entrada | **6 telas**: as 5 propostas **+ personalização do Guardião logo no início** (tela 2). A spec 002 (≤ 5 telas) precisa ser revisada |
| Motivo | Opções + texto livre "com suas palavras" |
| Réguas | Importância **e** confiança (0–10), com as perguntas de seguimento |
| Meta | Parar / Diminuir primeiro / Ainda não sei **+ primeiro passo opcional** |
| Gasto semanal | **Faixas + opção de digitar** + "prefiro não dizer" |
| Sonho | Valor opcional **e barra de progresso** (sempre "estimativa") |
| Menor de 18 anos | Acolhe e orienta (adulto de confiança, UBS, CVV 188), **não segue** o questionário e o botão de ajuda continua |
| PIN | Convite opcional na última tela (configuração da spec 008) |
| Personalização | **Tudo o que já existe** no app (cores do corpo e da roupa, roupas, cabeça, rosto, peito — catálogo do Atyrson em `web/src/domain/aparencia.ts`) **+ nome opcional** |
| Itens novos | **Um item em cada marco anunciado** (cachecol aos 7 dias, flor aos 30, estrela aos 90), como já está implementado; nada de loja, moeda ou sorteio |
| Limites da roupa | **Só roupas neutras**: sem escudo de clube, patrocinador, fichas, cartas, roleta ou "sorte" |
| "Me conta mais" | A partir do **2º dia, um bloco por vez**, sempre com "Agora não" |
| Blocos mantidos | Gatilhos, horários e balança · Apoio e ajuda já buscada · Tipo de aposta e dívidas · Carta para daqui a 30 dias (o nome do Guardião foi para a tela 2) |
| Acompanhamento | **Check-in semanal com pergunta de segurança opcional** 🩺 |

## 1. De onde vem cada decisão

| Fonte | O que ela diz | Como entra no questionário |
|---|---|---|
| Amy Jo Kim, *Game Thinking* | A entrada (onboarding) precisa entregar valor **rápido**; o resto se descobre aos poucos | Entrada com **5 telas no máximo**; perguntas extras ficam para depois ("Me conta mais") |
| Yu-kai Chou, Octalysis | Motivação 1 (sentido) e 3 (escolha) são as mais saudáveis; 4 (posse) com cuidado | O **motivo** e o **sonho** da pessoa viram o centro do app; ela escolhe tudo; pode dar nome ao Guardião |
| Brian Burke, *Gamificar* | Projetar para o objetivo **da pessoa**, não da organização | As metas são as dela (viagem, dívida, família), nunca "usar o app" |
| Kevin Werbach, 6D | "Descrever os jogadores" antes de projetar | As respostas descrevem a pessoa sem rótulo |
| Jane McGonigal | Participação **voluntária**; metas claras | Toda pergunta tem **Pular** ou "Prefiro não dizer" |
| Jesse Schell, lente do jogador | O que a pessoa quer, teme e precisa? | Perguntas de motivo, medo e apoio |
| Skill `entrevista-motivacional` | Perguntas abertas, réguas de **importância e confiança**, "por que N e não N−3?", balança decisória, metas escolhidas, carta para o eu do futuro, tom para quem ainda não decidiu | Telas 2–4 e bloco "Me conta mais" |
| Skill `controle-estimulos-financas` | Gasto semanal estimado + meta concreta; nada de crédito | Tela 5 (sonho e gasto) |
| Skill `prevencao-recaida` | Gatilhos, horários de risco, plano Se/Então, rede de apoio | Bloco "Me conta mais" |
| Skill `seguranca-e-crise` | Perguntas diretas e **opcionais** em pontos definidos; menor de 18 anos | Aviso 18+ na tela 1; pergunta de segurança no check-in semanal |
| Skill `design-etico-saude-digital` + LGPD | Coleta mínima, dado de saúde é sensível, tudo no aparelho | Lista do que **não** perguntar (seção 6) |
| [Pesquisa · instrumentos](../pesquisa/03-instrumentos.md) | Valor em **faixas**; autoeficácia 0–10 semanal; PGSI só com licença | Faixas de gasto; régua de confiança semanal; sem PGSI |

## 2. Visão geral

```
ENTRADA (6 telas, ~2–3 minutos, tudo pode pular menos a tela 1)
 1 Boas-vindas, limites, 18+ e privacidade
 2 Conheça seu Guardião: cor, roupa, acessórios e nome  → personalização
 3 Por que você quer ficar longe das apostas?        → "Seu motivo"
 4 Quão importante é? Quão confiante você está?        → réguas 0–10
 5 O que faz sentido agora? (parar · diminuir · ainda não sei) + primeiro passo
 6 Seu sonho com esse dinheiro + quanto costumava apostar + PIN → "Seu sonho" e estimativa
 → INÍCIO (o motivo e o sonho já aparecem)

ME CONTA MAIS (opcional, oferecido a partir do 2º dia, um bloco por vez)
 A Gatilhos e horários de risco   → plano Se/Então
 B O que a aposta te dá e o que ela te custa (balança)
 C Quem pode te apoiar           → Círculo de Confiança
 D Que tipo de aposta pesa mais   → cards "Pare e examine" certos
 E Ajuda que você já buscou       → hub de apoio
 F Compromissos financeiros       → orientação sobre dívidas
 G Carta para você daqui a 30 dias

ACOMPANHAMENTO
 · Check-in semanal (confiança 0–10, motivo de volta, pergunta de segurança opcional)
 · Marcos de 7, 30 e 90 dias (pergunta de reflexão)
```

## 3. Entrada (6 telas)

### Tela 1 · Boas-vindas, limites e privacidade (obrigatória)
| Campo | Texto para a pessoa | Tipo | Por quê |
|---|---|---|---|
| Título | **Bora construir uma vida sem apostas? Um passo de cada vez.** | — | Microcopy F1 |
| Limites | Este app é um apoio pra lidar com a vontade de apostar, organizar a grana e achar ajuda. Ele não substitui atendimento profissional. | texto | `seguranca-e-crise` (limites) |
| Privacidade | Suas respostas ficam **só neste celular**. Não tem conta nem cadastro, e você pode apagar tudo quando quiser. | texto | LGPD, `design-etico` |
| Idade | Você tem 18 anos ou mais? **Sim** · **Não** | 2 botões | Apostas são proibidas para menores; `seguranca-e-crise` |
| Se "Não" | Que bom que você procurou ajuda. Converse com um adulto de confiança e procure a unidade de saúde do seu bairro. Se precisar conversar agora, ligue 188 (CVV). | texto + botão 188 | idem; política de idade ainda depende de orientação jurídica |
| Consentimento | ☐ Entendi e quero guardar minhas respostas neste celular. | caixa | LGPD art. 11 (dado de saúde) |
| Sempre | **Preciso de ajuda agora** (fixo) | botão | spec 001, CA-2 |

### Tela 2 · Conheça seu Guardião (pode pular)
Usa o catálogo e o componente de personalização que já existem no app (`web/src/domain/aparencia.ts`, `web/src/app/personalizar/Personalizar.tsx`, feitos por Atyrson Souto).

| Campo | Texto | Tipo | Por quê |
|---|---|---|---|
| Título | **Esse é o seu Guardião. Ele vai te acompanhar e nunca vai te julgar.** | — | Apresenta o personagem (spec 002, CA-5) |
| Cor | Escolha a cor: Azul-céu · Rosa · Menta · Lilás · Baunilha · Verde-água | escolha única | Chou 3 (escolha) e 4 (posse leve); só tons com contraste ≥ 3:1 |
| Roupa | Sem roupa · Camiseta · Moletom · Jardineira (+ cor da roupa: Rosa-forte · Azul · Roxo · Amarelo · Branco) | escolha | idem |
| Cabeça | Nada · Boné · Gorro · Laço · Fones | escolha | idem |
| Rosto | Nada · Óculos redondos · Óculos escuros | escolha | idem |
| Peito | Nada · Broche de coração | escolha | idem |
| Itens de marco | 🔒 Cachecol (7 dias) · 🔒 Flor no broto (30 dias) · 🔒 Estrela dos 90 dias — aparecem com "faltam N dias" | anunciado | Recompensa previsível (Schell; spec 002, CA-9); um lapso não tira nada (CA-10) |
| Nome | Quer dar um nome pro seu Guardião? (ex.: Tonho, Luz) *(opcional)* | texto curto | Chou 4; frases viram "O {nome} continua aqui" |
| Regra | Só roupas neutras: sem escudo de clube, patrocinador, fichas, cartas, roleta ou "sorte" | — | Edital 8.4; skill `criar-personagem` |
| Depois | Dá pra mudar tudo quando quiser, em "Personalizar". | texto | Autonomia |

### Tela 3 · Por que você quer ficar longe das apostas? (pode pular)
| Campo | Texto | Tipo | Usado em |
|---|---|---|---|
| Pergunta | **O que te trouxe aqui hoje?** | — | EM: pergunta aberta |
| Opções (várias) | Minha família · Meus filhos · Pagar dívidas · Guardar dinheiro pra um sonho · Dormir melhor · Minha saúde · Meu trabalho ou estudo · Voltar a confiar em mim · Meu relacionamento · Alguém me pediu · Só quero entender melhor · Outro motivo | chips (múltipla) | "Seu motivo" no início e no SOS |
| Com suas palavras | Se quiser, conta com suas palavras por que isso importa pra você. | texto livre (até 200 caracteres) | Frase exibida no SOS (Chou 1: sentido) |
| Reflexão | Você escreveu: "{texto}". Guarda isso — vai aparecer quando a vontade apertar. | devolutiva | EM: reflexão |

### Tela 4 · Importância e confiança (pode pular)
| Campo | Texto | Tipo | Usado em |
|---|---|---|---|
| Importância | **Quão importante é mudar sua relação com as apostas agora?** (0 = nada · 10 = muito) | régua 0–10 | Base para o check-in semanal |
| Seguimento | Você marcou {N}, e não {N−3}. O que faz ser {N}? *(se quiser)* | texto livre | EM: evoca "fala de mudança" |
| Confiança | **E quão confiante você está de que consegue?** (0–10) | régua 0–10 | Medida de autoeficácia ([instrumentos](../pesquisa/03-instrumentos.md)) |
| Seguimento | O que faria essa nota subir um ponto? *(se quiser)* | texto livre | EM; vira sugestão de primeiro passo |
| Se importância ≤ 3 | Tudo bem. Muita gente sente as duas coisas ao mesmo tempo. O app fica aqui pra quando fizer sentido. | devolutiva | Tom para quem ainda não decidiu |

### Tela 5 · Meta e primeiro passo (pode pular)
| Campo | Texto | Tipo | Usado em |
|---|---|---|---|
| Meta | **O que faz sentido pra você neste momento?** **Parar de apostar** · **Diminuir primeiro** · **Ainda não sei** | escolha única | Tom do app; nada é forçado (spec 002, CA-7) |
| Se "Ainda não sei" | Tudo bem não ter certeza. O app fica aqui pra quando você precisar. | devolutiva | Pula o primeiro passo |
| Primeiro passo | Qual seria um primeiro passo pequeno? **Não apostar até domingo** · **Até o fim do mês** · **Até o próximo pagamento** · **Escolher uma data** · **Agora não** | escolha + data | Primeiro marco pessoal (anunciado; Schell, recompensa previsível) |
| Nota 🩺 | Se puder, conversa sobre essa meta com um profissional de saúde. | texto | `entrevista-motivacional` |

### Tela 6 · Seu sonho com esse dinheiro (pode pular)
| Campo | Texto | Tipo | Usado em |
|---|---|---|---|
| Sonho | **Pra onde você quer levar o dinheiro que deixar de apostar?** | — | Chou 1 e 4 (sentido e posse, sem moeda) |
| Opções (uma ou mais) | Uma viagem · Pagar uma dívida · Contas da casa (luz, água, gás) · Compras do mês · Um presente pra alguém · Uma reserva pra emergência · Um curso ou estudo · Arrumar a casa · Outro | chips | "Seu sonho" no card de dinheiro |
| Detalhe | Qual? (ex.: "levar minha filha na praia em janeiro") | texto curto | Frase exibida no início |
| Quanto custa | Quanto custa esse sonho, mais ou menos? *(se souber)* | valor (R$) | Barra "≈ R$ 300 de R$ 1.200 (estimativa)" |
| Gasto semanal | **Quanto você costumava apostar por semana?** Até R$ 20 · R$ 20–50 · R$ 50–100 · R$ 100–200 · R$ 200–500 · Mais de R$ 500 · Prefiro digitar · Prefiro não dizer | faixas | Estimativa do dinheiro preservado (spec 004); faixas evitam constrangimento ([instrumentos](../pesquisa/03-instrumentos.md)) |
| Explicação | É só pra estimar quanto você preserva. Fica só neste celular. | texto | `controle-estimulos-financas` |
| PIN | Quer proteger o app com uma senha de 4 números? **Proteger** · **Agora não** | opcional (decidido: entra aqui) | spec 008 |
| Fim | **Pronto.** Seu Guardião, seu motivo e seu sonho já estão na tela inicial. | — | Valor na primeira sessão (Kim) |

## 4. "Me conta mais" (opcional, depois)

Oferecido a partir do 2º dia, como um cartão no início ("Quer me contar mais sobre você? Leva 1 minuto."), **um bloco por vez**, sempre com **Agora não**. Kim: perfil progressivo, sem cansar na entrada. **Decidido em 28/10:** ficam os blocos A a G; o nome do Guardião passou para a tela 2.

| Bloco | Pergunta | Tipo | Usado em | Base |
|---|---|---|---|---|
| A · Gatilhos | O que costuma puxar a vontade? Dia do pagamento · Jogo na TV · Propaganda ou influenciador · Grupo de palpites · Ficar sozinho(a) · Tédio · Briga · Ansiedade · Bebida · Dívida apertando · Notificação · Outro | chips | Plano Se/Então (spec 005) | `prevencao-recaida` |
| A · Horários | Em que horário a vontade aparece mais? Manhã · Tarde · Noite · Madrugada · Dia do pagamento · Fim de semana | chips | Padrões devolvidos como pergunta (proposta P10) | `prevencao-recaida` |
| B · Balança 🩺 | O que a aposta te dá? (emoção · distração · esperança de dinheiro · companhia · fugir dos problemas · outro) / O que ela te custa? (dinheiro · sono · brigas · saúde · confiança · tempo · outro) → "Olhando isso, o que você pensa?" | chips + texto | Reflexão; cards do SOS | EM (balança decisória) |
| C · Apoio | Quem poderia te ouvir sem julgar? Nome e telefone (até 3) · **Agora não** | contatos | Círculo de Confiança (spec 005) | `prevencao-recaida`; Chou 5 |
| D · Tipo de aposta | Que tipo de aposta pesa mais pra você? Apostas esportivas · Cassino online / jogos de "crash" · Jogo do bicho · Loteria · Outro · Prefiro não dizer | chips | Escolher os cards "Pare e examine" e lições certas | `tcc-reestruturacao-cognitiva` |
| E · Ajuda | Você já procurou algum apoio? Psicólogo(a) · UBS ou CAPS · Jogadores Anônimos · CVV · Ainda não · Prefiro não dizer | chips | Destacar o que falta no hub de apoio (spec 006) | `seguranca-e-crise` (ponte para ajuda) |
| F · Finanças | Você tem compromissos financeiros que quer reorganizar? Sim · Não · Prefiro não dizer → se sim: Cartão · Empréstimo · Dinheiro de amigo ou família · Contas atrasadas · Outro | chips | Orientação: Defensoria, Procon, renegociação (nunca crédito) | `controle-estimulos-financas` |
| G · Carta | Escreve uma mensagem pra você mesmo(a) daqui a 30 dias. *(se quiser)* | texto livre | Mostrada no marco de 30 dias | EM (carta para o eu do futuro) |

## 5. Acompanhamento

| Quando | Pergunta | Tipo | Usado em | Base |
|---|---|---|---|---|
| Check-in semanal (opcional) | Você disse que quer {motivo}. Como foi essa semana? | texto livre | Reflexão | EM (devolver as palavras da pessoa) |
| Check-in semanal | Quão confiante você está em não apostar nesta semana? (0–10) | régua | Gráfico de confiança ao longo do tempo | Autoeficácia ([instrumentos](../pesquisa/03-instrumentos.md)) |
| Check-in semanal 🩺 | Nos últimos dias, você pensou em se machucar ou em não estar mais aqui? **Sim** · **Não** · **Prefiro não responder** | escolha | "Sim" → protocolo de crise (spec 006) | `seguranca-e-crise` (pergunta direta e opcional) |
| Marco de 7 dias | 7 dias no controle da sua grana. Como você se sente? | texto livre | Diário | Microcopy "Guardião e marcos"; proposta P3 |
| Marco de 30 dias | 30 dias. O que mudou pra você nesse tempo? (+ mostra a carta do bloco G) | texto livre | Diário | idem |
| Marco de 90 dias | 90 dias. Lembra do seu motivo? "{motivo}". Quer montar um plano de manutenção? | texto + convite | Proposta P13 | Kim (domínio) |
| Mudança de meta | Quer rever sua meta ou seu sonho? | atalho | Telas 4 e 5 de novo | Autonomia (EM) |

## 6. O que **não** perguntar (e por quê)

| Não perguntar | Motivo |
|---|---|
| Nome completo, CPF, e-mail, endereço, banco | Não precisa: o app funciona sem cadastro (LGPD, minimização) |
| Renda exata | Constrange e não muda o que o app faz; o gasto em faixas basta |
| Localização | Não precisa para indicar UBS/CAPS (spec 006 diz "sem GPS") |
| Escala PGSI ou "diagnóstico" | Licença e validação brasileira pendentes; o app **não rotula** ([instrumentos](../pesquisa/03-instrumentos.md)) |
| Há quanto tempo aposta / quanto já perdeu no total | Pode gerar vergonha e não muda nenhuma tela; o "saldo real" é proposta separada (matriz, linha 12) |
| Pergunta de segurança na entrada | É pesada logo no primeiro contato; vai no check-in semanal e no fim do SOS, sempre opcional |

## 7. Onde cada resposta aparece no app

| Resposta | Tela | Como |
|---|---|---|
| Motivo (tela 3) | Início e SOS | "Seu motivo: …" (hoje o SOS tem essa etapa, mas nada a alimenta) |
| Importância e confiança (tela 4) | Check-in semanal | Comparação só consigo mesmo |
| Meta e primeiro passo (tela 5) | Início | "Seu primeiro passo: não apostar até domingo" + marco pessoal |
| Sonho e valor (tela 6) | Card de dinheiro | "≈ R$ 300 preservados para a viagem (estimativa)" |
| Gasto semanal (tela 6) | Card de dinheiro | Base da estimativa (spec 004, CA-5) |
| Gatilhos e horários (A) | Plano Se/Então; padrões | Sugestões de plano |
| Balança (B) | SOS | Lembrete do que a aposta custa |
| Apoio (C) | SOS, crise, Círculo | Botões de ligar e mandar mensagem |
| Tipo de aposta (D) | SOS, pausas | Cards e lições mais próximos da realidade da pessoa |
| Ajuda (E) | Hub de apoio | Destaque para o que ainda não foi tentado |
| Finanças (F) | Dinheiro | Orientação de renegociação |
| Carta (G) | Marco de 30 dias | Mensagem da própria pessoa |
| Personalização e nome (tela 2) | Início, SOS, marcos | O Guardião como a pessoa escolheu; "O {nome} continua aqui." |

## 8. O que muda nas specs, se for aprovado

- **Spec 002:** passar de "≤ 5 telas" para **6 telas**; acrescentar a **personalização** (tela 2, com o catálogo existente e o nome), a régua de **confiança** (tela 4), o **primeiro passo** (tela 5) e a **tela 6** (sonho e gasto em faixas, PIN opcional); mover a privacidade para a tela 1.
- **Spec 004:** o gasto semanal pode vir do onboarding (faixas) além do card de dinheiro; acrescentar o **valor do sonho** e a barra de progresso (sempre "estimativa").
- **Nova spec:** "Me conta mais" (blocos A–H) e check-in semanal.
- **Microcopy:** incorporar os textos deste documento; os 🩺 passam por revisão clínica.
