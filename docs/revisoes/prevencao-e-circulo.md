# Revisão — Plano Se/Então e Círculo de Confiança (spec 005)

- **Data:** 27/10/2026 · **Revisor:** Kiro (Claude Opus 5.5), para revisão humana de Atyrson Souto
- **Alvo (`/conformidade-legal-br`):** `web/src/app/plano`, `web/src/app/circulo`, `web/src/components/AcoesDoPlano.tsx`
- **Também lidos:** `web/src/components/EnviarMensagem.tsx`, `web/src/content/prevencao.json`, `web/src/domain/mensagem.ts`, `web/src/lib/{db,prevencao,circulo}.ts`
- **Veredito:** ⚠️ aprovado com ressalvas. Nenhum ❌. As ressalvas são a revisão clínica dos textos e itens que dependem de outras specs (PIN, "Apagar tudo").

## Resultado da revisão: plano, círculo e AcoesDoPlano

### ❌ Pode desclassificar (edital)
- Nenhum item encontrado.

### ⚠️ Riscos legais
- [`web/src/lib/db.ts`] Gatilhos e planos são dado referente à saúde (dado sensível, LGPD art. 5º, II) e nome e telefone do Círculo são dado de terceiro. Ficam só no IndexedDB, **sem criptografia**. — LGPD, segurança e minimização — Correção: criptografia local com PIN (mesma pendência do SOS, `docs/revisoes/sos.md`).
- [`web/src/app/plano/Plano.tsx`] A tela do plano não diz onde os dados ficam (a do Círculo diz: "Os contatos ficam só neste celular."). — LGPD, transparência — Correção sugerida: acrescentar em `prevencao.json` → `plano` uma nota "Seu plano fica só neste celular." e exibi-la abaixo do título.
- [`web/src/components/EnviarMensagem.tsx`] Ao tocar em "Enviar pelo meu WhatsApp", o telefone e o texto vão para o WhatsApp (Meta), por escolha da pessoa. O app não envia nada e usa `rel="noopener noreferrer"` (sem *referrer*). — LGPD, transparência — Melhoria: a tela de privacidade da spec 008 deve citar que o WhatsApp e o SMS são apps de terceiros.
- "Apagar tudo" (`apagarBanco`) já remove as stores novas, mas o botão na interface é da spec 008. — LGPD, direito de eliminação — Pendente na 008. Enquanto isso, cada plano e cada contato tem "Apagar".

### 💡 Melhorias (acessibilidade e boas práticas)
- O `.esqueleto` de carregamento só ganha estilo quando a 004 entrar (a classe vem de lá).
- O pedido de "foco no primeiro campo com erro" está feito; vale testar com TalkBack e VoiceOver em aparelho real antes da demo.

### ✅ Itens conformes
| Item do checklist | Evidência |
|---|---|
| Nada promove apostas; nenhuma integração com casas de apostas | Mensagens e textos em `prevencao.json`; único link externo é `wa.me` (mensageiro) |
| Sem dinheiro real, cripto, prêmio ou mecânica de sorte | Não há pontuação nem recompensa nas telas |
| Sem marcas de casas de apostas, clubes ou atletas | Conferido em `prevencao.json` |
| Linguagem sem estigma | `conteudo.test.ts` roda o vocabulário vedado sobre `prevencao.json` |
| Apoio complementar, não substituto | Nota do Início; CVV 188 no estado vazio do SOS (CA-7) |
| Só dados sintéticos | Demo: "Irmão (exemplo)", `(61) 90000-0000`, só com `import.meta.env.DEV` |
| Minimização e dado só no aparelho | Stores `prevencao`, `planos`, `circulo` no IndexedDB; testes de `circulo.ts` e `Circulo.tsx` falham se houver `fetch` |
| O app nunca envia mensagem sozinho (CA-5) | Envio é sempre `<a href="https://wa.me/...">` ou `sms:`; nota fixa "A gente nunca manda mensagem sozinho." (`Circulo.test.tsx`) |
| Nenhum dado na URL | Rotas `/plano` e `/circulo` sem parâmetros; gatilhos iniciais em memória (`App.test.tsx`) |
| Contato de terceiro guardado só localmente e só o necessário | Só nome e telefone; `autocomplete="off"` para o navegador não sugerir os dados da própria pessoa |
| Saída para a crise | "Preciso de ajuda agora" no topo das duas telas (`App.test.tsx`); CVV 188 no SOS sem plano |
| Sem dark patterns | Limite explicado sem cobrança ("Edite ou apague um."); nada de urgência, culpa ou notificação |
| Acessibilidade (LBI, WCAG 2.1 AA) | Rótulo em todo campo; erros com `aria-describedby` e `aria-invalid`; erro não só por cor (ícone ⚠ e borda); foco no título a cada passo; alvos de 48 px; fluxo completo pelo teclado; contraste de 8,9:1 nos botões de envio (`contraste.test.ts`) |
| XSS e logs | Nenhum `dangerouslySetInnerHTML`, `console` ou `localStorage` nos arquivos revisados; React escapa o texto |
| Propriedade intelectual | Nenhuma dependência nova; `wa.me` registrado em `licencas-e-assets.md` e `integracoes-externas.md` |
| ECA / ECA Digital | ➖ Sem coleta para servidor e sem elemento voltado a crianças |

### Pendências para conferir
- Revisão clínica dos textos de `prevencao.json` (`"revisaoClinica": "pendente"`), em especial os exemplos de ação e o convite do SOS.
- Formato do link `wa.me` conferido no FAQ oficial do WhatsApp ("How to use click to chat", faq.whatsapp.com) em 27/10/2026.

## Checklist `docs/07-conformidade/regras-de-conteudo.md`

| Item | Resultado |
|---|---|
| Nada promove, incentiva, divulga ou faz publicidade de apostas | ✅ |
| Nenhuma integração com plataformas de apostas | ✅ |
| Nenhuma mecânica com dinheiro real, criptoativos ou itens com valor monetário | ✅ |
| Mecânicas de sorte/recompensa só com finalidade educativa | ➖ não há |
| Nenhuma marca de casa de apostas, clube ou atleta | ✅ |
| Marcas BB/BBDW só como autorizado | ✅ nenhuma marca nova |
| Linguagem respeitosa, sem estigma | ✅ (teste automatizado) |
| Informações de saúde com fonte | ✅ nível de evidência na spec, seção 1; textos ⚠️ com revisão clínica pendente |
| Não se apresenta como substituto de tratamento | ✅ |
| Só dados públicos, sintéticos ou do próprio usuário | ✅ |
| Conteúdo produzido durante o Game Jam | ✅ commits de 27/10/2026 na branch `feat/005-prevencao-e-circulo-atyrson` |
| Uso de IA declarado; assets e APIs listados | ✅ declaração, item 17; `wa.me` em licenças e integrações |

## Checklists das skills

- **`prevencao-recaida`:** planos Se/Então ligados aos gatilhos ✅; aparecem no momento da vontade (passo de ação do SOS) ✅; rede de apoio a 1 toque no SOS ✅; ligação com o pós-lapso (CA-6) ⬜ depende da T010.
- **`design-etico-saude-digital`:** coleta mínima e local ✅; sem métrica de retenção ✅; sem envio automático nem notificação ✅; criptografia ⚠️ pendente (PIN).

> Revisão técnica de apoio. Não substitui parecer jurídico.
