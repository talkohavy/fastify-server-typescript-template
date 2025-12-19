import type { FastifyInstance } from 'fastify';
import fastifyCookie, { type FastifyCookieOptions } from '@fastify/cookie';

export async function cookiePlugin(app: FastifyInstance) {
  app.register(fastifyCookie, {
    // secret: 'my-secret', // <--- for cookies signature
    hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    parseOptions: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // <--- 15 minutes
    },
  } as FastifyCookieOptions);
}

// --- 1. SET COOKIE LIKE THIS: ---

// app.get('/', (req, reply) => {
//   const aCookieValue = req.cookies.cookieName;
//   // `reply.unsignCookie()` is also available
//   const bCookie = req.unsignCookie(req.cookies.cookieSigned);
//   reply
//     .setCookie('foo', 'foo', {
//       domain: 'example.com',
//       path: '/',
//     })
//     .cookie('baz', 'baz') // alias for setCookie
//     .setCookie('bar', 'bar', {
//       path: '/',
//       signed: true,
//     })
//     .send({ hello: 'world' });
// });

// --- 2. IMPORTING SERIALIZE AND PARSE ---

// const { serialize, parse } = require('@fastify/cookie')
// const fastify = require('fastify')()

// fastify.get('/', (req, reply) => {
//   const cookie = serialize('lang', 'en', {
//     maxAge: 60_000,
//   })

//   reply.header('Set-Cookie', cookie)

//   reply.send('Language set!')
// })
