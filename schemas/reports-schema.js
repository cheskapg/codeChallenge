// schema validation

import {
  getSalesByCustomerAndMonthController,
  getSalesByMonthController,
  getCustomerSalesMonthlySummaryController
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
    security: [{ bearerAuth: [] }],
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
    summary: "Get monthly sales summary grouped by customer",
    description:
      "Returns all customer sales with total sales, grouped by customer and month",
    params: {
      type: "object",
      properties: {
        year: { type: "integer" },
        month: { type: "integer" },
      },
      required: ["year", "month"],
    },
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            total_customer_monthly_sale: { type: "number" },
            customer: {
              type: "object",
              properties: {
                uuid: { type: "string", format: "uuid" },
                name: { type: "string" },
              },
              required: ["uuid", "name"],
            },
            sales: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  sale_uuid: { type: "string", format: "uuid" },
                  date: { type: "string", format: "date-time" },
                  total_amount: { type: "number" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        item_uuid: { type: "string", format: "uuid" },
                        product_name: { type: "string" },
                        quantity: { type: "integer" },
                        unit_price: { type: "number" },
                        subtotal: { type: "number" },
                        product_uuid: { type: "string", format: "uuid" },
                      },
                      required: [
                        "item_uuid",
                        "product_name",
                        "quantity",
                        "unit_price",
                        "subtotal",
                        "product_uuid",
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  handler: getCustomerSalesMonthlySummaryController,
};

export { getSalesByMonthOptions, getSalesByCustomerAndMonthOptions };
