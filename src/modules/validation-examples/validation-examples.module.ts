import type { FastifyInstance } from 'fastify';
import { ValidationExamplesController } from './controllers/validation-examples.controller';

export class ValidationExamplesModule {
  constructor() {
    this.initializeModule();
  }

  private async initializeModule(): Promise<void> {}

  registerController(app: FastifyInstance): void {
    const validationExamplesController = new ValidationExamplesController(app);

    validationExamplesController.registerRoutes();
  }
}
