import type { FastifyInstance } from 'fastify';
import { randomBytes } from 'crypto';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IAuthAdapter } from '../../authentication/adapters/auth.adapter.interface';
import type { IUsersAdapter } from '../adapters/users.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { ConfigKeys, type CookiesConfig } from '../../../../configurations';
import { ForbiddenError, UnauthorizedError } from '../../../../lib/Errors';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly usersAdapter: IUsersAdapter,
    private readonly authAdapter: IAuthAdapter,
  ) {}

  private createUser(app: FastifyInstance) {
    app.post(API_URLS.users, async (req, res) => {
      const { body } = req as any;

      app.logger.info(`POST ${API_URLS.users} - create new user`);

      // Step 1: Generate salt and hash password via auth adapter
      const salt = randomBytes(16).toString('hex');
      const hashedPassword = await this.authAdapter.generateHashedPassword(body.password, salt);
      const saltAndHashedPassword = `${salt}:${hashedPassword}`;

      const updatedPayload = { ...body, password: saltAndHashedPassword };

      // Step 2: Create user with hashed password
      const user = await this.usersAdapter.createUser(updatedPayload);

      res.status(StatusCodes.CREATED);
      return user;
    });
  }

  private getUsers(app: FastifyInstance) {
    app.get(API_URLS.users, async (req, _res) => {
      const { query } = req;

      app.logger.info(`GET ${API_URLS.users} - get all users`);

      const users = await this.usersAdapter.getUsers(query);

      return users;
    });
  }

  private getUserById(app: FastifyInstance) {
    app.get(API_URLS.userById, async (req, _res) => {
      const { params } = req as any;

      const userId = params.userId as string;

      app.logger.info(`GET ${API_URLS.userById} - get user by id`);

      const fetchedUser = await this.usersAdapter.getUserById(userId);

      return fetchedUser;
    });
  }

  private updateUser(app: FastifyInstance) {
    app.patch(API_URLS.userById, async (req, _res) => {
      const { params, body } = req as any;

      app.logger.info(`PATCH ${API_URLS.userById} - updating user by ID`);

      const token = this.extractAccessTokenFromCookies(req.cookies);

      const decodedToken = await this.authAdapter.verifyToken(token);

      if (!decodedToken) throw new UnauthorizedError();

      const userId = params.userId;

      if (decodedToken.id !== userId) throw new ForbiddenError();

      const updatedUser = await this.usersAdapter.updateUserById(userId, body);

      return updatedUser;
    });
  }

  private deleteUser(app: FastifyInstance) {
    app.delete(API_URLS.userById, async (req, _res) => {
      const { params, cookies } = req as any;

      const id = params.userId;

      app.logger.info(`DELETE ${API_URLS.userById} - delete user`);

      const token = this.extractAccessTokenFromCookies(cookies);

      const decodedToken = await this.authAdapter.verifyToken(token);

      if (!decodedToken) throw new UnauthorizedError();

      if (decodedToken.id !== id) throw new ForbiddenError();

      const result = await this.usersAdapter.deleteUserById(id);

      return result;
    });
  }

  private extractAccessTokenFromCookies(cookies: any): string {
    const { accessCookie } = this.app.configService.get<CookiesConfig>(ConfigKeys.Cookies);
    const token = cookies[accessCookie.name] as string;

    return token;
  }

  registerRoutes() {
    this.app.register(this.createUser.bind(this));
    this.app.register(this.getUsers.bind(this));
    this.app.register(this.getUserById.bind(this));
    this.app.register(this.updateUser.bind(this));
    this.app.register(this.deleteUser.bind(this));
  }
}
