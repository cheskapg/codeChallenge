import fp from 'fastify-plugin';
const authPlugin = fp(async (fastify) => {

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized', message: err.message });
    }
  });
});

export default authPlugin;
