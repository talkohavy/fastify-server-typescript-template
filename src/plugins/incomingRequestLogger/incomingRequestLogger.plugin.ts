import type { FastifyInstance } from 'fastify';
import { API_URLS } from '../../common/constants';
import { SENSITIVE_BODY_FIELDS, SENSITIVE_HEADERS } from './logic/constants';
import { redactSensitiveData } from './logic/utils/redactSensitiveData';

/**
 * @dependencies
 * - logger plugin
 * - requestId plugin (for request context)
 */
export function incomingRequestLoggerPlugin(app: FastifyInstance) {
  app.addHook('preHandler', (request, _reply, done) => {
    if (request.url.startsWith(API_URLS.healthCheck)) {
      return done();
    }

    app.logger.info('Incoming request', {
      method: request.method,
      url: request.url,
      query: request.query,
      params: request.params,
      headers: redactSensitiveData(request.headers, SENSITIVE_HEADERS),
      body: redactSensitiveData(request.body, SENSITIVE_BODY_FIELDS),
    });

    done();
  });
}
