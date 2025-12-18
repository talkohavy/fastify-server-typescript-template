import type { Mongoose } from 'mongoose';
import type { Client as PgClient } from 'pg';
import type { OptimizedApp } from './common/types';
import type { ConfigService } from './lib/config-service';
import type { ILogger } from './lib/logger';
import type { RedisClients } from './plugins/database/redis.plugin';

declare module 'fastify' {
  export interface FastifyInstance extends OptimizedApp {
    pg: PgClient;
    mongo: Mongoose;
    redis: RedisClients;
    configService: ConfigService;
    logger: ILogger;
  }

  export interface FastifyRequest {
    helloRequest: string;
    foo: any;
  }

  export interface FastifyReply {
    foo: any;
  }
}
