import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import type { AppOptions } from './types';
import { AppFactory } from './lib/lucky-server';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import ourFirstRoute from './modules/our-first-route';
import routesWithAbortCleanup from './modules/routes-with-abort-cleanup';
import { routesWithBodyValidation } from './modules/routes-with-body-validation';
import { SerializationExamplesModule } from './modules/serialization-examples/serialization-examples.module';
import { UsersModule } from './modules/users';
import { ValidationExamplesModule } from './modules/validation-examples';
import { errorHandlerPlugin } from './plugins/errorHandler.plugin';
import { pathNotFoundPlugin } from './plugins/pathNotFound.plugin';

const allowedOrigins = ['http://localhost:3000'];

export async function buildApp(options?: AppOptions) {
  const app: FastifyInstance = await Fastify(options);

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    credentials: true, // <--- Required! When a client request has `include:'credentials'`, this option must be set to true. Otherwise, the request will be blocked.
  });

  const appModule = new AppFactory(app);

  appModule.registerPlugins([
    // corsPlugin,
    // helmetPlugin,
    // requestIdPlugin,
    // bodyLimitPlugin,
    // urlEncodedPlugin,
    // cookieParserPlugin,
  ]);

  appModule.registerModules(
    [HealthCheckModule, UsersModule, ValidationExamplesModule, SerializationExamplesModule],
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
