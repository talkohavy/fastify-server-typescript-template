import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { PostgresConnection } from '../../lib/database/postgres';

export const postgresPlugin = fp(postgresPluggable, {
  name: 'fastify-postgres',
  fastify: '5.x',
});

async function postgresPluggable(app: FastifyInstance): Promise<void> {
  const connectionString = process.env.DB_CONNECTION_STRING as string;

  if (!connectionString) {
    throw new Error('PostgreSQL connection string is required');
  }

  const connection = new PostgresConnection({ connectionString });

  try {
    await connection.connect();
    app.log.info('✅ Successfully connected to PostgreSQL');
  } catch (error: any) {
    app.log.error('❌ Failed to connect to PostgreSQL:', error);
    throw error;
  }

  // Decorate fastify instance - accessible as app.pg
  app.decorate('pg', connection.getClient());

  // Graceful shutdown - Fastify calls this automatically on close
  app.addHook('onClose', async (instance) => {
    try {
      await connection.disconnect();
      instance.log.info('📴 PostgreSQL connection closed');
    } catch (error: any) {
      instance.log.error('❌ Error closing PostgreSQL connection:', error);
    }
  });
}
