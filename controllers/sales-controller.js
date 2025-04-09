import { v4 as uuidv4 } from "uuid";
// import customers from "../testData/customers.js"; // Assuming the `customers` data is imported
// import sales from "../sales.js"; // Assuming the `sales` data is imported
// import sale_items from "../testData/items.js"; // Assuming the `sale_items` 
import pool from "../plugins/db.js"; 


// Get all active (non-deleted) sales
const getSalesController = async (req, reply) => {
    try {
      const result = await pool.query('SELECT * FROM sales WHERE deleted_at IS NULL');
      reply.send(result.rows);
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving sales", error: err });
    }
  };
  
  // Get a single sale by UUID
  const getSaleController = async (req, reply) => {
    const { uuid } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT * FROM sales WHERE uuid = $1 AND deleted_at IS NULL',
        [uuid]
      );
  
      if (result.rows.length === 0) {
        return reply.code(404).send({ message: "Sale not found or deleted" });
      }
  
      reply.send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving sale", error: err });
    }
  };
  
  // Add a new sale
  const addSaleController = async (req, reply) => {
    const { customer_id, date, total_amount } = req.body;
  
    if (!customer_id || !date || !total_amount) {
      return reply.code(400).send({ message: "Missing required fields" });
    }
  
    const uuid = "sale-" + uuidv4();
    const timestamp = new Date().toISOString();
  
    try {
      const result = await pool.query(
        `INSERT INTO sales (uuid, customer_id, date, total_amount, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $5)
         RETURNING *`,
        [uuid, customer_id, date, total_amount, timestamp]
      );
  
      reply.code(201).send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ message: "Error adding sale", error: err });
    }
  };
  
  // Update a sale
  const updateSaleController = async (req, reply) => {
    const { uuid } = req.params;
    const { date, total_amount } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE sales
         SET date = COALESCE($1, date),
             total_amount = COALESCE($2, total_amount),
             updated_at = NOW()
         WHERE uuid = $3 AND deleted_at IS NULL
         RETURNING *`,
        [date, total_amount, uuid]
      );
  
      if (result.rows.length === 0) {
        return reply.code(404).send({ message: "Sale not found" });
      }
  
      reply.send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ message: "Error updating sale", error: err });
    }
  };
  
  // Soft delete a sale
  const softDeleteSaleController = async (req, reply) => {
    const { uuid } = req.params;
    const deletedAt = new Date().toISOString();
  
    try {
      const result = await pool.query(
        `UPDATE sales
         SET deleted_at = $1
         WHERE uuid = $2 AND deleted_at IS NULL
         RETURNING *`,
        [deletedAt, uuid]
      );
  
      if (result.rows.length === 0) {
        return reply.code(404).send({ message: "Sale not found" });
      }
  
      reply.send({ message: "Sale soft-deleted successfully" });
    } catch (err) {
      reply.code(500).send({ message: "Error deleting sale", error: err });
    }
  };
  
export {
  getSalesController,
  getSaleController,
  addSaleController,
  updateSaleController,
  softDeleteSaleController,
  // getSalesByCustomerAndMonthController,
  // getSalesByMonthController,
};
