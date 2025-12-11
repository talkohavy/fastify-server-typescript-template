import { HealthCheckController } from './health-check.controller';

export class HealthCheckModule {
  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private async initializeModule(): Promise<void> {
    this.attachController(this.app);
  }

  private attachController(app: any): void {
    const controller = new HealthCheckController(app);

    controller.attachRoutes();
  }
}
