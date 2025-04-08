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
    product_name: { type: "string" }, // Reference to the product in the sale
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
    tags: ["Items"],
    summary: "Get all items",
    description: "Retrieve all items in the database",
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
    tags: ["Items"],
    summary: "Get item by UUID",
    description: "Retrieve a specific item using its UUID",
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
    tags: ['Items'],
    summary: "Add a new item to the sale",
    description: "Add a new item to the sale with product details",
    body: {
      type: "object",
      required: ["product_uuid", "quantity"], // Added required fields
      properties: {
        sale_uuid: { type: "string" }, // Optional sale_uuid
        product_uuid: { type: "string" }, // Required product_uuid
        quantity: { type: "integer" }, // Required quantity
      },
    },
    response: {
      201: { 
        type: "object", // Define the response structure
        properties: {
          message: { type: "string" },
          item: { 
            type: "object", // Define the item object properties
            properties: {
              uuid: { type: "string" },
              sale_id: { type: "integer" },
              product_id: { type: "integer" },
              quantity: { type: "integer" },
              unit_price: { type: "number" },
              subtotal: { type: "number" },
            },
          },
        },
      },
    },
  },
  handler: addItemController,
};


// Options for updating an item
const updateItemOptions = {
  schema: {
    tags: ["Items"],
    summary: "Update an item",
    description: "Update the details of an existing item",
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    body: {
      type: "object",
      // required: ["quantity", "unit_price"],
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
    tags: ["Items"],
    summary: "Soft delete an item",
    description: "Mark an item as deleted without removing it from the database",
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
