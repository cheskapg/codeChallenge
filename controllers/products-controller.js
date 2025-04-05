import { v4 as uuidv4 } from 'uuid';
import products from '../models/products.js';  // Assuming you have products data in a separate model

// Get all products
const getProductsController = (req, reply) => {
  reply.send(products);
};

// Get a product by UUID
const getProductController = (req, reply) => {
  const { uuid } = req.params;
  const product = products.find((prod) => prod.uuid === uuid);
  
  if (!product) {
    return reply.code(404).send({ message: "Product not found" });
  }
  
  reply.send(product);
};

// Add a new product
const addProductController = (req, reply) => {
  const { name, description, price, sku, stock } = req.body;

  if (!name || !description || !price || !sku || !stock) {
    return reply.code(400).send({ message: "Missing required fields" });
  }

  const newProduct = {
    id: products.length + 1,  // increment ID
    uuid: "prod-" + uuidv4(),
    name,
    description,
    price,
    sku,
    stock,
  };

  products.push(newProduct);
  reply.code(201).send(newProduct);
};

// Update an existing product by UUID
const updateProductController = (req, reply) => {
  const { uuid } = req.params;
  const { name, description, price, sku, stock } = req.body;

  const product = products.find((prod) => prod.uuid === uuid);

  if (!product) {
    return reply.code(404).send({ message: "Product not found" });
  }

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (sku !== undefined) product.sku = sku;
  if (stock !== undefined) product.stock = stock;

  reply.send(product);
};

// Soft delete a product by UUID (Mark it as deleted)
const softDeleteProductController = (req, reply) => {
  const { uuid } = req.params;
  const product = products.find((prod) => prod.uuid === uuid);

  if (!product) {
    return reply.code(404).send({ message: "Product not found" });
  }

  product.deleted_at = new Date().toISOString();  // Mark the product as deleted
  reply.send(product);
};

export {
  getProductsController,
  getProductController,
  addProductController,
  updateProductController,
  softDeleteProductController,
};
