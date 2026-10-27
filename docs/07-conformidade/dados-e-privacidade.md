# Dados e privacidade

## Regras do edital (Seção 8.5)

- ✅ Permitido: dados **públicos**, **sintéticos** ou **fornecidos pela organização**.
- ❌ Proibido: dados de clientes do Banco do Brasil, sistemas internos ou credenciais institucionais.

## Princípios para o protótipo

O tema envolve dados sensíveis (saúde, finanças, comportamento). Mesmo sendo um protótipo, seguimos os princípios da LGPD (Lei nº 13.709/2018):

1. **Minimização:** coletar só o necessário para a funcionalidade.
2. **Local primeiro:** guardar dados no próprio dispositivo sempre que possível.
3. **Transparência:** informar o usuário sobre o que é guardado e por quê.
4. **Controle:** permitir apagar todos os dados facilmente.
5. **Nada de terceiros sem necessidade:** não enviar dados a APIs externas (inclusive de IA) sem necessidade e sem aviso.

## Inventário de dados do protótipo

| Dado | Finalidade | Onde fica | Sintético na demo? | Enviado a terceiros? |
|---|---|---|---|---|
| Motivo, metas, régua de importância/confiança | Onboarding motivacional e SOS | IndexedDB no aparelho | sim | não |
| Registro diário, lapsos, humor, fissura antes/depois | Contador, pós-lapso, autoeficácia | IndexedDB no aparelho | sim | não |
| Gatilhos e planos Se/Então | Prevenção de recaída | IndexedDB no aparelho | sim | não |
| Estimativa de gasto semanal e meta | Dinheiro preservado | IndexedDB no aparelho | sim | não |
| Contatos do Círculo de Confiança (dado de terceiro) | Mensagem pronta enviada pelo próprio usuário | IndexedDB no aparelho | sim | não |
| Plano de segurança | Protocolo de crise | IndexedDB no aparelho | sim | não |
| Preferências (tema, fonte, modo discreto) | Acessibilidade e discrição | localStorage | — | não |
| Transações bancárias | Demo de Open Finance | `seed.sql` / mock | **só sintético** | não (Pluggy sandbox, se usado) |

Detalhes e regras em [privacidade e dados locais](../04-tecnico/privacidade-e-dados-locais.md).

## Dados sintéticos

- Geramos dados fictícios para demonstrar a solução (ex.: orçamento de exemplo, histórico de uso).
- Origem e forma de geração: _a preencher_ (se gerados por IA, registrar na [declaração](declaracao-de-uso-de-ia.md))
