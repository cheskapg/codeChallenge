
import {
    getCustomersOptions,
    getCustomerOptions,
    postCustomerOptions,
    updateCustomerOptions,
    softDeleteCustomerOptions,
    // getCustomerSalesSummaryOptions
  } from "../schemas/customers-schema.js";
  
  function customerRoutes(fastify, options, done) {
    // Get all customers
    fastify.get("/customers", getCustomersOptions);
  
    // Get customer by UUID
    fastify.get("/customers/:uuid", getCustomerOptions);
  
    // Create new customer
    fastify.post("/customer", postCustomerOptions);
  
    // Update customer by UUID
    fastify.put("/customers/:uuid", updateCustomerOptions);
  
    // Soft delete customer by UUID
    fastify.delete("/customers/:uuid", softDeleteCustomerOptions);
  
  // customer-wise sales summary for a given year and month

    // fastify.get("/customers/sales/:year/:month", getCustomerSalesSummaryOptions);
  

    done();
  }
  
  export default customerRoutes;
  