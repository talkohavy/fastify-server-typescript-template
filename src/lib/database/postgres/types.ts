export type PostgresConnectionConstructorOptions = {
  connectionString: string;
  maxRetries?: number;
  retryDelayMs?: number;
};
