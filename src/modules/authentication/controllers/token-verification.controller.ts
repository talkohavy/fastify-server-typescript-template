import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { TokenVerificationService } from '../services/token-verification.service';
import { API_URLS } from '../../../common/constants';
import { ConfigKeys, type CookiesConfig } from '../../../configurations';
import { UnauthorizedError } from '../../../lib/Errors';

export class TokenVerificationController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly tokenVerificationService: TokenVerificationService,
  ) {}

  private verifyToken(app: FastifyInstance) {
    app.get(API_URLS.verifyToken, async (req, _res) => {
      const { cookies } = req as any;

      app.log.info(`GET ${API_URLS.verifyToken} - verify tokens`);

      const encodedToken = this.extractAccessTokenFromCookies(cookies);

      if (!encodedToken) {
        app.log.error('No token found in cookies');
        throw new UnauthorizedError('No token provided');
      }

      const decodedToken = await this.tokenVerificationService.verifyToken(encodedToken);

      return decodedToken;
    });
  }

  private extractAccessTokenFromCookies(cookies: any): string {
    const { accessCookie } = this.app.configService.get<CookiesConfig>(ConfigKeys.Cookies);
    const token = cookies[accessCookie.name] as string;

    return token;
  }

  registerRoutes() {
    this.app.register(this.verifyToken.bind(this));
  }
}
