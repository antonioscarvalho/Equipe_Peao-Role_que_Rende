# Integrações e APIs externas

> Toda conexão com serviço externo (APIs, modelos de IA, mapas, autenticação, analytics etc.) é registrada aqui **antes** de entrar no código.

## Regras do edital que se aplicam

- ❌ Proibido integrar com plataformas de apostas (Seção 8.4).
- ❌ Proibido usar dados de clientes, sistemas internos ou credenciais do Banco do Brasil (Seção 8.5).
- ✅ APIs de terceiros são permitidas com licença ou termos compatíveis, identificadas na entrega (Seção 8.5).
- ✅ APIs de IA são permitidas e devem constar na [declaração de uso de IA](../07-conformidade/declaracao-de-uso-de-ia.md).

## Registro de integrações

| # | Serviço / API | Finalidade | Dados enviados | Autenticação | Termos / licença | Usa IA? | Status |
|---|---|---|---|---|---|---|---|
| 1 | WhatsApp "Click to Chat" (`wa.me`) | Spec 005: a pessoa abre a conversa com alguém do Círculo de Confiança com a mensagem pronta | Nenhum pelo app. Quando a **própria pessoa** toca no link, o WhatsApp recebe o número do contato e o texto da mensagem | Nenhuma (link público) | https://www.whatsapp.com/legal/terms-of-service | não | ✅ |

**Checklist do item 1 (`wa.me`):** termos permitem link público ✅ · nenhum dado vai para o nosso servidor; na demo, só o contato fictício `(61) 90000-0000` ✅ · sem chave de API ➖ · `.env.example` ➖ · fallback: botão de SMS ao lado e, no notebook, o WhatsApp Web ✅ · sem IA ➖

## Checklist por integração

- [ ] Os termos de uso permitem o uso em protótipo / competição
- [ ] Nenhum dado pessoal real é enviado (só dados sintéticos)
- [ ] Chaves de API ficam em variáveis de ambiente (`.env`), **nunca** no repositório
- [ ] `.env.example` atualizado com o nome da variável (sem o valor)
- [ ] Existe comportamento de fallback se a API cair durante a demo
- [ ] Registrada na tabela acima e, se for IA, na declaração de uso de IA

## Segredos

- Chaves e tokens nunca vão para o Git. Garanta que `.env` esteja no `.gitignore`.
- Se uma chave vazar em commit, **revogue imediatamente** no provedor; remover do histórico não basta.
