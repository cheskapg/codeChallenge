// index.js
import Fastify from 'fastify';
import itemRoutes from './routes/items-routes.js';
import { stat } from 'fs';
//imports
const fastify = Fastify();

const PORT = process.env.PORT || 3000;
fastify.register(itemRoutes); // register the routes similar to module importing controllers etc in nestjs

fastify.get('/', async (req, reply) => {
  return { hello: 'esm world' };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();