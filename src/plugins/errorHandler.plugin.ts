import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from '../common/constants';

export function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler(globalErrorMiddleware);
}

function globalErrorMiddleware(error: any, _req: FastifyRequest, res: FastifyReply) {
  console.error('▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼');
  console.error(error);
  console.error('▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲');

  if (error.validation) {
    res.status(422).send(new Error('validation failed'));
    return;
  }

  // if (condition) logger.error(error.message); // <--- store the error if <condition>...

  const data = {
    statusCode: error.statusCode ?? StatusCodes.INTERNAL_ERROR,
    message: error.message,
  };

  res.status(data.statusCode);

  return data;
}
