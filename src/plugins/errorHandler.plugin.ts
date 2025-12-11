import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from '../common/constants';

export function errorHandlerPlugin(app: FastifyInstance) {
  process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection', { err });
    console.error('Should not get here!  You are missing a try/catch somewhere.');
  });

  process.on('uncaughtException', (err) => {
    console.error('uncaughtException', { err });
    console.error('Should not get here! You are missing a try/catch somewhere.');
  });

  app.setErrorHandler(globalErrorMiddleware);
}

function globalErrorMiddleware(error: any, _req: FastifyRequest, res: FastifyReply) {
  console.error('▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼');
  console.error(error);
  console.error('▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲');

  // if (condition) logger.error(error.message); // <--- store the error if <condition>...

  const data = {
    statusCode: error.statusCode ?? StatusCodes.INTERNAL_ERROR,
    message: error.message,
  };

  res.status(data.statusCode);

  return data;
}
