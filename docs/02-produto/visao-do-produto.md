# Visão do produto

> Base estratégica e narrativa para o protótipo e para a construção do Pitch Deck (Seção 9.2 do edital).

## Nome

**Guardião Rolê que Rende** (ou simplesmente **Guardião**)

## Frase de posicionamento

> Para **pessoas afetadas pelo uso problemático de apostas online e suas redes de apoio**, que **enfrentam crises de fissura (vontade urgente de jogar), desorganização financeira e a vergonha do endividamento**, o **Guardião Rolê que Rende** é um **aplicativo gamificado de suporte contínuo integrado ao ecossistema Open Finance do Banco do Brasil** que **oferece acolhimento imediato nas crises e converte a ausência de apostas em conquistas reais de autonomia financeira sem julgamentos**. Diferente de **gerenciadores financeiros tradicionais que geram ansiedade com gráficos frios ou de jogos punitivos**, nossa solução **utiliza o Open Finance como um sensor passivo de proteção e um guardião virtual empático que nunca pune a recaída, promovendo redução de danos e reconstrução da vida**.

## Problema

- **Qual dor específica estamos atacando?**
  A perda de controle e o ciclo de sofrimento emocional e financeiro causado pelas bets. O usuário enfrenta picos repentinos de vontade de apostar (fissura), tenta esconder as dívidas por vergonha, teme expor suas contas e sofre com o isolamento familiar.
- **Por que ela importa (dados com fontes em `docs/07-conformidade/fontes-e-referencias.md`)?**
  1. **Dimensão:** 29% dos brasileiros adultos têm o costume de apostar (Quaest/2026), movimentando mais de R$ 30 bilhões por mês (CNC).
  2. **Vulnerabilidade socioeconômica:** 75% dos apostadores pertencem às classes D e E, com renda média de R$ 2.500 e score de crédito médio de 300 pontos (Legitimuz/2026).
  3. **Impacto na saúde mental:** 41% das 574 mil pessoas que buscaram a Autoexclusão oficial apontaram a perda de controle e danos à saúde mental como motivo principal (Extra/2026). Atendimentos no SUS cresceram 140% e a taxa de mortalidade por suicídio é 15 vezes maior entre pessoas com transtorno do jogo (Ministério da Saúde).

## Pilares do desafio atendidos (Edital — Seção 1 e Anexo 2)

- [x] **Vontade de jogar:** **Botão de SOS / Fissura** de acionamento imediato com minigame anti-ansiedade (quebra do pico dopaminérgico em 5 minutos), exercícios guiados de respiração diafragmática (grounding) e atalho de 1 toque para o **Ligue 188 (CVV)**.
- [x] **Vida financeira:** **Cofre do Dinheiro Resgatado** alimentado por Open Finance (Pluggy/BB em Sandbox/mock). Detecta dias sem transações para intermediadoras de apostas e traduz o dinheiro poupado em metas tangíveis para as classes D e E (ex.: botijão de gás garantido, conta de luz quitada, compras da semana).
- [x] **Rede de apoio:** **Círculo de Confiança (Padrinho Digital)**. Conexão discreta e estritamente privada com 1 ou 2 pessoas de máxima confiança do usuário (familiar ou amigo), compartilhando vitórias (dias limpos) ou solicitando ajuda em momentos críticos, sem qualquer exposição em redes sociais públicas.
- [x] **Ajuda especializada:** **Hub de Apoio e Saúde Pública**. Acesso desestigmatizado e direto aos canais do SUS (Meu SUS Digital, autoteste, teleatendimentos especializados, UBS/CAPS) e link facilitado para a **Plataforma Centralizada de Autoexclusão** do Ministério da Fazenda.

## Proposta de valor

Apoiar a transição para uma vida sem apostas por meio de uma experiência que combina **acolhimento psicológico de redução de danos** (sem punição ou moralismo) e **inteligência de dados financeiros do Banco do Brasil**, devolvendo ao usuário a dignidade e a percepção clara do valor do seu dinheiro.

## Formato e plataforma

- **Formato:** Aplicativo web responsivo gamificado (PWA / Mobile-first).
- **Plataforma:** Web e Mobile (otimizado para navegadores e dispositivos Android de entrada).
- **Por que esse formato?** Os dados do setor mostram que **77,5% dos apostadores usam Android**, e metade possui versões de sistema anteriores a 2023. O formato web responsivo/PWA não exige downloads pesados, roda em aparelhos modestos com baixo consumo de memória e dados móveis, além de viabilizar demonstração fluida na banca avaliadora.

## Diferencial e inovação (Critério de Inovação, 20%)

1. **Open Finance como "Sensor de Proteção":** Em vez de gráficos contábeis complexos que afastam o usuário de baixa renda, a API de Open Finance atua em segundo plano, identificando a blindagem das finanças e alimentando a evolução do Guardião.
2. **Guardião Resiliente (Anti-Tamagotchi punitivo):** Rompe com a lógica do "bicho que adoece ou morre se você errar". O Guardião é um companheiro empático: quando o usuário relata ou o sistema detecta uma recaída, o Guardião ativa acolhimento imediato (*"Recomeçar faz parte do processo, vamos juntos hoje"*), alinhando-se aos princípios da TCC (Terapia Cognitivo-Comportamental) e às regras do edital contra abordagens punitivas/estigmatizantes.

## Viabilidade (Critério de Viabilidade, 30%)

- **Adoção sem barreiras (Modo Híbrido):** O usuário pode conectar sua conta bancária via Open Finance (Pluggy / BB) para automação máxima **OU** optar pelo modo manual simplificado, sem necessidade de login bancário inicial. Isso garante inclusão imediata para quem tem restrição cadastral ou score baixo (~300).
- **Conformidade regulatória e de dados (Seções 8.4 e 8.5):** O protótipo utiliza estritamente dados sintéticos e ambiente de testes seguro (Sandbox), em conformidade com a LGPD e o edital.
- **Transição para produção pós-hackathon:** O Banco do Brasil pode integrar o motor de regras do Guardião nativamente ao App BB (na esteira de Saúde Financeira do cliente), oferecendo proteção a milhões de correntistas.

## Fora do escopo (Proteção e blindagem contra desclassificação)

- ❌ Transações com dinheiro real, apostas simuladas, minigames de sorte ou moedas com valor econômico (vedado pela Seção 8.4).
- ❌ Geolocalização / rastreamento de localização por GPS (inútil para apostas móveis, invasivo e em desacordo com a minimização de dados da LGPD).
- ❌ Compartilhamento em redes sociais abertas (Instagram, Facebook, etc.), preservando o sigilo e a dignidade do usuário.
- ❌ Pretensão de substituir diagnóstico ou atendimento médico/psicológico profissional (posicionado como apoio complementar preventivo, conforme Anexo 2).
