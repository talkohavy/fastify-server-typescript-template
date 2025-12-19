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
 */
export function addIdToRequestPlugin(app: FastifyInstance) {
  app.addHook('preHandler', (request, reply, done) => {
    // Use the x-request-id header if provided, otherwise generate a new UUID
    const requestId = (request.headers[REQUEST_ID_HEADER] as string) || randomUUID();

    // Store the requestId in the reply header for traceability
    reply.header(REQUEST_ID_HEADER, requestId);

    // Run the rest of the request lifecycle within the AsyncLocalStorage context
    requestContext.run({ requestId }, done);
  });
}
