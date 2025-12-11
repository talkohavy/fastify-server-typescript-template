import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import type { AppOptions } from './types';
import { AppFactory } from './lib/lucky-server';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import ourFirstRoute from './modules/our-first-route';
import routesWithAbortCleanup from './modules/routes-with-abort-cleanup';
import { routesWithBodySerialization } from './modules/routes-with-body-serialization';
import { routesWithBodyValidation } from './modules/routes-with-body-validation';
import { routesWithResponseSerialization } from './modules/routes-with-response-serialization';
import { ValidationExamplesModule } from './modules/validation-examples';

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
    [HealthCheckModule, ValidationExamplesModule],
    // optimizedModules,
  );

  // appModule.registerErrorHandler(errorHandlerPlugin);

  app.register(ourFirstRoute);
  app.register(routesWithBodySerialization);
  app.register(routesWithResponseSerialization);
  app.register(routesWithBodyValidation);
  app.register(routesWithAbortCleanup);

  return app;
}
