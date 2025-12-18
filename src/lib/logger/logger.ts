import { colorMyJson } from 'color-my-json';
import type { ILogger, LoggerConstructorProps } from './logger.interface';
import type { LoggerSettings } from './types';
import { LogLevel, LogLevelToNumber, type LogLevelValues } from './logic/constants';
import { createEnumerableError } from './logic/utils/createEnumerableError';

export class Logger implements ILogger {
  private readonly settings: LoggerSettings;
  private readonly fixedKeys: Record<string, any>;
  private readonly globalLogLevelValue: number;

  /** The current log level as a string (required by Fastify) */
  public readonly level: LogLevelValues;

  public constructor(props: LoggerConstructorProps) {
    const { settings, fixedKeys = {} } = props;

    const reservedKeys = ['_time', 'message', 'level', 'data', 'error'];
    for (const key of reservedKeys) {
      if (key in fixedKeys) {
        throw new Error(`The key "${key}" is reserved and CANNOT be used!`);
      }
    }

    this.level = settings?.logLevel ?? LogLevel.Info;
    this.globalLogLevelValue = LogLevelToNumber[this.level];

    this.settings = settings;
    this.fixedKeys = fixedKeys;
  }

  /**
   * Creates a child logger with additional fixed bindings.
   * Used by Fastify to create request-scoped loggers with reqId, etc.
   */
  child(bindings: Record<string, any>): Logger {
    return new Logger({
      settings: this.settings,
      fixedKeys: { ...this.fixedKeys, ...bindings },
    });
  }

  trace(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Trace)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Trace);

    this.logMe(logMetadata);
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Debug)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Debug);

    this.logMe(logMetadata);
  }

  log(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Info)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Info);

    this.logMe(logMetadata);
  }

  info(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Info)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Info);

    this.logMe(logMetadata);
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Warn)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Warn);

    this.logMe(logMetadata);
  }

  error(message: string, data?: any) {
    // No need to call shouldLog. ALWAYS print if error and above!

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Error);

    this.logMe(logMetadata);
  }

  fatal(message: string, data?: any) {
    // No need to call shouldLog. ALWAYS print if error and above!

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Fatal);

    this.logMe(logMetadata);
  }

  /**
   * Silent log level - does nothing (no-op).
   * Required by Fastify/Pino interface.
   */
  silent(_message: string, _data?: any) {
    // No-op - silent means don't log anything
  }

  private logMe(logMetadata: string): void {
    if (this.settings.useColoredOutput) {
      this.logFormattedOutput(logMetadata);
    } else {
      this.logRawOutput(logMetadata);
    }
  }

  private logFormattedOutput(logMetadata: string): void {
    console.log('');
    console.log(colorMyJson(logMetadata));
  }

  private logRawOutput(logMetadata: string): void {
    console.log(logMetadata);
  }

  private enrichLogMetadata(message: string, extraData: Record<string, any>, level: LogLevelValues) {
    const error = extraData?.error && createEnumerableError(extraData.error);

    const enrichedLogMetadata = {
      _time: new Date().toISOString(),
      message,
      level,
      ...extraData, // must come before error key!
      error,
      ...this.fixedKeys,
    };

    return JSON.stringify(enrichedLogMetadata, null, 2);
  }

  private shouldLog(logLevel: LogLevelValues) {
    const currentLogLevelValue = LogLevelToNumber[logLevel];

    return currentLogLevelValue <= this.globalLogLevelValue;
  }
}
