import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import createPlugin from 'fastify-plugin';

/**
 * To achieve proper encapsulation across requests configure a new value for
 * each incoming request in the 'onRequest' hook.
 */
async function asyncHookPluggable(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.decorateRequest('foo');
  fastify.addHook('onRequest', async (req, _reply) => {
    req.foo = { bar: 42 };
  });
}

const asyncHookPlugin = createPlugin(asyncHookPluggable);

export default asyncHookPlugin;
