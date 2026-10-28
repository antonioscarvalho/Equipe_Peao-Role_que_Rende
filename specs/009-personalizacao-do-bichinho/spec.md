# Spec 009 — Personalização do bichinho

- **Estado:** 🔍 implementada · aguarda aprovação da equipe
- **Autor(es):** Atyrson Souto (com apoio de IA)
- **Prioridade:** Should
- **Relaciona:** [002 Guardião](../002-onboarding-e-guardiao/spec.md) (marcos CA-9 e CA-10), [004](../004-contador-e-dinheiro/spec.md) (total de dias)

## 1. Contexto
Deixar o bichinho com a cara da pessoa aumenta o vínculo com o companheiro, sem criar mecânica de jogo de azar.

## 2. Critérios de aceite
- **CA-1:** A tela "Personalizar bichinho" (rota `/personalizar`, botão na aba Rolê) permite escolher cor do corpo (6), roupa (4 + cachecol), cor da roupa (5), cabeça (4 + flor), rosto (2) e peito (1 + estrela).
- **CA-2:** Tudo é livre desde o primeiro dia. **Não existe** loja, moeda, pontos, preço, sorteio nem item raro.
- **CA-3:** Só os itens de marco têm condição: cachecol (7 dias), flor no broto (30) e estrela (90). Eles aparecem desde o início, desativados, com "Com N dias · faltam X dias", e o próximo marco é anunciado no topo (spec 002, CA-9).
- **CA-4:** Um lapso não tira nenhum item: o desbloqueio usa o total de dias sem apostar, que nunca diminui (spec 002, CA-10).
- **CA-5:** A escolha aparece no bichinho da aba Rolê em todos os humores; o humor "cansado" só esfria a cor escolhida.
- **CA-6:** A escolha fica só no aparelho (IndexedDB `guardiao`, store `configuracao`, chave `aparencia`), é validada na leitura e é apagada pelo "Apagar tudo".
- **CA-7:** Acessibilidade: cada grupo é um `fieldset` com rádios nativos (teclado e leitor de tela), alvo ≥ 48 px, e o `aria-label` do bichinho descreve a aparência ("corpo rosa, de moletom roxo, com boné"). Todas as cores do corpo têm contraste ≥ 3:1 com o contorno (testado).

## 3. Fora do escopo
Itens pagos, trocáveis ou colecionáveis; compartilhar o visual; cores livres (seletor RGB).

## 4. Implementação
Tudo fica em `web/src/personalizacao/`, para não atrapalhar quem mexe no resto do app. O app só importa de `personalizacao/index.ts`.
- Domínio: `aparencia.ts` (catálogo, marcos, saneamento, descrição).
- Dados: `armazenamento.ts` (localStorage `rqr:aparencia`, sincroniza entre abas). Dias sem apostar vêm de `DIAS_SEM_APOSTAR_DEMO` (12, igual à tela inicial) até o contador real existir.
- Arte original (SVG em camadas): `ItensBichinho.tsx`, montada em `web/src/Bichinho.tsx` pela prop opcional `aparencia`. Sem a prop, o bichinho fica igual ao original.
- Tela: `Personalizar.tsx`, aberta em `/#personalizar` pelo ícone de paleta na cena da tela inicial (`BotaoPersonalizar.tsx`). Ctrl/clique do meio abre em outra aba do navegador.
- Estilos: `personalizacao.css` (não altera `styles.css`).
- Pontos de contato fora da pasta: `main.tsx` (envolve o app em `ComPersonalizacao`), `App.tsx` (ícone e prop `aparencia`), `Bichinho.tsx` (camadas e ids únicos por instância).

> Na prova visual o CA-6 usa localStorage em vez de IndexedDB, e o "Apagar tudo" ainda não existe; `apagarAparencia()` já está exportada para quando existir.
