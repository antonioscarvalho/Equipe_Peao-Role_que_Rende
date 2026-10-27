import { criarApp } from './app.js';

const app = criarApp();
const port = Number(process.env.PORT ?? 3333);

app.listen({ port, host: '0.0.0.0' }).catch((erro) => {
  app.log.error(erro);
  process.exit(1);
});
