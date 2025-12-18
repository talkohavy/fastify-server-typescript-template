import type { FastifyInstance } from 'fastify';
import { ConfigKeys, type LoggerServiceSettings } from '../configurations';
import { Logger } from '../lib/logger';

/**
 * @dependencies
 * - config-service plugin
 */
export function loggerPlugin(app: FastifyInstance) {
  const { logEnvironment, logLevel, serviceName, useColoredOutput } = app.configService.get<LoggerServiceSettings>(
    ConfigKeys.LogSettings,
  );

  const logger = new Logger({
    settings: {
      logLevel,
      useColoredOutput,
    },
    fixedKeys: {
      serviceName,
      environment: logEnvironment,
    },
  });

  app.decorate('logger', logger);
}
