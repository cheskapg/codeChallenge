import { v4 as uuidv4 } from "uuid";
import pool from "../plugins/db.js"; // Assuming you have a db.js file for your PostgreSQL connection

// Get all products
const getProductsController = async (req, reply) => {
  try {
    const res = await pool.query("SELECT * FROM products WHERE deleted_at IS NULL");
    reply.send(res.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

// Get a product by UUID
const getProductController = async (req, reply) => {
  const { uuid } = req.params;

  try {
    const res = await pool.query("SELECT * FROM products WHERE uuid = $1 AND deleted_at IS NULL", [uuid]);

    if (res.rowCount === 0) {
      return reply.code(404).send({ message: "Product not found" });
    }

    reply.send(res.rows[0]);
  } catch (err) {
    console.error("Error fetching product:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

// Add a new product
const addProductController = async (req, reply) => {
  const { name, description, price, sku, stock } = req.body;

  if (!name || !description || !price || !sku || !stock) {
    return reply.code(400).send({ message: "Missing required fields" });
  }

  const newProductUuid = "prod-"+uuidv4();

  try {
    const res = await pool.query(
      `INSERT INTO products (uuid, name, description, price, sku, stock, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING uuid, name, description, price, sku, stock`,
      [newProductUuid, name, description, price, sku, stock]
    );

    reply.code(201).send(res.rows[0]);
  } catch (err) {
    console.error("Error adding product:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

// Update an existing product by UUID
const updateProductController = async (req, reply) => {
  const { uuid } = req.params;
  const { name, description, price, sku, stock } = req.body;

  try {
    const res = await pool.query("SELECT * FROM products WHERE uuid = $1 AND deleted_at IS NULL", [uuid]);

    if (res.rowCount === 0) {
      return reply.code(404).send({ message: "Product not found" });
    }

    const updatedProduct = {
      name: name ?? res.rows[0].name,
      description: description ?? res.rows[0].description,
      price: price ?? res.rows[0].price,
      sku: sku ?? res.rows[0].sku,
      stock: stock ?? res.rows[0].stock,
    };

    await pool.query(
      `UPDATE products SET name = $1, description = $2, price = $3, sku = $4, stock = $5, updated_at = NOW()
       WHERE uuid = $6 RETURNING uuid, name, description, price, sku, stock`,
      [
        updatedProduct.name,
        updatedProduct.description,
        updatedProduct.price,
        updatedProduct.sku,
        updatedProduct.stock,
        uuid,
      ]
    );

    reply.send(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

// Soft delete a product by UUID (Mark it as deleted)
const softDeleteProductController = async (req, reply) => {
  const { uuid } = req.params;

  try {
    const res = await pool.query("SELECT * FROM products WHERE uuid = $1 AND deleted_at IS NULL", [uuid]);

    if (res.rowCount === 0) {
      return reply.code(404).send({ message: "Product not found" });
    }

    const deletedProduct = res.rows[0];

    await pool.query(
      "UPDATE products SET deleted_at = NOW() WHERE uuid = $1 RETURNING uuid, name, description, price, sku, stock, deleted_at",
      [uuid]
    );

    reply.send({
      message: "Product marked as deleted",
      product: {
        ...deletedProduct,
        deleted_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error soft deleting product:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

export {
  getProductsController,
  getProductController,
  addProductController,
  updateProductController,
  softDeleteProductController,
};
