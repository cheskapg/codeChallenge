//imports
// index.js
import cors from "@fastify/cors";
// import { createServer } from "http";
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import bcrypt from "bcrypt";
import itemRoutes from "./routes/items-routes.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import customerRoutes from "./routes/customers-routes.js";
import salesRoutes from "./routes/sales-routes.js";
import productRoutes from "./routes/products-routes.js";
import reportsRoutes from "./routes/reports-routes.js";
import auth from "./plugins/auth.js";
import userRoutes from "./routes/user.js";

const PORT = process.env.PORT || 3000;
const fastify = Fastify();
await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["content-type", "accept", "content-type", "authorization"],
});
const swaggerOptions = {
  swagger: {
    info: {
      title: "🧀 Nacho-Sales API",
      description:
        "A tasty Fastify-powered API serving up spicy sales data with extra cheese. 🔥🧀",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://codechallenge-ey20.onrender.com",
        description: "Deployed Backend Server",
      },
    ],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description:
          'Enter JWT token with Bearer prefix, e.g. "Bearer abcde12345"',
      },
    },
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: (request, reply, next) => next(),
    preHandler: (request, reply, next) => next(),
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
};

// Register plugins
await fastify.register(fastifySwagger, swaggerOptions); // register the swagger plugin

await fastify.decorate("bcrypt", bcrypt);

await fastify.register(fastifySwaggerUI, swaggerUiOptions);
await fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });
await fastify.register(auth);
await fastify.register(userRoutes); //
await fastify.register(itemRoutes); //
await fastify.register(customerRoutes); //
await fastify.register(salesRoutes); //
await fastify.register(productRoutes); //
await fastify.register(reportsRoutes); //

// Register bcrypt
// Register plugins

// fastify.get("/", async (req, reply) => {
//   return { hello: "esm world" };
// });

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
    fastify.swagger();
    console.log("Swagger docs available at http://localhost:3000/docs");
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
