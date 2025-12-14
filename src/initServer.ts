import type { AppOptions } from './types';
import { buildApp } from './app';

async function startServer() {
  const options: AppOptions = {
    logger: {
      level: 'debug',
    },
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
