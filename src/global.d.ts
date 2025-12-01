declare module 'fastify' {
  export interface FastifyInstance {
    sayHello(): string;
  }

  export interface FastifyRequest {
    helloRequest: string;
  }
}

export {};
