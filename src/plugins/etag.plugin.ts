import type { FastifyInstance } from 'fastify';
import fastifyEtag from '@fastify/etag';

export async function etagPlugin(app: FastifyInstance) {
  await app.register(fastifyEtag);
}

