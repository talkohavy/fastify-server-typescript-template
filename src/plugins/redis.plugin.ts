import type { FastifyInstance } from 'fastify';
import fastifyRedisPlugin from '@fastify/redis';
import { ConfigKeys, type RedisConfig } from '../configurations';

/**
 * @dependencies
 * - config-service plugin
 */
export async function redisPlugin(app: FastifyInstance): Promise<void> {
  const { connectionString } = app.configService.get<RedisConfig>(ConfigKeys.Redis);

  if (!connectionString) {
    throw new Error('Redis connection string is required');
  }

  await app.register(fastifyRedisPlugin, { url: connectionString, closeClient: true });
}
