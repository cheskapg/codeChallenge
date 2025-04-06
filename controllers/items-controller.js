//controller for sale_items / handler for sale_items
import pool from "../plugins/db.js"; // adjust the path as needed
import { v4 as uuidv4 } from "uuid";
// Get all active sale items
const getItemsController = async (req, reply) => {
  try {
    const result = await pool.query(
      `SELECT uuid, sale_id, product_id, item_name, quantity, unit_price, created_at, updated_at
       FROM sale_items
       WHERE deleted_at IS NULL`
    );
    reply.send(result.rows);
  } catch (err) {
    console.error("Error fetching items:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

// Get a single sale item by UUID
const getItemController = async (req, reply) => {
  const { uuid } = req.params;
  try {
    const result = await pool.query(
      `SELECT uuid, sale_id, product_id, item_name, quantity, unit_price, created_at, updated_at
       FROM sale_items
       WHERE uuid = $1 AND deleted_at IS NULL`,
      [uuid]
    );
    if (result.rowCount === 0) {
      return reply.code(404).send({ message: "Item not found" });
    }
    reply.send(result.rows[0]);
  } catch (err) {
    console.error("Error fetching item:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};
const addItemController = async (req, reply) => {
  const { sale_uuid, product_uuid, quantity } = req.body;

  if (!sale_uuid || !product_uuid || !quantity) {
    return reply.code(400).send({ message: "Missing required fields" });
  }

  try {
    // 1. Get sale_id from sale_uuid
    const saleRes = await pool.query(
      `SELECT id FROM sales WHERE uuid = $1 AND deleted_at IS NULL`,
      [sale_uuid]
    );
    if (saleRes.rowCount === 0) {
      return reply.code(404).send({ message: "Sale not found" });
    }
    const saleId = saleRes.rows[0].id;

    // 2. Get product_id and price from product_uuid
    const productRes = await pool.query(
      `SELECT id, name, price FROM products WHERE uuid = $1 AND deleted_at IS NULL`,
      [product_uuid]
    );
    if (productRes.rowCount === 0) {
      return reply.code(404).send({ message: "Product not found" });
    }

    const { id: productId, price: unitPrice } = productRes.rows[0];

    const subtotal = quantity * unitPrice;
    const itemUuid = uuidv4();

    // 3. Insert into sale_items and return subtotal
    const insertRes = await pool.query(
      `INSERT INTO sale_items (uuid, sale_id, product_id,  quantity, unit_price, subtotal, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING uuid, sale_id, product_id,  quantity, unit_price, subtotal`,
      [itemUuid, saleId, productId, quantity, unitPrice, subtotal]
    );

    const insertedItem = insertRes.rows[0];

    // 4. Update sale total
    await pool.query(
      `UPDATE sales
       SET total_amount = total_amount + $1, updated_at = NOW()
       WHERE id = $2`,
      [subtotal, saleId]
    );

    reply.send({
      message: "Item added successfully",
      item: insertedItem,
    });
  } catch (err) {
    console.error("Error adding item:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

// Update item by UUID and adjust sale total accordingly
const updateItemController = async (req, reply) => {
  const { uuid } = req.params;
  const { quantity, unit_price } = req.body;

  try {
    // Get current item
    const itemRes = await pool.query(
      `SELECT id, sale_id, quantity, unit_price
       FROM sale_items
       WHERE uuid = $1 AND deleted_at IS NULL`,
      [uuid]
    );
    if (itemRes.rowCount === 0) {
      return reply.code(404).send({ message: "Item not found" });
    }

    const item = itemRes.rows[0];
    const oldSubtotal = item.quantity * item.unit_price;

    const newQuantity = quantity !== undefined ? quantity : item.quantity;
    const newUnitPrice =
      unit_price !== undefined ? unit_price : item.unit_price;
    const newSubtotal = newQuantity * newUnitPrice;

    // Update item
    await pool.query(
      `UPDATE sale_items
       SET quantity = $1,
           unit_price = $2,
           updated_at = NOW()
       WHERE uuid = $3`,
      [newQuantity, newUnitPrice, uuid]
    );

    // Update sale total
    await pool.query(
      `UPDATE sales
       SET total_amount = total_amount + $1, updated_at = NOW()
       WHERE id = $2`,
      [newSubtotal - oldSubtotal, item.sale_id]
    );

    reply.send({ message: "Item updated successfully" });
  } catch (err) {
    console.error("Error updating item:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

// Soft delete item by UUID and update total_amount
const softDeleteItemController = async (req, reply) => {
  const { uuid } = req.params;

  try {
    // Fetch item
    const itemRes = await pool.query(
      `SELECT id, sale_id, quantity, unit_price FROM sale_items WHERE uuid = $1 AND deleted_at IS NULL`,
      [uuid]
    );
    if (itemRes.rowCount === 0) {
      return reply.code(404).send({ message: "Item not found" });
    }

    const item = itemRes.rows[0];
    const subtotal = item.quantity * item.unit_price;

    // Soft delete
    await pool.query(
      `UPDATE sale_items
       SET deleted_at = NOW()
       WHERE uuid = $1`,
      [uuid]
    );

    // Update total
    await pool.query(
      `UPDATE sales
       SET total_amount = total_amount - $1,
           updated_at = NOW()
       WHERE id = $2`,
      [subtotal, item.sale_id]
    );

    reply.send({ message: "Item soft-deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    reply.code(500).send({ message: "Internal server error" });
  }
};

export {
  getItemController,
  getItemsController,
  addItemController,
  updateItemController,
  softDeleteItemController,
};
