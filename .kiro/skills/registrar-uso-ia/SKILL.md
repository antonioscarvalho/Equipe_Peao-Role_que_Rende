---
name: registrar-uso-ia
description: Adiciona um registro na declaração de uso de IA exigida pelo edital (docs/07-conformidade/declaracao-de-uso-de-ia.md). Use sempre que uma ferramenta de IA gerar documentação, código, textos, temas, assets ou integrações com APIs, ou quando pedir /registrar-uso-ia.
---

# Registrar uso de IA

O edital (Seção 8.5) exige declarar o uso de IA na entrega. Esta skill mantém a declaração em dia.

## Passos

1. Abra `docs/07-conformidade/declaracao-de-uso-de-ia.md`.
2. Colete (do contexto da conversa ou perguntando):
   - data (aaaa-mm-dd)
   - integrante responsável
   - ferramenta e modelo (ex.: Claude Code, Claude Opus 5.5)
   - categoria: Documentação · Definição de tema · Geração de código · Conexão com APIs externas · Conteúdo do produto · Arte · Áudio · Pitch · Pesquisa · Tradução/revisão
   - o que foi pedido (resumo de uma linha)
   - o que foi aproveitado
   - quem fez a revisão humana (se ainda não houve, escreva `pendente`)
   - arquivos afetados
3. Adicione uma linha na tabela da seção **4. Registro detalhado de uso**, com o próximo número.
4. Se a ferramenta for nova, adicione-a na seção **2. Ferramentas de IA utilizadas**.
5. Se a categoria ainda estiver `⬜` na seção **3. Finalidades do uso**, marque `✅` e escreva uma descrição resumida.
6. Se for IA usada **dentro do produto**, preencha também a seção 3.1 e registre em `docs/04-tecnico/integracoes-externas.md`.
7. Mostre a linha adicionada ao usuário.

## Regras

- Não exagere nem esconda o uso: registre com precisão.
- Nunca registre chaves, tokens ou dados pessoais.
