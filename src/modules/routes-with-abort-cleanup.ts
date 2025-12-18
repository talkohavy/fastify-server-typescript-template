import type { FastifyInstance } from 'fastify';

export default async function routesWithAbortCleanup(app: FastifyInstance, _options: object) {
  app.post('/api/abort-with-cleanup', async (request, reply) => {
    /**
     * doesn't work as expected!
     * The `close` event is triggered immediately!
     * And not when the request is closed!
     */
    request.raw.on('close', () => {
      console.log('request.raw.aborted:', request.raw.aborted);
      console.log('request.raw.destroyed:', request.raw.destroyed);
      if (request.raw.aborted) {
        app.logger.info('request closed');
      }
    });

    await sleep(3000);

    reply.code(200).send({ ok: true });
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
