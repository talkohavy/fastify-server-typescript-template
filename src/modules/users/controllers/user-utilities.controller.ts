import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { UserUtilitiesService } from '../services/user-utilities.service';
import type { GetUserByEmailBody } from './interfaces/user-utilities.controller.interface';
import { API_URLS } from '../../../common/constants';
import { NotFoundError } from '../../../lib/Errors';
import { UserNotFoundError } from '../logic/users.errors';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly userUtilitiesService: UserUtilitiesService,
  ) {}

  private getUserByEmail(app: FastifyInstance) {
    const options: RouteShorthandOptions = {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string' },
          },
        },
      },
    };

    app.post(API_URLS.getUserByEmail, options, async (req, _res) => {
      try {
        const { body } = req;

        app.logger.info('POST /users/get-by-email - fetching user by email');

        const { email } = body as GetUserByEmailBody;

        const user = await this.userUtilitiesService.getUserByEmail(email);

        return user;
      } catch (error: any) {
        if (error instanceof UserNotFoundError) {
          throw new NotFoundError(error.message);
        }

        throw error;
      }
    });
  }

  registerRoutes() {
    this.app.register(this.getUserByEmail.bind(this));
  }
}
