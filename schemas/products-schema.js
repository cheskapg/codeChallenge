// schema validation

import {
    getItemsController,
    getItemController,
    addItemController,
    updateItemController,
    softDeleteItemController,
  } from "../controllers/items-controller.js";const Product = {
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
  