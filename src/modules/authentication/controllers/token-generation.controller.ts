import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { TokenGenerationService } from '../services/token-generation.service';
import { API_URLS } from '../../../common/constants';

export class TokenGenerationController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly tokenGenerationService: TokenGenerationService,
  ) {}

  private createTokens() {
    this.app.post(
      API_URLS.createTokens,
      // joiBodyMiddleware(createTokensSchema),
      async (req, _res) => {
        const { body } = req as any;

        this.app.log.info(`POST ${API_URLS.createTokens} - create tokens`);

        const { userId } = body;

        const tokens = await this.tokenGenerationService.createTokens(userId);

        return tokens;
      },
    );
  }

  registerRoutes() {
    this.createTokens();
  }
}
