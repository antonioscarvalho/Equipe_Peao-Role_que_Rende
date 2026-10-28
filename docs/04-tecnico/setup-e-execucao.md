# Setup e execução

> Qualquer integrante (ou a Banca) deve conseguir rodar o protótipo seguindo só este documento.

## Pré-requisitos

- Node 22 ou mais novo (o `web/` declara `engines`). No Node 20 os testes nem começam: o `undici`, que o jsdom puxa, usa uma função de compressão que só existe a partir do 22
- Docker, para rodar o Supabase local (`npx supabase start`)
- Celular com o app **Expo Go**, para testar o mobile
- Stack e motivação em [stack e motivação](stack-e-motivacao.md)

## Instalação

```bash
git clone https://github.com/antonioscarvalho/equipepeao.git
cd equipepeao
# TODO: passos de instalação
```

## Variáveis de ambiente

```bash
cp .env.example .env
# preencher as chaves (ver docs/04-tecnico/integracoes-externas.md)
```

## Rodar em desenvolvimento

```bash
# TODO
```

## Gerar build

```bash
# TODO
```

## Demo offline (plano B)

A internet do evento pode falhar. Antes da etapa eliminatória:

- [ ] Build local testada **sem internet**
- [ ] Vídeo da demo gravado (o edital permite demonstração em vídeo)
- [ ] Build e vídeo em pelo menos dois notebooks da equipe

## Problemas conhecidos

| Problema | Solução |
|---|---|
| _a definir_ | _a definir_ |
