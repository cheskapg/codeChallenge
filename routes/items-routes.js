import { getItemsOptions, getItemOptions } from "../schemas/items-schema.js";
function itemRoutes(fastify, options, done) {
  //get syntax (endpoint, options, handler)

  //get all items
  fastify.get("/items", getItemsOptions);

  //get item by id
  fastify.get("/items/:id", getItemOptions);

  done();
}

export default itemRoutes;
