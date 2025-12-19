import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { ConfigKeys, type MongoDBConfig } from '../../configurations';

export const mongodbPlugin = fp(mongodbPluggable, {
  name: 'fastify-mongodb',
  fastify: '5.x',
});

/**
 * @dependencies
 * - config-service plugin
 */
async function mongodbPluggable(app: FastifyInstance): Promise<void> {
  const { connectionString, maxPoolSize, serverSelectionTimeoutMS, socketTimeoutMS } =
    app.configService.get<MongoDBConfig>(ConfigKeys.MongoDB);

  if (!connectionString) {
    throw new Error('MongoDB connection string is required');
  }

  try {
    await mongoose.connect(connectionString, {
      maxPoolSize,
      serverSelectionTimeoutMS,
      socketTimeoutMS,
    });
    app.log.info('✅ Successfully connected to MongoDB');
  } catch (error: any) {
    app.log.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }

  // Decorate fastify instance - accessible as fastify.mongo
  app.decorate('mongo', mongoose);

  // Graceful shutdown - Fastify calls this automatically on close
  app.addHook('onClose', async (instance) => {
    try {
      await mongoose.disconnect();
      instance.log.info('📴 MongoDB connection closed');
    } catch (error: any) {
      instance.log.error('❌ Error closing MongoDB connection:', error);
    }
  });
}
