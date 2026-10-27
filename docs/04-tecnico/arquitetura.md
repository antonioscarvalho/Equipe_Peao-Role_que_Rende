# Arquitetura

## Stack

| Camada | Tecnologia | Licença | Por que escolhemos |
|---|---|---|---|
| Engine / framework | _a definir_ | _a definir_ | _a definir_ |
| Linguagem | _a definir_ | — | _a definir_ |
| Interface | _a definir_ | _a definir_ | _a definir_ |
| Persistência | _a definir_ | _a definir_ | _a definir_ |
| Hospedagem / build | _a definir_ | _a definir_ | _a definir_ |

> O edital prefere engines open source (ex.: Godot, Phaser, Bevy). Toda dependência entra em [licenças e assets](../07-conformidade/licencas-e-assets.md).

## Visão geral

```
[Usuário] → [Interface] → [Lógica da aplicação] → [Armazenamento local]
                                   ↓
                     [Integrações externas, se houver]
```

_substituir pelo diagrama real_

## Módulos

| Módulo | Responsabilidade | Responsável |
|---|---|---|
| _a definir_ | _a definir_ | _a definir_ |

## Dados

- Que dados o protótipo guarda? _a definir_
- Onde ficam? Prefira armazenamento **local** no dispositivo, sem servidor com dados pessoais.
- Todos os dados de exemplo são **sintéticos**. Veja [dados e privacidade](../07-conformidade/dados-e-privacidade.md).

## Decisões técnicas (ADRs curtas)

| Data | Decisão | Alternativas consideradas | Motivo |
|---|---|---|---|
| _aaaa-mm-dd_ | _a definir_ | _a definir_ | _a definir_ |
