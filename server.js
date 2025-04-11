//imports
// index.js
import cors from "@fastify/cors";
// import { createServer } from "http";
import Fastify from "fastify";
import itemRoutes from "./routes/items-routes.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import customerRoutes from "./routes/customers-routes.js";
import salesRoutes from "./routes/sales-routes.js";
import productRoutes from "./routes/products-routes.js";
import reportsRoutes from "./routes/reports-routes.js";
const PORT = process.env.PORT || 3000;
const fastify = Fastify();
await fastify.register(cors, {
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: [
      'content-type',
      'accept',
      'content-type',
      'authorization'
    ],
  })
const swaggerOptions = {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "🧀 Nacho-Sales API",
      description:
        "A tasty Fastify-powered API serving up spicy sales data with extra cheese. 🔥🧀",
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
await fastify.register(itemRoutes); //
await fastify.register(customerRoutes); //
await fastify.register(salesRoutes); //
await fastify.register(productRoutes); //
await fastify.register(reportsRoutes); //

// fastify.get("/", async (req, reply) => {
//   return { hello: "esm world" };
// });

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    fastify.swagger();
    console.log("Swagger docs available at http://localhost:3000/docs");
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
