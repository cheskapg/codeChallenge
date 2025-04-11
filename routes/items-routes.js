import { 
  getItemsOptions, 
  getItemOptions, 
  postItemOptions, 
  updateItemOptions, 
  softDeleteItemOptions 
} from "../schemas/items-schema.js";

function itemRoutes(fastify, options, done) {
  // Get all items
  fastify.get("/items", {
    ...getItemsOptions,
    preHandler: fastify.authenticate // Add the preHandler here
  });
  // Get item by UUID
  fastify.get("/items/:uuid", getItemOptions);

  // Post a new item
  fastify.post("/item", postItemOptions);

  // Update an existing item by UUID
  fastify.put("/items/:uuid", updateItemOptions);

  // Soft delete an item by UUID
  fastify.delete("/items/:uuid", softDeleteItemOptions);

  done();
}

export default itemRoutes;
