// schema validation

import {
  getSalesController,
  getSaleController,
  addSaleController,
  softDeleteSaleController,
  updateSaleController,
  getCustomerSalesController,
} from "../controllers/sales-controller.js";

const Sales = {
  type: "object",
  properties: {
    uuid: { type: "string" },
    customer_uuid: { type: "string" },
    date: { type: "string", format: "date-time" },
    total_amount: { type: "number" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
};

//Options for get all items
const getSalesOptions = {
  schema: {
    tags: ["Sales"],
    summary: "Get all sales",
    description: "Retrieve all sales in the database",
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "array",
        //returns an array of objects
        items: Sales,
      },
    },
  },
  handler: getSalesController,
};
const getCustomerSalesOptions = {
  schema: {
    tags: ["Sales"],
    summary: "Get all customer sales",
    description: "Retrieve all sales in the database",
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "array",
        //returns an array of objects
        items: Sales,
      },
    },
  },
  handler: getCustomerSalesController,
};

// Options for get item by id
const getSaleOptions = {
  schema: {
    tags: ["Sales"],
    summary: "Get sale by UUID",
    description: "Retrieve a specific sale using its UUID",
    security: [{ bearerAuth: [] }],
    response: {
      200: Sales,
      // returns a singular object
    },
  },
  handler: getSaleController,
};
const addSaleOptions = {
  schema: {
    tags: ["Sales"],
    summary: "Add a new sale",
    description: "Create a new sale in the database",
    //   required: ["customer_id", "date", "total_amount"],
    body: {
      type: "object",
      required: ["customer_id", "date", "total_amount"],
      properties: {
        customer_id: { type: "integer" },
        date: { type: "string", format: "date-time" },
        total_amount: { type: "number" },
      },
    },
    security: [{ bearerAuth: [] }],
    response: {
      201: Sales,
    },
  },
  handler: addSaleController,
};

const updateSaleOptions = {
  schema: {
    tags: ["Sales"],
    summary: "Update a sale",
    description: "Update an existing sale in the database",
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    body: {
      type: "object",
      //   required: ["customer_id", "date", "total_amount"],
      properties: {
        customer_id: { type: "integer" },
        date: { type: "string", format: "date-time" },
        total_amount: { type: "number" },
      },
    },
    security: [{ bearerAuth: [] }],
    response: {
      200: Sales,
    },
  },
  handler: updateSaleController,
};

const softDeleteSaleOptions = {
  schema: {
    tags: ["Sales"],
    summary: "Soft delete a sale",
    description: "Mark a sale as deleted without removing it from the database",
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    security: [{ bearerAuth: [] }],
    response: {
      200: Sales,
    },
  },
  handler: softDeleteSaleController,
};
export {
  getSaleOptions,
  getSalesOptions,
  getCustomerSalesOptions,
  updateSaleOptions,
  addSaleOptions,
  softDeleteSaleOptions,
};
