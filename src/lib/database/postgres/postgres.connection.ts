import pg, { type Client, type QueryResultRow } from 'pg';
import type { PostgresConnectionConstructorOptions } from './types';

export class PostgresConnection {
  private readonly client: Client;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;
  private isConnected = false;

  constructor(options: PostgresConnectionConstructorOptions) {
    const { connectionString, maxRetries = 5, retryDelayMs = 5000 } = options;

    this.client = new pg.Client(connectionString);
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
  }

  async connect(): Promise<void> {
    let retriesSoFar = 0;

    const connectWithRetry = async (): Promise<void> => {
      try {
        await this.client.connect();
        this.isConnected = true;
      } catch (_error) {
        retriesSoFar++;

        if (retriesSoFar >= this.maxRetries) {
          throw new Error(`Max retries (${this.maxRetries}) reached. PostgreSQL connection failed.`);
        }

        await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
        return connectWithRetry();
      }
    };

    return connectWithRetry();
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.end();
      this.isConnected = false;
    }
  }

  async query<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<pg.QueryResult<T>> {
    return this.client.query<T>(sql, params);
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  getClient(): Client {
    return this.client;
  }
}
