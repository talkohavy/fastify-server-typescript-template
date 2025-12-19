import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

const allowedOrigins = ['http://localhost:3000'];

export async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // <--- Required! When a client request has `include:'credentials'`, this option must be set to true. Otherwise, the request will be blocked.
  });
}
