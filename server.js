//imports
// index.js
import Fastify from "fastify";
import itemRoutes from "./routes/items-routes.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import customerRoutes from "./routes/customers-routes.js";
const PORT = process.env.PORT || 3000;
const fastify = Fastify();

const swaggerOptions = {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "🧀 Nacho-Sales API",
      description: "A tasty Fastify-powered API serving up spicy sales data with extra cheese. 🔥🧀",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local dev server",
      },
    ],
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

// Register plugins
await fastify.register(fastifySwagger, swaggerOptions); // register the swagger plugin
await fastify.register(fastifySwaggerUI, swaggerUiOptions);
await fastify.register(itemRoutes); // register the routes similar to module importing controllers etc in nestjs
await fastify.register(customerRoutes); // register the routes similar to module importing controllers etc in nestjs
fastify.get("/", async (req, reply) => {
  return { hello: "esm world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    fastify.swagger();
    console.log("Swagger docs available at http://localhost:3000/docs");
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
