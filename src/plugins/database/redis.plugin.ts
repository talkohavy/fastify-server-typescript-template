import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createClient, type RedisClientType } from 'redis';

export const redisPlugin = fp(redisPluggable, {
  name: 'fastify-redis',
  fastify: '5.x',
});

async function createRedisClient(
  connectionString: string,
  name: string,
  maxRetries: number,
  retryTimeout: number,
  fastify: FastifyInstance,
): Promise<RedisClientType> {
  const client = createClient({
    url: connectionString,
    socket: {
      reconnectStrategy: (retriesSoFar: number) => {
        if (retriesSoFar >= maxRetries) {
          fastify.log.error(`Max retries (${maxRetries}) reached for Redis ${name} client`);
          return new Error('CANNOT_CONNECT_TO_REDIS');
        }
        fastify.log.warn(`Retrying Redis ${name} connection (${retriesSoFar + 1}/${maxRetries})...`);
        return retryTimeout;
      },
    },
  });

  client.on('error', (err) => {
    fastify.log.error(`❌ Redis ${name} client error:`, err);
  });

  client.on('connect', () => {
    fastify.log.info(`✅ Redis ${name} client connected`);
  });

  await client.connect();

  return client as RedisClientType;
}

export type RedisClients = {
  pub: RedisClientType;
  sub: RedisClientType;
};

export type RedisPluginOptions = {
  connectionString: string;
  maxRetries?: number;
  retryTimeout?: number;
};

async function redisPluggable(fastify: FastifyInstance, options: RedisPluginOptions): Promise<void> {
  const { connectionString, maxRetries = 5, retryTimeout = 15000 } = options;

  if (!connectionString) {
    throw new Error('Redis connection string is required');
  }

  try {
    const [pubClient, subClient] = await Promise.all([
      createRedisClient(connectionString, 'pub', maxRetries, retryTimeout, fastify),
      createRedisClient(connectionString, 'sub', maxRetries, retryTimeout, fastify),
    ]);

    const redisClients: RedisClients = {
      pub: pubClient,
      sub: subClient,
    };

    // Decorate fastify instance - accessible as fastify.redis.pub / fastify.redis.sub
    fastify.decorate('redis', redisClients);

    // Graceful shutdown - Fastify calls this automatically on close
    fastify.addHook('onClose', async (instance) => {
      try {
        await Promise.all([pubClient.quit(), subClient.quit()]);
        instance.log.info('📴 Redis connections closed');
      } catch (error: any) {
        instance.log.error('❌ Error closing Redis connections:', error);
      }
    });
  } catch (error: any) {
    fastify.log.error('❌ Failed to connect to Redis:', error);
    throw error;
  }
}
