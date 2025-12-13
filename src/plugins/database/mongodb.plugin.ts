import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export const mongodbPlugin = fp(mongodbPluggable, {
  name: 'fastify-mongodb',
  fastify: '5.x',
});

export type MongoDBPluginOptions = {
  connectionString: string;
  maxPoolSize?: number;
  serverSelectionTimeoutMS?: number;
  socketTimeoutMS?: number;
};

async function mongodbPluggable(fastify: FastifyInstance, options: MongoDBPluginOptions): Promise<void> {
  const { connectionString, maxPoolSize = 10, serverSelectionTimeoutMS = 5000, socketTimeoutMS = 45000 } = options;

  if (!connectionString) {
    throw new Error('MongoDB connection string is required');
  }

  try {
    await mongoose.connect(connectionString, {
      maxPoolSize,
      serverSelectionTimeoutMS,
      socketTimeoutMS,
    });
    fastify.log.info('✅ Successfully connected to MongoDB');
  } catch (error: any) {
    fastify.log.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }

  // Decorate fastify instance - accessible as fastify.mongo
  fastify.decorate('mongo', mongoose);

  // Graceful shutdown - Fastify calls this automatically on close
  fastify.addHook('onClose', async (instance) => {
    try {
      await mongoose.disconnect();
      instance.log.info('📴 MongoDB connection closed');
    } catch (error: any) {
      instance.log.error('❌ Error closing MongoDB connection:', error);
    }
  });
}
