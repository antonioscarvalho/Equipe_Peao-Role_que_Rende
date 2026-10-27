import type { IncomingMessage, ServerResponse } from 'node:http';
import { criarApp } from '../src/app.js';

// Criado fora do handler para ser reaproveitado entre chamadas na mesma instância.
const app = criarApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit('request', req, res);
}
