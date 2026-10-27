import cors from '@fastify/cors';
import Fastify from 'fastify';
import { rotasSaude } from './routes/saude.js';

export function criarApp() {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  // CORS_ORIGIN aceita uma lista separada por vírgula; sem ela, libera tudo (só serve em dev).
  const origens = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim());
  app.register(cors, { origin: origens ?? true });

  app.register(rotasSaude);
  return app;
}
