import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import { API_URLS } from '../../../common/constants';

export class SessionManagementController implements ControllerFactory {
  constructor(private readonly app: FastifyInstance) {}

  private logout(app: FastifyInstance) {
    app.get(API_URLS.authLogout, async (_req, _res) => {
      app.logger.info(`GET ${API_URLS.authLogout} - user logout`);

      // maybe blacklist token here

      return {};
    });
  }

  registerRoutes() {
    this.app.register(this.logout.bind(this));
  }
}
