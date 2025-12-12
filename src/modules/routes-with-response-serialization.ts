import type { FastifyInstance, RouteShorthandOptions } from 'fastify';

export async function routesWithResponseSerialization(fastify: FastifyInstance, _options: object) {
  const opts: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  };

  fastify.get('/api/response-serialization', opts, async (_request, _reply) => {
    return { message: 'my serialized response', thisKeyWillNotBeSent: 'this key will not be sent' };
  });
}
