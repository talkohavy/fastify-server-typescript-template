import type { Client as PgClient } from 'pg';
import type { ConfigService } from '../lib/config-service';
import type { AuthenticationModule } from '../modules/authentication';
import type { HealthCheckModule } from '../modules/health-check';
import type { UsersModule } from '../modules/users';

export interface OptimizedApp {
  modules: {
    HealthCheckModule: HealthCheckModule;
    UsersModule: UsersModule;
    AuthenticationModule: AuthenticationModule;
    // BooksModule: BooksModule;
    // FileUploadModule: FileUploadModule;
  };
  configService: ConfigService;
  //   callContextService: CallContextService;
  //   redis: {
  //     pub: RedisClientType;
  //     sub: RedisClientType;
  //   };
  pg: PgClient;
  logger: any; // LoggerService;
}
