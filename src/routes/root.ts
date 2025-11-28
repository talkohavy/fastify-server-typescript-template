import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function root(fastify: FastifyInstance, _opts: FastifyPluginOptions): Promise<void> {
  fastify.get('/', async (_request, _reply) => {
    return { root: true };
  });
}
