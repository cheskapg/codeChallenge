import {
getSaleOptions,
getSalesOptions,
addSaleOptions,
updateSaleOptions,
softDeleteSaleOptions,
} from "../schemas/sales-schema.js";
function salesRoutes(fastify, options, done) {
    // Get all sales
    fastify.get("/sales/all", getSalesOptions);
  
    // Get sale by UUID
    fastify.get("/sales/:uuid", getSaleOptions);

    // Post a new sale
    fastify.post("/sale", addSaleOptions);
  
    // Update an existing sale by UUID
    fastify.put("/sales/:uuid", updateSaleOptions);
  
    // Soft delete an sale by UUID
    fastify.delete("/sales/:uuid", softDeleteSaleOptions);
  
    done();
  }
  
  export default salesRoutes;