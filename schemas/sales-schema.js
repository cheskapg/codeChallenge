// schema validation

import { getSalesByMonthController,getSalesController,getSaleController,addSaleController,softDeleteSaleController, updateSaleController } from "../controllers/sales-controller.js";


const Sales = {
  type: "object",
  properties: {
    id: { type: "integer" },
    uuid: { type: "string" },
    customer_id: { type: "integer" },
    date: { type: "string", format: "date-time" },
    total_amount: { type: "number" },
  },
};
const getSalesByMonthOptions = {
    schema: {
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
  

//Options for get all items
const getSalesOptions = {
  schema: {
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

// Options for get item by id
const getSaleOptions = {
  schema: {

    response: {
      200: Sales,
      // returns a singular object
    },
  },
  handler: getSaleController,
};
const addSaleOptions = {
  schema: {
    body: {
      type: "object",
      required: ["customer_id", "date", "total_amount"],
      properties: {
        customer_id: { type: "integer" },
        date: { type: "string", format: "date-time" },
        total_amount: { type: "number" },
      },
    },
    response: {
      201: Sales,
    },
  },
  handler: addSaleController,
};

const updateSaleOptions = {
  schema: {
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
    response: {
      200: Sales,
    },
  },
  handler: updateSaleController,
};

const softDeleteSaleOptions = {
  schema: {
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    response: {
      200: Sales,
    },
  },
  handler: softDeleteSaleController,
};
export { getSalesByMonthOptions, getSaleOptions, getSalesOptions, updateSaleOptions, addSaleOptions, softDeleteSaleOptions };
