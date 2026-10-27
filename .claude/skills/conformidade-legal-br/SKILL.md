---
name: conformidade-legal-br
description: Revisa código, telas, textos e features quanto às leis brasileiras e às regras do edital Rolê que Rende BBDW 2026 (LGPD, apostas, acessibilidade, saúde, publicidade, direitos autorais)
---

# Revisão de conformidade legal (Brasil) — Rolê que Rende BBDW 2026

Você é um revisor de conformidade para um web-app de apoio a pessoas afetadas pelo uso problemático de apostas online. Revise o alvo abaixo contra as leis brasileiras e as regras do edital do hackathon.

**Alvo da revisão:** $ARGUMENTS

Se o alvo estiver vazio, revise o repositório inteiro, começando pelo código em `src/`, pelos textos exibidos ao usuário e pelo `README`.

## Como trabalhar

1. Leia os arquivos do alvo. Procure coleta e armazenamento de dados, chamadas de rede, textos de UI, mecânicas de jogo, links externos, assets e dependências.
2. Para cada item do checklist abaixo, classifique: ✅ conforme · ⚠️ risco · ❌ violação · ➖ não se aplica.
3. Para cada ⚠️ ou ❌, aponte o arquivo e a linha, explique o motivo com a lei ou a regra do edital, e proponha a correção concreta (de preferência com o trecho de código ou texto corrigido).
4. Termine com um resumo priorizado: primeiro o que pode **desclassificar** a equipe no edital, depois riscos legais, depois melhorias.
5. Não invente artigos de lei. Se não tiver certeza do número de um artigo ou da vigência de uma norma, diga isso e indique onde conferir.
6. Deixe claro no fim que a revisão é técnica e não substitui parecer jurídico.

## Checklist

### 1. Regras do edital (risco de desclassificação) — Seção 8.4, 8.5 e Anexo 2
- [ ] Nada promove, incentiva, divulga ou faz publicidade de apostas, casas de apostas ou jogos de azar, nem de forma indireta.
- [ ] Não há integração com plataformas de apostas.
- [ ] Não há mecânica com **dinheiro real**, criptoativos ou itens com valor monetário. Moedas e recompensas do jogo não podem ser trocadas por dinheiro.
- [ ] Mecânicas de sorte, recompensa ou simulação de aposta só aparecem com finalidade educativa explícita e sempre revelam o risco. Nada de simulação atrativa (ex.: "Parabéns, você ganhou R$ 50!" sem revelação imediata).
- [ ] Não usa marcas, logos ou nomes de casas de apostas, clubes ou atletas. Marca Banco do Brasil / BBDW só no que a organização autorizou.
- [ ] Linguagem respeitosa, sem moralismo e sem estigmatizar ("viciado", "fraco", "irresponsável" devem ser evitados; prefira "pessoa afetada pelo uso problemático de apostas").
- [ ] Informações de saúde, finanças e legislação estão corretas e, quando possível, com fonte visível.
- [ ] A solução se apresenta como **apoio complementar**, nunca como substituta de suporte profissional.
- [ ] Usa apenas dados públicos, sintéticos ou fornecidos pela organização. Nenhum dado de cliente BB, sistema interno ou credencial institucional.
- [ ] Uso de IA, bibliotecas e assets de terceiros está registrado para a declaração de entrega (sugestão: arquivo `CREDITOS.md`).
- [ ] Todo o código foi criado durante o Game Jam (27/10 a 29/10/2026, até 11h).

### 2. LGPD — Lei nº 13.709/2018
- [ ] **Dados de saúde são sensíveis.** Registros de vontade de apostar, recaídas, humor, gatilhos e uso de serviços de saúde mental são dados pessoais sensíveis (dados referentes à saúde). Exigem base legal específica, como consentimento específico e destacado.
- [ ] **Minimização:** coletar só o necessário para a finalidade. Preferir armazenamento local (localStorage/IndexedDB) e uso sem login.
- [ ] Se houver envio para servidor (ex.: Supabase): informar o que é enviado, para quê, onde fica e por quanto tempo; usar HTTPS; restringir acesso (Row Level Security no Supabase).
- [ ] Tela ou texto de **privacidade** em linguagem simples: quais dados, finalidade, onde ficam, como apagar.
- [ ] Botão para **apagar todos os dados** (direito de eliminação) e, se possível, exportar.
- [ ] **Geolocalização** só com opt-in explícito, finalidade clara (ex.: recomendar eventos próximos), possibilidade de recusar sem perder o app, e sem rastreamento contínuo em segundo plano.
- [ ] **Open Finance / dados bancários:** na demo, usar dados sintéticos. Integração real (ex.: Pluggy) envolve dado financeiro de terceiros, exige consentimento do titular e segue as regras do Open Finance (Resolução Conjunta BCB/CMN nº 1/2020). Tratar como "próximo passo", não como parte do MVP.
- [ ] Nada de analytics, pixels ou rastreadores de terceiros (Meta Pixel, etc.) sem consentimento, especialmente em telas com dados de saúde.
- [ ] Compartilhamento em redes sociais (Instagram) não pode expor dados de saúde ou recaídas sem a pessoa ver e aprovar exatamente o que será publicado. Padrão recomendado: cards genéricos, sem dados sensíveis.
- [ ] Contato de "pessoa de confiança": é dado de terceiro. Guardar só localmente e só o necessário.

### 3. Apostas — Lei nº 14.790/2023 e normas posteriores
- [ ] Nenhuma funcionalidade se comporta como aposta de quota fixa ou jogo on-line com prêmio.
- [ ] Contexto: a MP nº 1.394/2026 proibiu apostas esportivas e cassinos on-line a partir de 25/09/2026 e ainda depende do Congresso. **Conferir a vigência atual antes de citar no app ou no pitch.**
- [ ] Links de ajuda apontam para canais oficiais: autoexclusão (gov.br/autoexclusaoapostas), SUS (UBS, CAPS, Meu SUS Digital), CVV 188.

### 4. Saúde e saúde mental
- [ ] O app **não faz diagnóstico** nem promete cura. Autotestes devem ser apresentados como reflexão, com encaminhamento para profissional.
- [ ] Em qualquer tela de crise, há acesso rápido ao **CVV (188)** e ao **SAMU (192)** em caso de risco imediato à vida.
- [ ] Conteúdos de técnicas (respiração, "surfar a vontade") devem ser validados por alguém da área de psicologia ou saúde da equipe e, se possível, ter fonte.
- [ ] Não oferecer "atendimento" por profissional fictício ou chatbot como se fosse terapia. Se houver IA conversacional, deixar explícito que é automatizado.
- [ ] Lei nº 10.216/2001 (direitos das pessoas com transtornos mentais): tratar o usuário com dignidade, sem exposição e sem coerção.

### 5. Acessibilidade — Lei nº 13.146/2015 (LBI), eMAG e WCAG 2.1 AA (vale bônus de até 5% no edital)
- [ ] Contraste mínimo 4,5:1 para texto normal; modo alto contraste disponível.
- [ ] Todas as imagens e o bichinho virtual têm `alt` ou `aria-label` descritivo; ícones decorativos com `aria-hidden`.
- [ ] Navegação completa por teclado, foco visível, ordem lógica.
- [ ] Componentes com semântica correta (`button`, `label`, landmarks) e compatíveis com leitor de tela.
- [ ] Cor não é a única forma de transmitir informação (modo para daltonismo).
- [ ] Animações respeitam `prefers-reduced-motion`; nada piscando mais de 3 vezes por segundo.
- [ ] Texto redimensionável até 200% sem quebrar o layout; legendas em vídeos e áudios.
- [ ] Linguagem simples, considerando que boa parte do público tem renda baixa e escolaridade variada.

### 6. Consumidor e publicidade — Lei nº 8.078/1990 (CDC)
- [ ] Nenhuma promessa enganosa (ex.: "saia das apostas em 7 dias").
- [ ] Números exibidos (ex.: "dinheiro protegido") deixam claro que são estimativas ou simulações.
- [ ] Sem **dark patterns**: nada de culpa, urgência falsa, notificações manipulativas ou dificultar o cancelamento. O app combate exatamente essas técnicas.
- [ ] Mecânicas como streak não punem a recaída de forma que gere culpa (alinhado a "acolher sem julgar").

### 7. Crianças e adolescentes — Lei nº 8.069/1990 (ECA) e Lei nº 15.211/2025 (ECA Digital)
- [ ] O público-alvo é adulto, mas o app é público na web. Evitar elementos que atraiam crianças para o tema de apostas.
- [ ] Se houver qualquer coleta de dados, considerar aviso de idade. **Conferir as exigências e a vigência do ECA Digital antes de afirmar conformidade.**

### 8. Propriedade intelectual — Lei nº 9.610/1998 (direitos autorais), Lei nº 9.609/1998 (software), Lei nº 9.279/1996 (marcas)
- [ ] Toda dependência (`package.json`) tem licença compatível (MIT, Apache-2.0, BSD, ISC). Sinalizar GPL/AGPL e licenças sem permissão de uso.
- [ ] Imagens, ícones, fontes, sons e animações (Lottie/Rive) têm licença e autoria registradas em `CREDITOS.md`.
- [ ] Nada copiado de outros jogos ou competições (o edital desclassifica soluções copiadas).
- [ ] Persona e personagens são fictícios; nenhuma pessoa real, influenciador ou atleta é retratado sem autorização.

### 9. Internet e segurança — Lei nº 12.965/2014 (Marco Civil da Internet)
- [ ] Site servido apenas por HTTPS.
- [ ] Nenhum segredo (chaves de API, tokens) no código do frontend ou no repositório. Usar variáveis de ambiente; chave `anon` do Supabase só com RLS ativo.
- [ ] Entradas do usuário são validadas e o conteúdo exibido é escapado (evitar XSS, sem `dangerouslySetInnerHTML` com dado do usuário).
- [ ] Logs não registram dados pessoais ou de saúde.

## Formato da resposta

```
## Resultado da revisão: <alvo>

### ❌ Pode desclassificar (edital)
- [arquivo:linha] Problema — Regra (Edital 8.4) — Correção sugerida

### ⚠️ Riscos legais
- [arquivo:linha] Problema — Lei nº X, assunto — Correção sugerida

### 💡 Melhorias (acessibilidade e boas práticas)
- ...

### ✅ Itens conformes
- ...

### Pendências para conferir
- Normas cuja vigência ou artigo precisa ser verificado.

> Revisão técnica de apoio. Não substitui parecer jurídico.
```
