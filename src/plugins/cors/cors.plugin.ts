import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

const allowedOrigins = ['http://localhost:3000'];

export async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    credentials: true, // <--- Required! When a client request has `include:'credentials'`, this option must be set to true. Otherwise, the request will be blocked.
  });
}
