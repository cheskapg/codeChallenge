// index.js
import Fastify from 'fastify';

const fastify = Fastify();

fastify.get('/', async (req, reply) => {
  return { hello: 'esm world' };
});

fastify.listen({ port: 3000 });
