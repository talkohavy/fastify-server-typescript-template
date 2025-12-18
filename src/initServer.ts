import type { FastifyLoggerOptions, PinoLoggerOptions } from 'fastify/types/logger';
import type { AppOptions } from './types';
import { buildApp } from './app';

type DevLoggerOptions = FastifyLoggerOptions<any> & PinoLoggerOptions;

type LoggerOptions = {
  development: DevLoggerOptions;
  production: boolean;
  test: boolean;
};

const envToLogger: LoggerOptions = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'req.remotePort,req.host', // <--- fields to ignore in the logs
      },
    },
    serializers: {
      req(request) {
        return {
          url: request.url,
          method: request.method,
          headers: request.headers,
          body: request.body,
          params: request.params,
          query: request.query,
          ip: request.ip,
          protocol: request.protocol,
        };
      },
    },
  },
  production: true,
  test: false,
};

const environment = (process.env.NODE_ENV as keyof typeof envToLogger) ?? 'development';

async function startServer() {
  const options: AppOptions = {
    // logger: true, // <--- logging is disabled by default. Settings `true` is production ready, setting the level to 'info'.
    // logger: {
    //   level: 'debug', // <--- defaults to 'info'
    // },
    logger: envToLogger[environment] ?? true, // defaults to true if no entry matches in the map
  };

  const app = await buildApp(options);

  try {
    await app.listen({ port: 8000 });

    const address = app.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    console.log(`Server is running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection', { err });
  console.error('Should not get here!  You are missing a try/catch somewhere.');
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', { err });
  console.error('Should not get here! You are missing a try/catch somewhere.');
});
