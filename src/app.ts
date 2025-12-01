import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import type { AppOptions } from './types';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import ourFirstRoute from './modules/our-first-route';
import routesWithSerialization from './modules/routes-with-serialization';
import routesWithValidation from './modules/routes-with-validation';

const allowedOrigins = ['http://localhost:3000'];

export async function buildApp(options?: AppOptions) {
  const app: FastifyInstance = await Fastify(options);

  await app.register(cors, {
    origin: (origin, cb) => {
      if (allowedOrigins.includes(origin!)) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    credentials: true, // <--- Required! When a client request has `include:'credentials'`, this option must be set to true. Otherwise, the request will be blocked.
  });

  HealthCheckModule.getInstance().attachController(app);

  app.register(ourFirstRoute);
  app.register(routesWithValidation);
  app.register(routesWithSerialization);

  return app;
}
