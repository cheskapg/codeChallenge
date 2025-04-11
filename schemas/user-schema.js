// userRoutes.js
export default async function userRoutes(fastify) {
    // Static credentials
    const STATIC_USERNAME = 'nachochz';
    const STATIC_PASSWORD = 'password';
  
    const loginSchema = {
      tags: ['Auth'],
      summary: 'Login with static credentials',
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    };
  
    const profileSchema = {
      tags: ['Auth'],
      summary: 'Get authenticated user info',
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                username: { type: 'string' },
                iat: { type: 'number' },
              },
            },
          },
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    };
  
    // Login route
    fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
      const { username, password } = request.body;
  
      if (username !== STATIC_USERNAME || password !== STATIC_PASSWORD) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
  
      const token = fastify.jwt.sign({ username });
      return { token };
    });
  
    // Protected route
    fastify.get(
      '/profile',
      {
        preHandler: [fastify.authenticate],
        schema: profileSchema,
      },
      async (request) => {
        return {
          message: 'You are authenticated',
          user: request.user,
        };
      }
    );
  }
  