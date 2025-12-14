import type { FastifyInstance } from 'fastify';
import fastifyRedisPlugin from '@fastify/redis';

export async function redisPlugin(app: FastifyInstance): Promise<void> {
  const url = process.env.REDIS_CONNECTION_STRING as string;

  if (!url) {
    throw new Error('REDIS_CONNECTION_STRING is not set');
  }

  await app.register(fastifyRedisPlugin, { url, closeClient: true });
}
