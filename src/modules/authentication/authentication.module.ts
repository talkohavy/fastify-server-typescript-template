import type { FastifyInstance } from 'fastify';
import { AuthenticationService } from './services/authentication.service';
import { PasswordManagementService } from './services/password-management.service';
import { TokenGenerationService } from './services/token-generation.service';
import { TokenVerificationService } from './services/token-verification.service';

export class AuthenticationModule {
  private authenticationService!: AuthenticationService;

  constructor(private readonly app: FastifyInstance) {
    this.initializeModule();
  }

  private initializeModule(): void {
    // Initialize services
    const passwordManagementService = new PasswordManagementService();
    const tokenGenerationService = new TokenGenerationService(this.app.configService);
    const tokenVerificationService = new TokenVerificationService(this.app.configService);

    this.authenticationService = new AuthenticationService(
      passwordManagementService,
      tokenGenerationService,
      tokenVerificationService,
    );
  }

  getAuthenticationService(): AuthenticationService {
    return this.authenticationService;
  }
}
