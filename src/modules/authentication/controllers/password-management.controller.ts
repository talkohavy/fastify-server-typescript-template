import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { PasswordManagementService } from '../services/password-management.service';
import type { IsPasswordValidBody } from './interfaces/password-management.controller.interface';
import { API_URLS } from '../../../common/constants';
import { UnauthorizedError } from '../../../lib/Errors';

export class PasswordManagementController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly passwordManagementService: PasswordManagementService,
  ) {}

  private getIsPasswordValid(app: FastifyInstance) {
    const options: RouteShorthandOptions = {
      schema: {
        body: {
          type: 'object',
          required: ['password', 'hashedPassword'],
          properties: {
            password: { type: 'string' },
            hashedPassword: { type: 'string' },
          },
        },
      },
    };

    app.post(API_URLS.isPasswordValid, options, async (req, _res) => {
      try {
        const { body } = req;

        app.logger.info(`POST ${API_URLS.isPasswordValid} - check if password is valid`);

        const { hashedPassword: saltAndHashedPassword, password } = body as IsPasswordValidBody;

        const isValid = await this.passwordManagementService.getIsPasswordValid(saltAndHashedPassword, password);

        return { isValid };
      } catch (error) {
        app.logger.error('Check password validity failed...', { error } as any);

        throw new UnauthorizedError('Invalid credentials');
      }
    });
  }

  registerRoutes() {
    this.app.register(this.getIsPasswordValid.bind(this));
  }
}
