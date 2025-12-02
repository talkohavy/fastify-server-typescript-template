import type { FastifyInstance, RouteShorthandOptions } from 'fastify';

export async function routesWithBodyValidation(fastify: FastifyInstance, _options: object) {
  const opts: RouteShorthandOptions = {
    schema: {
      body: {
        type: 'object',
        properties: {
          someKey: { type: 'string' },
          someOtherKey: { type: 'number' },
          hello: { type: 'string' },
        },
      },
    },
  };

  fastify.post('/api/body-validation', opts, async (request, _reply) => {
    console.log('request.body is:', request.body);
    return { valid: true };
  });
}
