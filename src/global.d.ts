import type { Mongoose } from 'mongoose';
import type { Client as PgClient } from 'pg';
import type { RedisClients } from './plugins/database/redis.plugin';

declare module 'fastify' {
  export interface FastifyInstance {
    sayHello(): string;
    pg: PgClient;
    mongo: Mongoose;
    redis: RedisClients;
  }

  export interface FastifyRequest {
    helloRequest: string;
    foo: any;
  }

  export interface FastifyReply {
    foo: any;
  }
}
