import type { LogLevelValues } from './logic/constants';
import type { LoggerSettings } from './types';

export type LoggerConstructorProps = {
  settings: LoggerSettings;
  /**
   * Optional fixed keys with fixed values to include in every log entry.
   *
   * Useful for things like serviceName, environment, etc.
   */
  fixedKeys?: Record<string, any>;
};

export interface ILogger {
  /** The current log level as a string */
  level: LogLevelValues;

  trace(message: string, data?: any): void;
  debug(message: string, data?: any): void;
  log(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
  fatal(message: string, data?: any): void;
  silent(message: string, data?: any): void;

  /**
   * Creates a child logger with additional fixed bindings.
   * Used by Fastify to create request-scoped loggers with reqId, etc.
   */
  child(bindings: Record<string, any>): ILogger;
}
