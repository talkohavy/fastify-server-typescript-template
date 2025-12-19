import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { ConfigKeys, type PostgresConfig } from '../../configurations';
import { runAllMigrations } from '../../database/postgres/migrations';
import { runAllSeeds } from '../../database/postgres/seeds';
import { PostgresConnection } from '../../lib/database/postgres';

export const postgresPlugin = fp(postgresPluggable, {
  name: 'fastify-postgres',
  fastify: '5.x',
});

/**
 * @dependencies
 * - config-service plugin
 */
async function postgresPluggable(app: FastifyInstance): Promise<void> {
  const { connectionString } = app.configService.get<PostgresConfig>(ConfigKeys.Postgres);

  if (!connectionString) {
    throw new Error('PostgreSQL connection string is required');
  }

  const connection = new PostgresConnection({ connectionString });

  try {
    await connection.connect();
    app.logger.info('✅ Successfully connected to PostgreSQL');
  } catch (error: any) {
    app.logger.error('❌ Failed to connect to PostgreSQL:', error);
    throw error;
  }

  const pgClient = connection.getClient();

  app.decorate('pg', pgClient);

  // Run migrations and seeds
  if (process.env.POSTGRES_SHOULD_MIGRATE) {
    await runAllMigrations(pgClient);
    await runAllSeeds(pgClient, { users: { skipIfExists: false, clearBeforeSeeding: true } });
  }

  // Graceful shutdown - Fastify calls this automatically on close
  app.addHook('onClose', async (instance) => {
    try {
      await connection.disconnect();
      instance.logger.info('📴 PostgreSQL connection closed');
    } catch (error: any) {
      instance.logger.error('❌ Error closing PostgreSQL connection:', error);
    }
  });
}
