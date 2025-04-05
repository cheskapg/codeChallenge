import {
    getCustomersController,
    getCustomerController,
    addCustomerController,
    updateCustomerController,
    softDeleteCustomerController,
  } from "../controllers/customers-controller.js";
  
  // Customer Schema
  const Customer = {
    type: "object",
    properties: {
      id: { type: "integer" },
      uuid: { type: "string" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      phone: { type: "string" },
      address: { type: "string" },
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" },
      deleted_at: { type: ["string", "null"], format: "date-time" },
    },
  };
  
  // GET all customers
  const getCustomersOptions = {
    schema: {
      response: {
        200: {
          type: "array",
          items: Customer,
        },
      },
    },
    handler: getCustomersController,
  };
  
  // GET customer by UUID
  const getCustomerOptions = {
    schema: {
      params: {
        type: "object",
        properties: {
          uuid: { type: "string" },
        },
      },
      response: {
        200: Customer,
      },
    },
    handler: getCustomerController,
  };
  
  // POST new customer
  const postCustomerOptions = {
    schema: {
        tags: ["Customers"],
        summary: "Add a new customer",
        description: "Create a new customer in the database",
      body: {
        type: "object",
        required: ["name", "email", "phone", "address"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          address: { type: "string" },
        },
      },
      response: {
        201: Customer,
      },
    },
    handler: addCustomerController,
  };
  
  // PUT update customer
  const updateCustomerOptions = {
    schema: {
        tags: ["Customers"],
        summary: "Update customer by UUID",
        description: "Update an existing customer using its UUID",
      params: {
        type: "object",
        properties: {
          uuid: { type: "string" },
        },
      },
      body: {
        type: "object",
        // required: ["name", "email", "phone", "address"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          address: { type: "string" },
        },
      },
      response: {
        200: Customer,
      },
    },
    handler: updateCustomerController,
  };
  
  // DELETE (soft delete) customer
  const softDeleteCustomerOptions = {
    schema: {
      params: {
        type: "object",
        properties: {
          uuid: { type: "string" },
        },
      },
      response: {
        200: Customer,
      },
    },
    handler: softDeleteCustomerController,
  };
  
  export {
    getCustomersOptions,
    getCustomerOptions,
    postCustomerOptions,
    updateCustomerOptions,
    softDeleteCustomerOptions,
  };
  