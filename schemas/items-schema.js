// schema validation

import {
  getItemsController,
  getItemController,
  addItemController,
  updateItemController,
  softDeleteItemController,
} from "../controllers/items-controller.js";

// Interface for item object
const Item = {
  type: "object",
  properties: {
    id: { type: "integer" },
    uuid: { type: "string", format: "uuid" }, // UUID for the item
    sale_uuid: { type: "string" }, // Reference to the sale this item belongs to
    product_uuid: { type: "string" }, // Reference to the product in the sale
    quantity: { type: "integer" }, // Quantity of this product in the sale
    unit_price: { type: "number", format: "float" }, // Price per unit of the product
    subtotal: { type: "number", format: "float" }, // Calculated total for this product (quantity * unit_price)
    created_at: { type: "string", format: "date-time" }, // Timestamp of when the item was created
    updated_at: { type: "string", format: "date-time" }, // Timestamp of when the item was last updated
    deleted_at: { type: "string", format: "date-time" }, // Soft delete timestamp
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
    body: {
      type: "object",
      required: ["sale_id", "product_id", "quantity", "unit_price"],
      properties: {
        sale_uuid: { type: "string" },
        product_uuid: { type: "string" },
        quantity: { type: "integer" },
        unit_price: { type: "number" },
      },
    },
    response: {
      201: Item,
      // returns a singular object
    },
  },
  handler: addItemController,
};

// Options for updating an item
const updateItemOptions = {
  schema: {
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["quantity", "unit_price"],
      properties: {
        quantity: { type: "integer" },
        unit_price: { type: "number" },
      },
    },
    response: {
      200: Item, // returns the updated item object
    },
  },
  handler: updateItemController,
};

// Options for soft deleting an item
const softDeleteItemOptions = {
  schema: {
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    response: {
      200: Item, // returns the soft-deleted item
    },
  },
  handler: softDeleteItemController,
};

export {
  getItemsOptions,
  getItemOptions,
  postItemOptions,
  updateItemOptions,
  softDeleteItemOptions,
};
