import type { AuthenticationModule } from '../modules/authentication';
import type { DragonsModule } from '../modules/dragons';
import type { HealthCheckModule } from '../modules/health-check';
import type { UsersModule } from '../modules/users';

export interface OptimizedApp {
  modules: {
    AuthenticationModule: AuthenticationModule;
    HealthCheckModule: HealthCheckModule;
    UsersModule: UsersModule;
    DragonsModule: DragonsModule;
    // BooksModule: BooksModule;
    // FileUploadModule: FileUploadModule;
  };
}
