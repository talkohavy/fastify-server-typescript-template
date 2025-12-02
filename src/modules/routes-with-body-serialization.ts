import type { FastifyInstance, RouteShorthandOptions } from 'fastify';

export async function routesWithBodySerialization(fastify: FastifyInstance, _options: object) {
  const opts: RouteShorthandOptions = {
    schema: {
      body: {
        type: 'object',
        properties: {
          someNumber: { type: 'string' }, // <--- try changing this from 'string' to 'number'
          someKey: { type: 'string' },
          someOtherKey: { type: 'number' },
        },
      },
    },
  };

  fastify.post('/api/body-serialization', opts, async (request, _reply) => {
    console.log('request.body is:', request.body);
    return { valid: true, serializedBody: request.body };
  });
}
