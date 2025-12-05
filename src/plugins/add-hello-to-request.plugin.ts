import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import createPlugin from 'fastify-plugin';

async function addHelloToRequestPluggable(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.decorateRequest('hello', 'Hello World');
  fastify.decorate('helloInstance', 'Hello Fastify Instance');
}

const addHelloToRequestPlugin = createPlugin(addHelloToRequestPluggable);

export default addHelloToRequestPlugin;
