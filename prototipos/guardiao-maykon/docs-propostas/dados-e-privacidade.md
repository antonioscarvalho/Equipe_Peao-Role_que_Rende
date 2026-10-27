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
| Motivo (chips e texto), importância e confiança (0–10) | Lembrar o "porquê" no início e no SOS | `localStorage` do aparelho | sim | não |
| Gasto semanal estimado e meta concreta | Estimar dinheiro preservado | `localStorage` | sim | não |
| Registro diário (apostou ou não, humor opcional, pós-lapso em texto livre) | Contador de dias e ajuste do plano | `localStorage` | sim | não |
| Plano Se/Então e gatilhos | Prevenção de recaída | `localStorage` | sim | não |
| Até 3 contatos de confiança (nome e telefone) — dado de terceiro | Círculo de Confiança | `localStorage` | sim (fictício) | não; a pessoa decide ligar ou enviar |
| Plano de segurança (texto livre) | Protocolo de crise | `localStorage` | não (vazio na demo) | não |
| Episódios do SOS (data, vontade antes e depois) | Mostrar que a vontade cai | `localStorage` | sim | não |
| Preferências (fonte, contraste, animações) | Acessibilidade | `localStorage` | — | não |

Não há cadastro, login, servidor, analytics nem cookies. "Baixar meus dados" exporta tudo em JSON e "Apagar tudo" remove tudo, os dois em Configurações.

## Pendências de privacidade (antes de um lançamento real)

- **Criptografia local com PIN** (Web Crypto): hoje o `localStorage` não é criptografado, e outra pessoa da casa com acesso ao navegador pode ler os dados.
- **Modo discreto**: nome e ícone neutros na tela inicial do celular.
- Termo de consentimento específico para dados de saúde (LGPD art. 11) revisado por assessoria jurídica; hoje há uma confirmação simples nas boas-vindas.
- Política de idade (menores de 18 anos).

## Dados sintéticos

- Geramos dados fictícios para demonstrar a solução (ex.: orçamento de exemplo, histórico de uso).
- Origem e forma de geração: arquivo `web/src/lib/demo.ts`, escrito à mão com apoio do Claude Code (registrado na [declaração](../../../docs/07-conformidade/declaracao-de-uso-de-ia.md)). Persona fictícia "Rafael": 12 dias de jornada, um lapso no dia do pagamento, gasto de R$ 150/semana, contato "Irmão (exemplo)" com telefone inválido `61900000000`. Ativado abrindo o app com `?demo`.
