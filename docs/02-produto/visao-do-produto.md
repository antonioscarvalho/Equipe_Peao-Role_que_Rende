# Visão do produto

> Base estratégica e narrativa para o protótipo e para a construção do Pitch Deck (Seção 9.2 do edital).

## Nome

**Guardião Rolê que Rende** (ou simplesmente **Guardião**)

> O uso de "Rolê que Rende" e da marca BB no nome e no pitch depende de **autorização da organização** (Seção 8.4). Até lá, usamos só **Guardião**.

## Frase de posicionamento

> Para **pessoas afetadas pelo uso problemático de apostas online e suas redes de apoio**, que **enfrentam crises de fissura (vontade urgente de jogar), desorganização financeira e a vergonha do endividamento**, o **Guardião Rolê que Rende** é um **aplicativo gamificado de suporte contínuo preparado para o Open Finance (no protótipo, só demonstração com dados sintéticos)** que **oferece acolhimento imediato nas crises e converte a ausência de apostas em conquistas reais de autonomia financeira sem julgamentos**. Diferente de **gerenciadores financeiros tradicionais que geram ansiedade com gráficos frios ou de jogos punitivos**, nossa solução **utiliza o Open Finance como um sensor passivo de proteção e um guardião virtual empático que nunca pune a recaída, promovendo redução de danos e reconstrução da vida**.

## Problema

- **Qual dor específica estamos atacando?**
  A perda de controle e o ciclo de sofrimento emocional e financeiro causado pelas bets. O usuário enfrenta picos repentinos de vontade de apostar (fissura), tenta esconder as dívidas por vergonha, teme expor suas contas e sofre com o isolamento familiar.
- **Por que ela importa (dados com fontes em `docs/07-conformidade/fontes-e-referencias.md`)?**
  1. **Dimensão:** 29% dos brasileiros adultos têm o costume de apostar (Quaest/2026), movimentando mais de R$ 30 bilhões por mês (CNC).
  2. **Vulnerabilidade socioeconômica:** 75% dos apostadores pertencem às classes D e E, com renda média de R$ 2.500 e score de crédito médio de 300 pontos (Legitimuz/2026).
  3. **Impacto na saúde mental:** 41% das 574 mil pessoas que buscaram a Autoexclusão oficial apontaram a perda de controle e danos à saúde mental como motivo principal (Extra/2026). Atendimentos no SUS cresceram 140% e um estudo de registro sueco encontrou mortalidade por suicídio cerca de 15 vezes maior entre pessoas com transtorno do jogo, em parte ligada a outras condições de saúde mental ([pesquisa](../pesquisa/01-transtorno-do-jogo.md); o número não aparece no app).

## Pilares do desafio atendidos (Edital — Seção 1 e Anexo 2)

- [x] **Vontade de jogar:** **Botão de SOS / Fissura** de acionamento imediato com timer de *urge surfing* de 10–15 minutos ("a vontade sobe, chega no pico e passa"), exercícios guiados de respiração diafragmática (grounding) e atalho de 1 toque para o **Ligue 188 (CVV)**.
- [x] **Vida financeira:** **Dinheiro preservado**: estimativa calculada a partir do quanto a pessoa costumava apostar (modo manual, padrão), traduzida em metas tangíveis (ex.: botijão de gás garantido, conta de luz quitada, compras da semana). O Open Finance entra só como **demonstração com dados sintéticos** ([spec 007](../../specs/007-open-finance-demo/spec.md), Must, diferencial do produto) e nunca "detecta" aposta.
- [x] **Rede de apoio:** **Círculo de Confiança**. Até 3 pessoas de confiança (familiar ou amigo), guardadas só no celular, chamadas pela própria pessoa com uma mensagem pronta; o app nunca envia nada sozinho e nada vai para redes sociais.
- [x] **Ajuda especializada:** **Hub de Apoio e Saúde Pública**. Acesso desestigmatizado e direto aos canais do SUS (Meu SUS Digital, autoteste, teleatendimentos especializados, UBS/CAPS) e link para a **Plataforma Centralizada de Autoexclusão** do Ministério da Fazenda, **condicional**: a situação dela depois da MP 1.394/2026 não está confirmada.

## Proposta de valor

Apoiar a transição para uma vida sem apostas por meio de uma experiência que combina **acolhimento psicológico de redução de danos** (sem punição ou moralismo) e **inteligência de dados financeiros do Banco do Brasil**, devolvendo ao usuário a dignidade e a percepção clara do valor do seu dinheiro.

## Formato e plataforma

- **Formato:** Aplicativo web responsivo gamificado (PWA / Mobile-first).
- **Plataforma:** Web e Mobile (otimizado para navegadores e dispositivos Android de entrada).
- **Por que esse formato?** Os dados do setor mostram que **77,5% dos apostadores usam Android**, e metade possui versões de sistema anteriores a 2023. O formato web responsivo/PWA não exige downloads pesados, roda em aparelhos modestos com baixo consumo de memória e dados móveis, além de viabilizar demonstração fluida na banca avaliadora.

## Diferencial e inovação (Critério de Inovação, 20%)

1. **Open Finance como aliado, não como vigia:** no protótipo, só uma demonstração com dados sintéticos mostra o dinheiro preservado sem digitar nada ([spec 007](../../specs/007-open-finance-demo/spec.md)). A revisão de 27/10/2026 tirou a ideia de "sensor" que detecta recaída: isso seria vigilância de dado sensível e não funciona com sites ilegais ([matriz](matriz-conceito-funcionalidade.md), linha 16).
2. **Guardião Resiliente (Anti-Tamagotchi punitivo):** Rompe com a lógica do "bicho que adoece ou morre se você errar". O Guardião é um companheiro empático: quando a pessoa registra um lapso, o Guardião ativa acolhimento imediato (*"Recomeçar faz parte do processo, vamos juntos hoje"*), alinhando-se aos princípios da TCC (Terapia Cognitivo-Comportamental) e às regras do edital contra abordagens punitivas/estigmatizantes.

## Viabilidade (Critério de Viabilidade, 30%)

- **Adoção sem barreiras:** o modo manual é o padrão, sem login nem conta bancária, o que inclui quem tem restrição cadastral ou score baixo. Uma conexão por Open Finance fica como evolução futura e, no protótipo, só como demonstração sintética.
- **Conformidade regulatória e de dados (Seções 8.4 e 8.5):** O protótipo utiliza estritamente dados sintéticos e ambiente de testes seguro (Sandbox), em conformidade com a LGPD e o edital.
- **Transição para produção pós-hackathon:** O Banco do Brasil pode integrar o motor de regras do Guardião nativamente ao App BB (na esteira de Saúde Financeira do cliente), oferecendo proteção a milhões de correntistas.

## Fora do escopo (Proteção e blindagem contra desclassificação)

- ❌ Transações com dinheiro real, apostas simuladas, minigames de sorte ou moedas com valor econômico (vedado pela Seção 8.4).
- ❌ Geolocalização / rastreamento de localização por GPS (inútil para apostas móveis, invasivo e em desacordo com a minimização de dados da LGPD).
- ❌ Compartilhamento em redes sociais abertas (Instagram, Facebook, etc.), preservando o sigilo e a dignidade do usuário.
- ❌ Pretensão de substituir diagnóstico ou atendimento médico/psicológico profissional (posicionado como apoio complementar preventivo, conforme Anexo 2).
