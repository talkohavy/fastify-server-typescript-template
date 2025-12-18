export const LogLevel = {
  Trace: 'trace',
  Debug: 'debug',
  Info: 'info',
  Warn: 'warn',
  Error: 'error',
  Fatal: 'fatal',
  Silent: 'silent',
} as const;

type TypeOfLogLevel = typeof LogLevel;
export type LogLevelKeys = keyof TypeOfLogLevel;
export type LogLevelValues = TypeOfLogLevel[LogLevelKeys];

export const LogLevelToNumber: Record<LogLevelValues, number> = {
  [LogLevel.Silent]: -1,
  [LogLevel.Fatal]: 0,
  [LogLevel.Error]: 1,
  [LogLevel.Warn]: 3,
  [LogLevel.Info]: 4,
  [LogLevel.Debug]: 5,
  [LogLevel.Trace]: 6,
};
