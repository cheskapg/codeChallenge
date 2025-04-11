const loginOptions = {
  schema: {
    tags: ["Auth"],
    summary: "Login",
    description: "Login with username and password to get a JWT token",
    body: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string" },
        password: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          token: { type: "string" },
        },
      },
      401: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};

const userRoutes = (fastify) => {
  const staticUser = {
    username: "nachochz",
    password: "password",
  };

  // Static Login
  fastify.post("/login", loginOptions, async (request, reply) => {
    const { username, password } = request.body;

    if (username !== staticUser.username || password !== staticUser.password) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = fastify.jwt.sign({ secret: process.env.JWT_TOKEN });  // Same secret key used for verification
    reply.send({ token });
  });

  // Protected Route Example
  fastify.get("/", { preHandler: [fastify.authenticate] }, async (request) => {
    return {
      message: "You are authenticated!",
      user: request.user,
    };
  });
};
export default userRoutes;
