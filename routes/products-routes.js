// src/routes/products.js
import {
    getProductsOptions,
    getProductOptions,
    postProductOptions,
    updateProductOptions,
    softDeleteProductOptions,
  } from "../schemas/products-schema.js";
  
  function productRoutes(fastify, options, done) {
    // Get all products
    fastify.get("/products", getProductsOptions);
  
    // Get product by UUID
    fastify.get("/products/:uuid", getProductOptions);
  
    // Post a new product
    fastify.post("/products", postProductOptions);
  
    // Update an existing product by UUID
    fastify.put("/products/:uuid", updateProductOptions);
  
    // Soft delete a product by UUID
    fastify.delete("/products/:uuid", softDeleteProductOptions);
  
    done();
  }
  
  export default productRoutes;
  