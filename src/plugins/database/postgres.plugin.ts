import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import pg from 'pg';

export const postgresPlugin = fp(postgresPluggable, {
  name: 'fastify-postgres',
  fastify: '5.x',
});

export type PostgresPluginOptions = {
  connectionString: string;
};

async function postgresPluggable(app: FastifyInstance, options: PostgresPluginOptions): Promise<void> {
  const { connectionString } = options;

  if (!connectionString) {
    throw new Error('PostgreSQL connection string is required');
  }

  const client = new pg.Client(connectionString);

  try {
    await client.connect();
    app.log.info('✅ Successfully connected to PostgreSQL');
  } catch (error: any) {
    app.log.error('❌ Failed to connect to PostgreSQL:', error);
    throw error;
  }

  // Decorate fastify instance - accessible as fastify.pg
  app.decorate('pg', client);

  // Graceful shutdown - Fastify calls this automatically on close
  app.addHook('onClose', async (instance) => {
    try {
      await client.end();
      instance.log.info('📴 PostgreSQL connection closed');
    } catch (error: any) {
      instance.log.error('❌ Error closing PostgreSQL connection:', error);
    }
  });
}
