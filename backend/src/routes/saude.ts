import type { FastifyInstance } from 'fastify';

export async function rotasSaude(app: FastifyInstance) {
  app.get('/api/saude', async () => ({
    status: 'ok',
    ambiente: process.env.VERCEL_ENV ?? 'local',
    versao: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
  }));
}
