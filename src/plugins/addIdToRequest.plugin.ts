import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { requestContext } from '../lib/logger/request-context';

const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Request ID plugin that:
 * 1. Extracts x-request-id from incoming request headers (if present)
 * 2. Generates a new UUID if no x-request-id header is provided
 * 3. Wraps the entire request lifecycle in AsyncLocalStorage context
 *    so that the requestId is automatically available in all logs
 * 4. Decorates the request with requestId for easy access via request.requestId
 */
export function addIdToRequestPlugin(app: FastifyInstance) {
  app.decorateRequest('requestId', '');

  app.addHook('preHandler', (request, reply, done) => {
    const requestId = (request.headers[REQUEST_ID_HEADER] as string) || randomUUID();

    request.requestId = requestId;

    reply.header(REQUEST_ID_HEADER, requestId); // <--- respond with the same requestId for traceability

    requestContext.run({ requestId }, done); // Run the rest of the request lifecycle within the AsyncLocalStorage context
  });
}
