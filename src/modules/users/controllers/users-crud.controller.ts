import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { UsersCrudService } from '../services/users-crud.service';
import { API_URLS, StatusCodes } from '../../../common/constants';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly usersService: UsersCrudService,
  ) {}

  private createUser(app: FastifyInstance) {
    app.post(
      API_URLS.users,
      // joiBodyMiddleware(createUserSchema),
      async (req, res) => {
        const { body } = req as any;

        // app.logger.info(`POST ${API_URLS.users} - create new user`);

        const user = await this.usersService.createUser(body);

        res.status(StatusCodes.CREATED);

        return user;
      },
    );
  }

  private getUsers(app: FastifyInstance) {
    app.get(API_URLS.users, async (req, _res) => {
      const { query } = req;

      // app.logger.info(`GET ${API_URLS.users} - get all users`);

      const users = await this.usersService.getUsers(query);

      return users;
    });
  }

  private getUserById(app: FastifyInstance) {
    app.get(API_URLS.userById, async (req, _res) => {
      const { params } = req as any;

      const id = params.userId as string;

      // app.logger.info(`GET ${API_URLS.userById} - get user by id`);

      const fetchedUser = await this.usersService.getUserById(id);

      return fetchedUser;
    });
  }

  private updateUserById(app: FastifyInstance) {
    app.patch(
      API_URLS.userById,
      // joiBodyMiddleware(updateUserSchema),
      async (req, _res) => {
        // app.logger.info(`PATCH ${API_URLS.userById} - updating user by ID`);
        const { params, body: userData } = req as any;

        const userId = params.userId as string;

        const updatedUser = await this.usersService.updateUserById(userId, userData);

        return updatedUser;
      },
    );
  }

  private deleteUserById(app: FastifyInstance) {
    app.delete(API_URLS.userById, async (req, _res) => {
      const { params } = req as any;

      const userId = params.userId as string;

      // app.logger.info(`DELETE ${API_URLS.userById} - delete user`);

      const result = await this.usersService.deleteUserById(userId);

      return result;
    });
  }

  registerRoutes() {
    this.app.register(this.createUser);
    this.app.register(this.getUsers);
    this.app.register(this.getUserById);
    this.app.register(this.updateUserById);
    this.app.register(this.deleteUserById);
  }
}
