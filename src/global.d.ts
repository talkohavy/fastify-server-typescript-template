declare module 'fastify' {
  export interface FastifyInstance {
    sayHello(): string;
  }

  export interface FastifyRequest {
    helloRequest: string;
    foo: any;
  }

  export interface FastifyReply {
    foo: any;
  }
}

export {};
