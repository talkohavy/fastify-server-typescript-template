import Fastify, { type FastifyInstance } from 'fastify';
import type { AppOptions } from './types';
import { AppFactory } from './lib/lucky-server';
import { DragonsModule } from './modules/dragons';
import { HealthCheckModule } from './modules/health-check';
import ourFirstRoute from './modules/our-first-route';
import routesWithAbortCleanup from './modules/routes-with-abort-cleanup';
import { routesWithBodyValidation } from './modules/routes-with-body-validation';
import { SerializationExamplesModule } from './modules/serialization-examples/serialization-examples.module';
import { UsersModule } from './modules/users';
import { ValidationExamplesModule } from './modules/validation-examples';
import { corsPlugin } from './plugins/cors';
import { mongodbPlugin, postgresPlugin } from './plugins/database';
import { errorHandlerPlugin } from './plugins/errorHandler.plugin';
import { pathNotFoundPlugin } from './plugins/pathNotFound.plugin';
import { redisPlugin } from './plugins/redis/redis.plugin';

export async function buildApp(options?: AppOptions) {
  const app: FastifyInstance = await Fastify(options);

  await app.register(postgresPlugin, {
    connectionString: process.env.DB_CONNECTION_STRING!,
  });

  const appModule = new AppFactory(app);

  await appModule.registerPlugins([
    redisPlugin,
    mongodbPlugin,
    corsPlugin,
    // helmetPlugin,
    // requestIdPlugin,
    // bodyLimitPlugin,
    // urlEncodedPlugin,
    // cookieParserPlugin,
  ]);

  appModule.registerModules(
    [HealthCheckModule, DragonsModule, UsersModule, ValidationExamplesModule, SerializationExamplesModule],
    // optimizedModules,
  );

  appModule.registerErrorHandler(errorHandlerPlugin);
  appModule.registerPathNotFoundHandler(pathNotFoundPlugin);

  app.register(ourFirstRoute);
  app.register(routesWithBodyValidation);
  app.register(routesWithAbortCleanup);

  // app.ready(() => {
  //   console.log(
  //     app.printRoutes({
  //       commonPrefix: true, // <--- defaults to true.
  //       // method: 'GET', // <--- defaults to undefined. only show routes for the method X.
  //       // includeMeta: true, // <--- defaults to false. include the route meta object.
  //     }),
  //   );

  //   console.error(app.printPlugins());
  // });

  return app;
}
