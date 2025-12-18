import type { CookieSerializeOptions } from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IUsersAdapter } from '../../users/adapters/users.adapter.interface';
import type { IAuthAdapter } from '../adapters/auth.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { ConfigKeys, type CookiesConfig, type Config } from '../../../../configurations';
import { BadRequestError } from '../../../../lib/Errors';
import { UserNotFoundError } from '../../../users/logic/users.errors';

export class AuthenticationController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly authAdapter: IAuthAdapter,
    private readonly usersAdapter: IUsersAdapter,
  ) {}

  private login(app: FastifyInstance) {
    app.post(API_URLS.authLogin, async (req, res) => {
      try {
        const { body } = req as any;

        app.logger.info(`POST ${API_URLS.authLogin} - user login endpoint`);

        const { email, password } = body;

        // Step 1: Get user by email
        const user = await this.usersAdapter.getUserByEmail(email);
        if (!user) {
          res.status(StatusCodes.NOT_FOUND);
          return { message: 'User not found' };
        }

        // Step 2: Validate password
        const isValid = await this.authAdapter.getIsPasswordValid(user.hashed_password, password);

        if (!isValid) {
          res.status(StatusCodes.UNAUTHORIZED);
          return { message: 'Invalid credentials' };
        }

        // Step 3: Generate tokens
        const tokens = await this.authAdapter.createTokens(user.id.toString());

        // Step 4: Set cookies
        const { cookies, isDev } = app.configService.get<Config>('');
        const { name: accessTokenCookieName, maxAge } = cookies.accessCookie;
        const { name: refreshTokenCookieName } = cookies.refreshCookie;

        const options: CookieSerializeOptions = {
          secure: !isDev,
          httpOnly: true,
          domain: isDev ? undefined : '.luckylove.co.il',
          path: '/',
          maxAge,
          sameSite: 'strict',
        };

        res.cookie(accessTokenCookieName, tokens.accessToken, options);
        res.cookie(refreshTokenCookieName, tokens.refreshToken, options);

        return user;
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          app.logger.error('User not found:', error as any);
          throw new BadRequestError('invalid credentials');
        }

        throw error;
      }
    });
  }

  private logout(app: FastifyInstance) {
    app.post(API_URLS.authLogout, async (_req, res) => {
      app.logger.info(`POST ${API_URLS.authLogout} - user logout`);

      const { accessCookie, refreshCookie } = app.configService.get<CookiesConfig>(ConfigKeys.Cookies);

      res.clearCookie(accessCookie.name);
      res.clearCookie(refreshCookie.name);

      return { success: true };
    });
  }

  registerRoutes() {
    this.app.register(this.login.bind(this));
    this.app.register(this.logout.bind(this));
  }
}
