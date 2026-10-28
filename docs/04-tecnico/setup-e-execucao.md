# Setup e execução

> Qualquer integrante (ou a Banca) deve conseguir rodar o protótipo seguindo só este documento.

## Pré-requisitos

- Node 20 ou mais novo
- Navegador Chrome, Edge ou Firefox (para o giroscópio do Pulo do Bichinho no celular, HTTPS local — ver abaixo)
- Não precisa de Docker, Supabase nem chave de API para o protótipo atual
- Stack e motivação em [stack e motivação](stack-e-motivacao.md)

## Instalação

```bash
git clone https://github.com/antonioscarvalho/equipepeao.git
cd equipepeao/web
npm ci
```

## Variáveis de ambiente

O protótipo atual não usa variáveis de ambiente.

## Rodar em desenvolvimento

```bash
cd web
npm run dev          # http://localhost:5180 (também aceita acesso pela rede local)
npm run certs        # uma vez: gera certificado local em web/certs (OpenSSL)
npm run dev:https    # https://localhost:5443 — necessário para o giroscópio no celular
```

> Desde 28/10/2026 o `web/` publicado é a antiga prova visual (bichinho, missões, "Deu vontade", Pulo do Bichinho, personalização). O app anterior (SOS completo, check-in, plano, Círculo, testes) está em `lixo/web-antigo/` (`cd lixo/web-antigo && npm install && npm run dev`).

## Gerar build

```bash
cd web
npm run build        # checa os tipos e gera web/dist
npm run preview      # serve o build em http://localhost:4180
```

As fontes (Nunito Sans e Roboto) vêm do guia de estilo (`.claude/skills/guia-estilo-role-que-rende/assets/fontes/`) e entram no build: o app abre **sem internet**, sem Google Fonts.

## Demo offline (plano B)

A internet do evento pode falhar. Antes da etapa eliminatória:

- [ ] Build local testada **sem internet**
- [ ] Vídeo da demo gravado (o edital permite demonstração em vídeo)
- [ ] Build e vídeo em pelo menos dois notebooks da equipe

## Problemas conhecidos

| Problema | Solução |
|---|---|
| `npm run dev` dá 403 nas fontes | O `web/vite.config.ts` libera a pasta `assets` do guia em `server.fs.allow`; se mudar o caminho do guia, atualize ali |
| Giroscópio não funciona no celular | Use `npm run dev:https` e aceite o certificado local no navegador do celular |
| `npm ci` lento ou bloqueado na rede corporativa | Na rede com Zscaler: `export NODE_EXTRA_CA_CERTS=/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem` |
