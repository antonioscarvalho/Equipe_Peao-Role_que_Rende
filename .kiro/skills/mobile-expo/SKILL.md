---
name: mobile-expo
description: Como escrever o app mobile em mobile/ com React Native e Expo: Expo Router, componente nativo, estilo, Supabase no celular, teste no aparelho pelo Expo Go e build com EAS. Use ao criar ou alterar tela ou componente do app mobile, ao instalar biblioteca nele, ou ao gerar build.
---

# Mobile: React Native com Expo

Motivação da escolha em `docs/04-tecnico/stack-e-motivacao.md`. Componente visual segue a skill `ui-ux-designer`.

## Antes de tudo

O Expo muda API a cada versão do SDK. Leia a versão do pacote `expo` em `mobile/package.json` e confira a documentação daquela versão (`https://docs.expo.dev/versions/v<major>.0.0/`) antes de usar qualquer API do Expo. Não escreva de memória.

## Estrutura

```
mobile/
├── app.json
└── src/
    ├── app/              # Expo Router: cada arquivo é uma tela, _layout.tsx é o navegador
    ├── components/       # peças nativas reutilizáveis
    ├── lib/supabase.ts   # cliente do Supabase com sessão no AsyncStorage
    └── theme/            # os mesmos tokens do web, em objeto
shared/                   # tipos, repositórios e validação, iguais aos do web
```

## Passos

1. Ache a tela na spec. A lógica (tipo, consulta, validação, cálculo) vem de `shared/`; se ela ainda não está lá, ponha lá e use nos dois apps.
2. Biblioteca nova **sempre** com `npx expo install <pacote>`, nunca `npm install`: ele escolhe a versão compatível com o SDK.
3. Componente usa `View`, `Text`, `Pressable`, `Image` e `StyleSheet.create`. Nada de `div` nem CSS.
4. Confira no aparelho: `npx expo start` e leia o QR code com o Expo Go. Biblioteca com código nativo fora do Expo Go pede development build; avise antes de adicionar uma.
5. Rode `npx tsc --noEmit` e `npx expo lint`.

## Regras

- Navegação só pelo Expo Router (`Link`, `router`, `useLocalSearchParams`), com as telas em `src/app/`.
- Não crie nem edite `ios/` e `android/` à mão: configuração nativa vai em `app.json` e plugins.
- Variável no cliente leva o prefixo `EXPO_PUBLIC_` e vai no app instalado: só URL e chave anon do Supabase.
- Área de toque de pelo menos 44×44 pontos e `accessibilityLabel` em todo controle só com ícone.
- O app tem que abrir e mostrar algo útil sem rede: o momento de vontade de jogar não espera o 4G.
