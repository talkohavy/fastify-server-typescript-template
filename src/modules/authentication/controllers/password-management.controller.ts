import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { PasswordManagementService } from '../services/password-management.service';
import { API_URLS } from '../../../common/constants';
import { UnauthorizedError } from '../../../lib/Errors';

export class PasswordManagementController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly passwordManagementService: PasswordManagementService,
  ) {}

  private getIsPasswordValid() {
    this.app.post(
      API_URLS.isPasswordValid,
      // joiBodyMiddleware(getIsPasswordValidSchema),
      async (req, _res) => {
        try {
          const { body } = req as any;

          this.app.log.info(`POST ${API_URLS.isPasswordValid} - check if password is valid`);

          const { hashedPassword: saltAndHashedPassword, password } = body;

          const isValid = await this.passwordManagementService.getIsPasswordValid(saltAndHashedPassword, password);

          return { isValid };
        } catch (error) {
          this.app.log.error('Check password validity failed...', { error } as any);

          throw new UnauthorizedError('Invalid credentials');
        }
      },
    );
  }

  registerRoutes() {
    this.getIsPasswordValid();
  }
}
