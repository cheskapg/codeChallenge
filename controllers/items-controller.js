//controller for sale_items / handler for sale_items
import pool from "../plugins/db.js"; // adjust the path as needed
import { v4 as uuidv4 } from "uuid";
// Get all active sale items
const getItemsController = async (req, reply) => {
  try {
    const result = await pool.query(
      `SELECT 
         sale_items.uuid,
         sale_items.sale_id,
         sale_items.product_id,
         sale_items.quantity,
         sale_items.unit_price,
         products.uuid as product_uuid,
         products.name as product_name,
         sales.id as sale_id,
         sale_items.subtotal, 
         sale_items.created_at,
         sale_items.updated_at
       FROM sale_items
       JOIN products ON sale_items.product_id = products.id
       JOIN sales ON sale_items.sale_id = sales.id
       WHERE sale_items.deleted_at IS NULL`
    );
    const items = result?.rows || [];

    if (items.length === 0) {
      return reply.code(200).send([]); // preferred, consistent type
    }
    reply.send(items);
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
      `SELECT uuid, sale_id, product_id, quantity, unit_price, created_at, updated_at
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

  if (!product_uuid || !quantity) {
    return reply.code(400).send({ message: "Missing required fields" });
  }
  
  let saleId;

  try {
    if (sale_uuid) {
      const saleRes = await pool.query(
        `SELECT id FROM sales WHERE uuid = $1 AND deleted_at IS NULL`,
        [sale_uuid]
      );

      if (saleRes.rowCount === 0) {
        return reply.code(404).send({ message: "Sale not found" });
      }
      saleId = saleRes.rows[0].id;
    } else {
      // If sale_uuid is empty, create a new sale
      const newSaleRes = await pool.query(
        `INSERT INTO sales (uuid, total_amount, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         RETURNING id`,
        ["item-"+uuidv4(), 0]  // New sale with 0 initial total_amount
      );
      saleId = newSaleRes.rows[0].id;
    }
    // // 1. Get sale_id from sale_uuid
    // const saleRes = await pool.query(
    //   `SELECT id FROM sales WHERE uuid = $1 AND deleted_at IS NULL`,
    //   [sale_uuid]
    // );
    // if (saleRes.rowCount === 0) {
    //   return reply.code(404).send({ message: "Sale not found" });
    // }
    // const saleId = saleRes.rows[0].id;

    // 2. Get product_id, price, and current stock from product_uuid
    const productRes = await pool.query(
      `SELECT id, name, price, stock FROM products WHERE uuid = $1 AND deleted_at IS NULL`,
      [product_uuid]
    );
    if (productRes.rowCount === 0) {
      return reply.code(404).send({ message: "Product not found" });
    }

    const { id: productId, price: unitPrice, stock: currentStock } = productRes.rows[0];

    if (currentStock < quantity) {
      return reply.code(400).send({ message: "Not enough stock available" });
    }

    const subtotal = quantity * unitPrice;
    const itemUuid = uuidv4();

    // 3. Insert into sale_items and return subtotal
    const insertRes = await pool.query(
      `INSERT INTO sale_items (uuid, sale_id, product_id, quantity, unit_price, subtotal, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING uuid, sale_id, product_id, quantity, unit_price, subtotal`,
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

    // 5. Subtract stock from the product table
    await pool.query(
      `UPDATE products
       SET stock = stock - $1, updated_at = NOW()
       WHERE id = $2`,
      [quantity, productId]
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
      `SELECT id, sale_id, product_id, quantity, unit_price
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
    const newUnitPrice = unit_price !== undefined ? unit_price : item.unit_price;
    const newSubtotal = newQuantity * newUnitPrice;

    // Get the current stock of the product
    const productRes = await pool.query(
      `SELECT id, stock FROM products WHERE id = $1 AND deleted_at IS NULL`,
      [item.product_id]
    );
    if (productRes.rowCount === 0) {
      return reply.code(404).send({ message: "Product not found" });
    }

    const { stock: currentStock } = productRes.rows[0];

    // Calculate the difference in quantity and adjust the stock accordingly
    const stockDifference = newQuantity - item.quantity;

    if (currentStock - stockDifference < 0) {
      return reply.code(400).send({ message: "Not enough stock available" });
    }

    // Update sale item with new quantity and unit price
    await pool.query(
      `UPDATE sale_items
       SET quantity = $1,
           unit_price = $2,
           updated_at = NOW()
       WHERE uuid = $3`,
      [newQuantity, newUnitPrice, uuid]
    );

    // Update product stock
    await pool.query(
      `UPDATE products
       SET stock = stock - $1, updated_at = NOW()
       WHERE id = $2`,
      [stockDifference, item.product_id]
    );

    // Update sale total based on the change in subtotal
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
    // 1. Check item exists and not already deleted
    const itemRes = await pool.query(
      `SELECT id, sale_id, quantity, unit_price 
       FROM sale_items 
       WHERE uuid = $1 AND deleted_at IS NULL`,
      [uuid]
    );

    if (itemRes.rowCount === 0) {
      return reply.code(404).send({ message: "Item not found or already deleted" });
    }

    const item = itemRes.rows[0];
    const subtotal = parseFloat(item.quantity) * parseFloat(item.unit_price);

    // 2. Soft delete the item
    await pool.query(
      `UPDATE sale_items 
       SET deleted_at = NOW(), updated_at = NOW()
       WHERE uuid = $1`,
      [uuid]
    );

    // 3. Update sale's total amount
    await pool.query(
      `UPDATE sales 
       SET total_amount = total_amount - $1, updated_at = NOW()
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
