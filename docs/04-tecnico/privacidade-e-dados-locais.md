# Privacidade por padrão e dados locais (Fase 3)

> Decidido em 27/10/2026. Complementa a [stack](stack-e-motivacao.md) do Danillo, que continua valendo, com uma regra: **dado sensível da pessoa não sai do aparelho**.
> Base: LGPD (Lei 13.709/2018) — dado de saúde é **dado sensível** (art. 5º, II) e exige consentimento específico e destacado (art. 11); skills `design-etico-saude-digital`, `seguranca-e-crise` e `conformidade-legal-br`; [pesquisa da Fase 1](../pesquisa/00-sintese.md).

## 1. Opções de stack consideradas

O prompt de produto pedia duas opções. A equipe já tinha decidido; fica registrada a comparação para este público (Android de entrada, internet instável, privacidade).

| Critério | **PWA com React + Vite** (escolhida como entregável principal) | **React Native com Expo** (segundo plano) |
|---|---|---|
| Android de entrada | Leve, sem instalar pela loja; ocupa pouco espaço | Precisa instalar; APK maior |
| Internet instável | Service worker deixa o app abrir offline depois da primeira visita | Funciona offline nativamente |
| Privacidade | IndexedDB local, apagável pelo próprio navegador; ícone e nome neutros possíveis no "instalar" | Armazenamento seguro nativo (SecureStore) mais forte |
| SOS a 1 toque | Ícone na tela inicial (instalado como PWA); sem widget | Widget e atalho nativos possíveis |
| Notificações | Web Push limitado e inconsistente em alguns aparelhos | Notificações nativas confiáveis |
| Demo para a Banca | Abre por um link, em qualquer navegador | Exige Expo Go ou APK |
| Tempo no Game Jam | Menor | Maior |

**Decisão:** PWA no Game Jam. O Expo fica para quando notificações de horário de risco e widget de SOS entrarem (Won't agora, na [matriz](../02-produto/matriz-conceito-funcionalidade.md)).

## 2. Onde cada dado mora

| Dado | Exemplo | Classificação | Onde fica | Sai do aparelho? |
|---|---|---|---|---|
| Motivo pessoal, metas, régua de importância e confiança | "Voltar a dormir bem" | **Sensível** (saúde) | IndexedDB local | **Não** |
| Registro diário, lapsos, humor, fissura antes/depois do SOS | "Apostei / não apostei", 8 → 3 | **Sensível** | IndexedDB local | **Não** |
| Plano Se/Então, gatilhos | "Se o jogo começar, então ligo pro meu irmão" | **Sensível** | IndexedDB local | **Não** |
| Estimativa de gasto semanal, meta do dinheiro preservado | R$ 150/semana → "conta de luz" | **Sensível** (finanças + contexto de saúde) | IndexedDB local | **Não** |
| Contatos do Círculo de Confiança | Nome e telefone | Dado de **terceiro** | IndexedDB local | **Não** (só o usuário envia a mensagem, pelo app de mensagens dele) |
| Plano de segurança (crise) | Sinais de alerta, quem chamar | **Sensível** | IndexedDB local | **Não** |
| Preferências (tema, fonte, modo discreto) | — | Comum | localStorage | Não |
| **Conteúdo do app** | Cards de distorção, textos do SOS, links do Hub, telefones | Público | Arquivos em `web/src/content/*.json` dentro do build; opcionalmente o Supabase serve versões novas | — |
| Dados do Open Finance (demo) | Transações | **Sintético** | `seed.sql` / mock | Só dado fictício |

**Consequência para o Supabase:** no MVP ele serve **conteúdo público** (cards, links, telefones com data de verificação) e a **demo sintética** de Open Finance via Edge Function. Nenhuma tabela com dado pessoal. Se algum dia a pessoa quiser backup ou sincronização entre aparelhos, isso entra como funcionalidade nova, com consentimento destacado, RLS e criptografia de ponta a ponta. **Não está no MVP.**

## 3. Como isso cabe na arquitetura do Danillo

O padrão de repositório da skill `supabase` já permite trocar a fonte do dado. Para o dado pessoal, o repositório é **local**:

```
tela → hook (useRegistros) → shared/repositories/registros.repository.ts (interface)
                                   ├── registros.local.ts   ← IndexedDB (MVP)
                                   └── registros.supabase.ts ← só se um dia houver sync com consentimento
conteúdo → hook (useConteudo) → content.repository.ts → JSON do build (offline) → [opcional] Supabase
```

- Biblioteca sugerida para IndexedDB: `idb` (ISC) ou `dexie` (Apache 2.0). Registrar com `/registrar-asset`.
- O conteúdo do build garante que **SOS, crise e Hub funcionam sem internet**.

## 4. Regras de privacidade do MVP

| Regra | Como implementar |
|---|---|
| **Uso sem cadastro** | Nenhuma tela de login no MVP. O app abre direto no onboarding. |
| **Offline-first** | Service worker (`vite-plugin-pwa`, MIT) com pré-cache do app e do conteúdo; dados no IndexedDB |
| **Criptografia local** | Com **PIN opcional**: chave derivada do PIN (PBKDF2 via WebCrypto) cifra os registros (AES-GCM). **Sem PIN**, os dados ficam no IndexedDB sem cifra forte — dizer isso com honestidade na tela de privacidade, em vez de prometer "tudo criptografado". |
| **Bloqueio do app** | PIN opcional ao abrir |
| **Modo discreto** | Nome e ícone neutros ao instalar ("Diário"), sem palavras como "aposta" na tela inicial nem no título da aba; opção nas configurações |
| **Apagar tudo** | Um botão em Configurações → confirmação em uma tela → limpa IndexedDB, localStorage e cache |
| **Exportar** | Baixar um JSON com os próprios dados (portabilidade, LGPD art. 18) |
| **Sem telemetria** | Nenhum analytics, pixel ou rastreador. Se a equipe quiser medir algo na demo, contar localmente e mostrar só na tela de "seu progresso" |
| **Nada sensível em URL ou log** | Rotas sem parâmetros com conteúdo (`/sos`, não `/sos?fissura=9`); nenhum `console.log` com dado do usuário no build |
| **Consentimento** | Tela curta no onboarding explicando o que fica no aparelho, com link para a política em linguagem simples; registro do consentimento só local |
| **Idade** | Aviso de que o app é para maiores de 18 anos, com orientação para menores procurarem um adulto de confiança e a rede de saúde (decisão final da equipe, ver dúvida aberta) |

## 5. Conteúdo com data de verificação

Todo texto regulatório, telefone e link fica em arquivo de conteúdo, nunca no código:

```json
{
  "id": "cvv",
  "nome": "CVV — Centro de Valorização da Vida",
  "telefone": "188",
  "url": "https://cvv.org.br",
  "descricao": "Conversa gratuita, 24 horas, com voluntários treinados.",
  "verificado_em": "2026-10-27",
  "fonte": "https://cvv.org.br"
}
```

O app mostra "Informação conferida em 27/10/2026" no Hub. Itens marcados com ⚠️ na pesquisa (teleatendimento do SUS, plataforma de autoexclusão depois da MP 1.394) ficam com `"status": "conferir"` e **não aparecem** até alguém confirmar.

## 6. Open Finance (só demo)

Conforme a [matriz](../02-produto/matriz-conceito-funcionalidade.md#2-ajustes-propostos-à-visão-do-produto):
- Somente dados **sintéticos** (mock ou sandbox da Pluggy), via Edge Function, com a chave só no servidor.
- Tela de demonstração claramente marcada "Simulação com dados fictícios".
- O app **nunca conclui** que houve recaída: no máximo pergunta "Quer registrar como foi esse dia?".
- Nenhum dado de cliente do Banco do Brasil (edital, Seção 8.5).
