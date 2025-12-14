import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { UserUtilitiesService } from '../services/user-utilities.service';
import { API_URLS } from '../../../common/constants';
import { NotFoundError } from '../../../lib/Errors';
import { UserNotFoundError } from '../logic/users.errors';
// import { getUserByEmailSchema } from './dto/get-user-by-email.dto';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly userUtilitiesService: UserUtilitiesService,
  ) {}

  private getUserByEmail(app: FastifyInstance) {
    app.post(
      API_URLS.getUserByEmail,
      // joiBodyMiddleware(getUserByEmailSchema),
      async (req, _res) => {
        try {
          const { body } = req as any;

          // app.logger.info('POST /users/get-by-email - fetching user by email');

          const email = body.email;
          const user = await this.userUtilitiesService.getUserByEmail(email);

          return user;
        } catch (error: any) {
          if (error instanceof UserNotFoundError) {
            throw new NotFoundError(error.message);
          }

          throw error;
        }
      },
    );
  }

  registerRoutes() {
    this.app.register(this.getUserByEmail);
  }
}
