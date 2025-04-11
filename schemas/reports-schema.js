// schema validation

import {
  getSalesByCustomerAndMonthController,
  getSalesByMonthController,
} from "../controllers/reports-controller.js";

const getSalesByMonthOptions = {
  schema: {
    tags: ["Reports"],
    summary: "Get all sales by month",
    description: "Retrieve all sales for a specific month and year",
    params: {
      type: "object",
      properties: {
        year: { type: "integer" },
        month: { type: "integer" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          totalMonthlySales: { type: "number" }, // Total sales for the month
          month: { type: "integer" }, // Target month (1-12)
          year: { type: "integer" }, // Target year
          numberOfSales: { type: "integer" }, // Number of sales in the month
          sales: {
            type: "array", // Array of sales
            items: {
              type: "object",
              properties: {
                //   id: { type: "integer" },
                uuid: { type: "string" },
                customer_id: { type: "integer" },
                date: { type: "string", format: "date-time" },
                total_amount: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
  handler: getSalesByMonthController,
};

const getSalesByCustomerAndMonthOptions = {
  schema: {
    tags: ["Reports"],
    params: {
      type: "object",
      properties: {
        year: { type: "string" },
        month: { type: "string" },
        customer_id: { type: "string" },
      },
      required: ["year", "month", "customer_id"],
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            uuid: { type: "string", format: "uuid" },
            customer_id: { type: "integer" },
            date: { type: "string", format: "date-time" },
            total_amount: {
              type: "integer",
             
            },
            created_at: { type: ["string", "null"], format: "date-time" },
            deleted_at: { type: ["string", "null"], format: "date-time" },
            updated_at: { type: ["string", "null"], format: "date-time" },
            status: { type: ["string", "null"] },
          },
          required: ["id", "uuid", "customer_id", "date", "total_amount"],
        },
      },
    },
  },
  handler: getSalesByCustomerAndMonthController,
};

export { getSalesByMonthOptions, getSalesByCustomerAndMonthOptions };
