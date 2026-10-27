---
name: sdd-revisar
description: Revisa uma funcionalidade implementada comparando código, spec e regras do edital, e gera revisao.md. Use antes de abrir PR para development/main, ou quando pedir /sdd-revisar.
---

# SDD · Revisar

Gera `specs/NNN-<slug>/revisao.md`.

## Passos

1. Leia `spec.md`, `plano.md` e `tarefas.md`, e veja o diff da branch em relação a `development` (`git diff development...HEAD`).
2. **Spec x código:** para cada critério de aceite (`CA-x`), diga se está atendido, parcial ou não atendido, citando `arquivo:linha`.
3. **Edital:** percorra `docs/07-conformidade/regras-de-conteudo.md` item por item. Qualquer violação da Seção 8.4 é **bloqueante**.
4. **Acessibilidade:** confira os itens Must de `docs/03-design/acessibilidade.md` que se aplicam.
5. **Tom de voz:** confira os textos novos contra `docs/03-design/conteudo-e-tom-de-voz.md`.
6. **Segurança e dados:** procure chaves de API, dados reais e envio de dados a terceiros não registrados.
7. **Registros:** confira se os usos de IA e os assets novos estão na declaração e em licenças.
8. Escreva `revisao.md` com: veredito (✅ aprovado / ⚠️ aprovado com ressalvas / ❌ bloqueado), achados ordenados por gravidade e ações sugeridas.
9. Não corrija nada sozinho. Apresente os achados e pergunte o que corrigir.
