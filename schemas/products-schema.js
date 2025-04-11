// schema validation

import {
  getProductsController,
  getProductController,
  addProductController,
  updateProductController,
  softDeleteProductController,
} from "../controllers/products-controller.js";

const Product = {
  type: "object",
  properties: {
    id: { type: "integer" },
    uuid: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    sku: { type: "string" },
    stock: { type: "integer" },
    deleted_at: { type: ["string", "null"], format: "date-time" },
  },
};

const getProductsOptions = {
  schema: {
    tags: ["Products"],
    summary: "Retrieve all products",
    description: "Fetch a list of all available products.",
    response: {
      200: {
        type: "array",
        items: Product,
      },
    },
  },
  handler: getProductsController,
};

const getProductOptions = {
  schema: {
    tags: ["Products"],
    summary: "Retrieve a single product",
    description: "Fetch details of a product by its UUID.",
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    response: {
      200: Product,
    },
  },
  handler: getProductController,
};

const postProductOptions = {
  schema: {
    tags: ["Products"],
    summary: "Add a new product",
    description: "Create a new product with the provided details.",
    body: {
      type: "object",
      required: ["name", "description", "price", "sku", "stock"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        sku: { type: "string" },
        stock: { type: "integer" },
      },
    },
    response: {
      201: Product,
    },
  },
  handler: addProductController,
};

const updateProductOptions = {
  schema: {
    tags: ["Products"],
    summary: "Update a product",
    description: "Update the details of an existing product by its UUID.",
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        sku: { type: "string" },
        stock: { type: "integer" },
      },
    },
    response: {
      200: Product,
    },
  },
  handler: updateProductController,
};

const softDeleteProductOptions = {
  schema: {
    tags: ["Products"],
    summary: "Soft delete a product",
    description:
      "Mark a product as deleted by its UUID without removing it from the database.",
    params: {
      type: "object",
      properties: {
        uuid: { type: "string" },
      },
    },
    response: {
      200: Product,
    },
  },
  handler: softDeleteProductController,
};

export {
  getProductsOptions,
  getProductOptions,
  postProductOptions,
  updateProductOptions,
  softDeleteProductOptions,
};
