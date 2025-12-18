import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { UsersCrudService } from '../services/users-crud.service';
import type { CreateUserBody, UpdateUserBody, UserByIdParams } from './interfaces/users-crud.controller.interface';
import { API_URLS, StatusCodes } from '../../../common/constants';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly usersService: UsersCrudService,
  ) {}

  private createUser(app: FastifyInstance) {
    const options: RouteShorthandOptions = {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', pattern: '^[a-zA-Z0-9]{1,30}$' },
            nickname: { type: 'string', minLength: 3, maxLength: 30 },
            dateOfBirth: { type: 'string', format: 'date' },
          },
        },
      },
    };

    app.post(API_URLS.users, options, async (req, res) => {
      const body = req.body as CreateUserBody;

      app.logger.info(`POST ${API_URLS.users} - create new user`);

      const user = await this.usersService.createUser(body);

      res.status(StatusCodes.CREATED);

      return user;
    });
  }

  private getUsers(app: FastifyInstance) {
    app.get(API_URLS.users, async (req, _res) => {
      const { query } = req;

      app.logger.info(`GET ${API_URLS.users} - get all users`);

      const users = await this.usersService.getUsers(query);

      return users;
    });
  }

  private getUserById(app: FastifyInstance) {
    const options: RouteShorthandOptions = {
      schema: {
        params: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string' },
          },
        },
      },
    };

    app.get(API_URLS.userById, options, async (req, _res) => {
      const { userId } = req.params as UserByIdParams;

      app.logger.info(`GET ${API_URLS.userById} - get user by id`);

      const fetchedUser = await this.usersService.getUserById(userId);

      return fetchedUser;
    });
  }

  private updateUserById(app: FastifyInstance) {
    const options: RouteShorthandOptions = {
      schema: {
        params: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          minProperties: 1,
          properties: {
            email: { type: 'string', format: 'email' },
            nickname: { type: 'string', minLength: 1, maxLength: 30 },
            dateOfBirth: { type: 'string', format: 'date' },
          },
        },
      },
    };

    app.patch(API_URLS.userById, options, async (req, _res) => {
      app.logger.info(`PATCH ${API_URLS.userById} - updating user by ID`);

      const { userId } = req.params as UserByIdParams;
      const userData = req.body as UpdateUserBody;

      const updatedUser = await this.usersService.updateUserById(userId, userData);

      return updatedUser;
    });
  }

  private deleteUserById(app: FastifyInstance) {
    const options: RouteShorthandOptions = {
      schema: {
        params: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string' },
          },
        },
      },
    };

    app.delete(API_URLS.userById, options, async (req, _res) => {
      const { userId } = req.params as UserByIdParams;

      app.logger.info(`DELETE ${API_URLS.userById} - delete user`);

      const result = await this.usersService.deleteUserById(userId);

      return result;
    });
  }

  registerRoutes() {
    this.app.register(this.createUser.bind(this));
    this.app.register(this.getUsers.bind(this));
    this.app.register(this.getUserById.bind(this));
    this.app.register(this.updateUserById.bind(this));
    this.app.register(this.deleteUserById.bind(this));
  }
}
