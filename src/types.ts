import type { AutoloadPluginOptions } from '@fastify/autoload';
import type { FastifyServerOptions } from 'fastify';

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
