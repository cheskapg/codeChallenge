import { validate } from "uuid";
import {
  getCustomersController,
  getCustomerController,
  addCustomerController,
  updateCustomerController,
  softDeleteCustomerController,
  getCustomerSalesMonthlySummaryController,
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
    tags: ["Customers"],
    summary: "Get all customers",
    description: "Retrieve all customers in the database",
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
    tags: ["Customers"],
    summary: "Get customer by UUID",
    description: "Retrieve a specific customer using their UUID",
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
    tags: ["Customers"],
    summary: "Soft delete customer by UUID",
    description:
      "Mark a customer as deleted without removing it from the database",
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
const getCustomerSalesSummaryOptions = {
    schema: {
      description:
        "Get sales summary grouped by customer for a specific month and year",
      tags: ["Get Sales Summary"],
      summary: "Get customer sales summary",
      params: {
        type: "object",
        properties: {
            year: { type: "integer", minimum: 2000, maximum: 2030 }, // Valid year range
            month: { type: "integer", minimum: 1, maximum: 12 }, // Valid month range (1 to 12)
          },
        required: ["year", "month"],
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              total_spent: { type: "number" },
              customer: {
                type: "object",
                properties: {
                  uuid: { type: "string" },
                  name: { type: "string" },
                },
                required: ["uuid", "name"],
              },
              sales: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    sale_uuid: { type: "string" },
                    date: { type: "string", format: "date-time" },
                    total_amount: { type: "number" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          product_name: { type: "string" },
                          item_uuid: { type: "string" },
                          quantity: { type: "integer" },
                          unit_price: { type: "number" },
                          subtotal: { type: "number" },
                          product_uuid: { type: "string" },
                        },
                        required: [
                          "product_name",
                          "item_uuid",
                          "quantity",
                          "unit_price",
                          "subtotal",
                          "product_uuid",
                        ],
                      },
                    },
                  },
                  required: ["sale_uuid", "date", "total_amount", "items"],
                },
              },
            },
            required: ["total_spent", "customer", "sales"],
          },
        },
      },
    },
    handler: getCustomerSalesMonthlySummaryController,
  };
  
export {
  getCustomersOptions,
  getCustomerOptions,
  postCustomerOptions,
  updateCustomerOptions,
  softDeleteCustomerOptions,
  getCustomerSalesSummaryOptions,
};
