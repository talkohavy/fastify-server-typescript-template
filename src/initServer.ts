import Fastify, { type FastifyInstance } from 'fastify';
import type { AppOptions } from './types';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import ourFirstRoute from './modules/our-first-route';
import routesWithSerialization from './modules/routes-with-serialization';
import routesWithValidation from './modules/routes-with-validation';

async function start() {
  const options: AppOptions = {};

  const app: FastifyInstance = await Fastify(options);

  try {
    HealthCheckModule.getInstance().attachController(app);

    app.register(ourFirstRoute);
    app.register(routesWithValidation);
    app.register(routesWithSerialization);

    await app.listen({ port: 8000 });

    const address = app.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    console.log(`Server is running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
