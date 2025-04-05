// schema validation

import {
  getItemsController,
  getItemController,
} from "../controllers/items-controller.js";

//Interface for item object
const Item = {
  type: "object",
  properties: {
    id: { type: "integer" },
    uuid: { type: "string", format: "uuid" }, // UUID for the item
    sale_id: { type: "integer" }, // Reference to the sale this item belongs to
    product_id: { type: "integer" }, // Reference to the product in the sale
    quantity: { type: "integer" }, // Quantity of this product in the sale
    unit_price: { type: "number", format: "float" }, // Price per unit of the product
    subtotal: { type: "number", format: "float" }, // Calculated total for this product (quantity * unit_price)
    created_at: { type: "string", format: "date-time" }, // Timestamp of when the item was created
    updated_at: { type: "string", format: "date-time" }, // Timestamp of when the item was last updated
  },
};
// -----------------------------

//Options for get all items
const getItemsOptions = {
  schema: {
    response: {
      200: {
        type: "array",
        //returns an array of objects
        items: Item,
      },
    },
  },
  handler: getItemsController,
};

// Options for get item by id
const getItemOptions = {
  schema: {
    //to add a params object to the schema, uncomment the params object below
    // params: {
    //   type: 'object',
    //   properties: {
    //     id: { type: 'integer' },
    //   },
    // },
    response: {
      200: Item,
      // returns a singular object
    },
  },
  handler: getItemController,
};


// Options for get item by id
const postItemOptions = {
    schema: {
      //to add a params object to the schema, uncomment the params object below
      // params: {
      //   type: 'object',
      //   properties: {
      //     id: { type: 'integer' },
      //   },
      // },
      response: {
        201: Item,
        // returns a singular object
      },
    },
    handler: getItemController,
  };
  
export { getItemsOptions, getItemOptions, postItemOptions };
// export { getItemsOptions, getItemOptions, Item }; // export the options and item object
