import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IAuthAdapter } from '../../authentication/adapters/auth.adapter.interface';
import type { IUsersAdapter } from '../adapters/users.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { ConfigKeys, type CookiesConfig } from '../../../../configurations';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly usersAdapter: IUsersAdapter,
    private readonly authAdapter: IAuthAdapter,
  ) {}

  private getProfile(app: FastifyInstance) {
    app.get(API_URLS.getProfile, async (req, res) => {
      const { cookies } = req;

      app.logger.info(`GET ${API_URLS.getProfile} - get user profile`);

      const token = this.extractAccessTokenFromCookies(cookies);

      const decodedToken = await this.authAdapter.verifyToken(token);

      if (!decodedToken) {
        res.status(StatusCodes.NO_CONTENT);
        return {}; // <--- silently fail
      }

      const userId = decodedToken?.id;

      const fetchedUser = await this.usersAdapter.getUserById(userId);

      return fetchedUser;
    });
  }

  private extractAccessTokenFromCookies(cookies: any) {
    const { accessCookie } = this.app.configService.get<CookiesConfig>(ConfigKeys.Cookies);
    return cookies[accessCookie.name];
  }

  registerRoutes() {
    this.app.register(this.getProfile.bind(this));
  }
}
