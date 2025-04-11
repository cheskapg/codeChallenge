import fp from "fastify-plugin";
const authPlugin = fp(async (fastify) => {
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      console.log("Authenticating request...");
      await request.jwtVerify();
    } catch (err) {
      console.log("JWT failed", err.message);
      reply.code(401).send({ error: "Unauthorized", message: err.message });
    }
  });
});

export default authPlugin;
