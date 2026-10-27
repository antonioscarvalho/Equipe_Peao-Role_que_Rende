# Spec 005 — Plano de Prevenção de Recaída (Planos Se/Então) e Círculo de Confiança

- **Estado:** ✅ aprovada (Equipe Peão, 27/10/2026) · 🔄 **alterada pela revisão de 27/10/2026 — aguarda reaprovação**
- **Autor(es):** Ian Costa Guimarães · revisão: Maykon Júnio (com apoio de IA)
- **Aprovada por:** Equipe Peão em 2026-10-27 · reaprovação: _—_
- **Prioridade:** Should
- **Issue:** [#8](https://github.com/antonioscarvalho/equipepeao/issues/8) · **Fluxos:** [F5 e F8](../../docs/02-produto/fluxos.md)

> **O que mudou na revisão:** a evidência das intenções de implementação ficou com o nível correto; "construtor intuitivo" virou critério verificável (CA-2); uma só mensagem pronta (a do microcopy, CA-5); esta spec é dona do editor pós-lapso (CA-6); estados vazios para quando o SOS e a crise (Must) chamam esta spec (Should) e ela ainda não tem dados (CA-7).

## 1. Contexto e problema

Força de vontade isolada costuma não bastar diante de gatilhos fortes e repetitivos (dia do pagamento, tédio, brigas, jogo na TV). Planos no formato "Se [gatilho], então [ação]" (intenções de implementação) são um componente da prevenção de recaída; para apostas, a evidência específica ainda é de opinião de especialista ([matriz](../../docs/02-produto/matriz-conceito-funcionalidade.md), linha 4). Uma rede de apoio pessoal reduz o isolamento, e os Jogadores Anônimos estão associados à abstinência (ECR de Petry, 2006 — ver [pesquisa](../../docs/pesquisa/02-intervencoes.md)).

## 2. Pilar do desafio

- [x] Enfrentar momentos de vontade de jogar
- [ ] Reorganizar a vida financeira
- [x] Fortalecer redes de apoio
- [ ] Acessar ajuda especializada

## 3. Persona e cenário

- **Persona:** **Marcos** ([personas](../../docs/02-produto/publico-e-personas.md)), que já reconhece seus momentos de risco.
- **Cenário:** num momento tranquilo, Marcos monta seus planos e escolhe quem chamar, para ter tudo pronto quando a vontade vier.

## 4. Histórias de usuário

- Como **Marcos**, quero mapear meus gatilhos e definir o que fazer em cada um.
- Como **Marcos**, quero cadastrar até 3 pessoas de confiança para chamar rápido quando apertar.
- Como **Marcos**, quero que meus contatos fiquem só no meu celular e que o app nunca mande nada sozinho.

## 5. Critérios de aceite

- **CA-1:** Dado a tela de gatilhos, então há chips (dia do pagamento, solidão, briga, tédio, bebida, jogo na TV) com seleção múltipla e opção de texto livre.
- **CA-2:** Dado o criador de planos, então cada plano tem **dois campos** ("Se…" e "Então eu vou…") e **um botão** para salvar; há exemplos prontos (caminhar, ligar para alguém, ouvir música); o limite é **5 planos**, e ao atingir o limite o app explica que é preciso remover um.
- **CA-3:** Dado planos salvos, então eles aparecem como opções no passo de ação do SOS ([spec 003](../003-sos-fissura/spec.md)).
- **CA-4:** Dado o Círculo de Confiança, então dá para cadastrar nome e telefone de **até 3 pessoas**, guardados **só no aparelho**.
- **CA-5:** Dado um contato, quando a pessoa toca em **"Enviar pelo meu WhatsApp"** (ou SMS), então abre a conversa com a mensagem pronta *"Tô com vontade de apostar, pode falar comigo?"* e **a própria pessoa** decide enviar; o app nunca envia nada sozinho.
- **CA-6:** Dado o pós-lapso da [spec 004](../004-contador-e-dinheiro/spec.md), quando a pessoa toca em "Editar meu plano", então abre o editor desta spec com o gatilho marcado no pós-lapso já selecionado.
- **CA-7:** Dado que ainda não há planos nem contatos, quando o SOS (003) ou a crise ([006](../006-protocolo-crise-e-hub/spec.md)) pedem esses dados, então mostram um convite para criar depois e o CVV 188, sem travar o fluxo.

## 6. Acessibilidade

- Formulários com rótulo em cada campo e foco em ordem lógica pelo teclado.
- Botões de chamada com contraste de pelo menos 8:1 e texto (não só ícone).
- Compatível com leitor de tela no Android e no iOS.

## 7. Conteúdo e mensagens

- [Microcopy](../../docs/02-produto/microcopy.md), seções F5 e F8.
- Mensagens prontas do microcopy: *"Tô com vontade de apostar, pode falar comigo?"* e *"Hoje tá difícil, me liga quando puder?"*.

## 8. Fora do escopo

- Envio automático de mensagens ou notificações sem a pessoa tocar.
- Compartilhamento em redes sociais.
- Contatos em nuvem ou com terceiros (dado de terceiro, LGPD).

## 9. Conformidade com o edital (Seção 8.4)

- [x] Não promove nem simula apostas
- [x] Sem dinheiro real, criptoativos ou itens de valor monetário
- [x] Sem marcas proibidas
- [x] Linguagem sem estigma
- [x] Informações sensíveis com fonte (nível de evidência explícito na seção 1)
- [x] Só dados sintéticos ou do próprio usuário, no aparelho

## 10. Dúvidas em aberto

- Nenhuma. Fluxos alinhados com `docs/02-produto/fluxos.md` (F5 e F8).
