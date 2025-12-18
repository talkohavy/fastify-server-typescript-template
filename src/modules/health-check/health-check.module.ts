import type { FastifyInstance } from 'fastify';
import { IS_STANDALONE_MICRO_SERVICES } from '../../common/constants';
import { HealthCheckController } from './health-check.controller';

export class HealthCheckModule {
  constructor(private readonly app: FastifyInstance) {
    this.initializeModule();
  }

  private initializeModule(): void {
    // Only attach routes if running as a standalone micro-service
    if (IS_STANDALONE_MICRO_SERVICES) {
      this.attachControllers(this.app);
    }
  }

  private attachControllers(app: FastifyInstance): void {
    const controller = new HealthCheckController(app);

    controller.registerRoutes();
  }
}
