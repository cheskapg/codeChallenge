import { getItemsOptions, getItemOptions, postItemOptions } from "../schemas/items-schema.js";
function itemRoutes(fastify, options, done) {
  //get syntax (endpoint, options, handler)

  //get all items
  fastify.get("/items", getItemsOptions);

  //get item by id
  fastify.get("/items/:id", getItemOptions);

  //post item
  fastify.post("/item", postItemOptions);

  done();
}

export default itemRoutes;
