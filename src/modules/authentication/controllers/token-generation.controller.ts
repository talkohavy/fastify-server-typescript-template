import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { TokenGenerationService } from '../services/token-generation.service';
import type { CreateTokensBody } from './interfaces/token-generation.controller.interface';
import { API_URLS } from '../../../common/constants';

export class TokenGenerationController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly tokenGenerationService: TokenGenerationService,
  ) {}

  private createTokens(app: FastifyInstance) {
    const options: RouteShorthandOptions = {
      schema: {
        body: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string' },
          },
        },
      },
    };

    app.post(API_URLS.createTokens, options, async (req, _res) => {
      const { userId } = req.body as CreateTokensBody;

      app.logger.info(`POST ${API_URLS.createTokens} - create tokens`);

      const tokens = await this.tokenGenerationService.createTokens(userId);

      return tokens;
    });
  }

  registerRoutes() {
    this.app.register(this.createTokens.bind(this));
  }
}
