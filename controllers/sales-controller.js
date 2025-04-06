import { v4 as uuidv4 } from "uuid";
// import customers from "../testData/customers.js"; // Assuming the `customers` data is imported
// import sales from "../sales.js"; // Assuming the `sales` data is imported
// import sale_items from "../testData/items.js"; // Assuming the `sale_items` 
import pool from "../plugins/db.js"; 

// Get all sales (with optional filtering for active sales)
// const getSalesController = (req, reply) => {
//   // Filter out soft-deleted sales
//   const activeSales = sales.filter((sale) => !sale.deleted_at);
//   reply.send(activeSales);
// };

// // Get a single sale by its UUID
// const getSaleController = (req, reply) => {
//   const { uuid } = req.params; // Get UUID from URL params
//   const sale = sales.find((sale) => sale.uuid === uuid);

//   if (!sale || sale.deleted_at) {
//     return reply.code(404).send({ message: "Sale not found or deleted" });
//   }

//   reply.send(sale);
// };

// // Add a new sale
// const addSaleController = (req, reply) => {
//   const { customer_id, date, total_amount } = req.body;

//   // Validation checks
//   if (!customer_id || !date || !total_amount) {
//     return reply.code(400).send({ message: "Missing required fields" });
//   }

//   // Ensure the customer exists
//   const customer = customers.find((customer) => customer.id === customer_id);
//   if (!customer) {
//     return reply.code(404).send({ message: "Customer not found" });
//   }

//   // Create a new sale object
//   const newSale = {
//     id: sales.length + 1, // Increment the id
//     uuid: "sale-" + uuidv4(), // Generate a new UUID for sale
//     customer_id,
//     date,
//     total_amount,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     deleted_at: null, // No soft delete initially
//   };

//   // Add the new sale to the sales array
//   sales.push(newSale);

//   // Respond with the newly created sale
//   reply.code(201).send(newSale);
// };

// // Update an existing sale by UUID
// const updateSaleController = (req, reply) => {
//   const { uuid } = req.params; // Use UUID for identification
//   const { date, total_amount } = req.body;

//   // Find the sale by UUID
//   const sale = sales.find((sale) => sale.uuid === uuid);
//   if (!sale) {
//     return reply.code(404).send({ message: "Sale not found" });
//   }

//   // Update only the fields that are passed
//   if (date !== undefined) sale.date = date;
//   if (total_amount !== undefined) sale.total_amount = total_amount;

//   // Update the timestamp
//   sale.updated_at = new Date().toISOString();

//   // Respond with the updated sale
//   reply.send(sale);
// };

// // Soft delete a sale by UUID (Mark it as deleted without removing)
// const softDeleteSaleController = (req, reply) => {
//   const { uuid } = req.params; // Use UUID for identification

//   // Find the sale by UUID
//   const sale = sales.find((sale) => sale.uuid === uuid);
//   if (!sale) {
//     return reply.code(404).send({ message: "Sale not found" });
//   }

//   // Mark the sale as deleted by setting the `deleted_at` field
//   sale.deleted_at = new Date().toISOString(); // Add a timestamp to indicate when it was deleted

//   // Respond with the updated sale
//   reply.send(sale);
// };

// const getSalesByCustomerAndMonthController = (req, reply) => {
//   const {  year, month } = req.params; // Get customer_id, year, and month from URL params

//   // Convert year and month to integers
//   const targetYear = parseInt(year);
//   const targetMonth = parseInt(month) - 1; // JavaScript months are 0-indexed (January is 0)

//   // Filter sales by customer and the given month and year
//   const customerSales = sales.filter((sale) => {
//     const date = new Date(sale.date);
//     return (
//       sale.customer_id === parseInt(customer_id) &&
//       date.getFullYear() === targetYear &&
//       date.getMonth() === targetMonth
//     );
//   });

//   if (customerSales.length === 0) {
//     return reply
//       .code(404)
//       .send({ message: "No sales found for this customer in the given month" });
//   }

//   reply.send(customerSales);
// };
// // Get all sales by a specific given month and year
// const getSalesByMonthController = (req, reply) => {
//   const { year, month } = req.params; // Get customer_id, year, and month from URL params

//   // Convert year and month to integers
//   const targetYear = parseInt(year);
//   const targetMonth = parseInt(month) - 1; // JavaScript months are 0-indexed (January is 0)

//   let totalMonthlySales = 0; // Initialize total monthly sales
//   let monthlySalesSummary = {
//     totalMonthlySales: totalMonthlySales,
//     month: targetMonth + 1, // Convert back to 1-based month
//     year: targetYear,
//     numberOfSales: 0, // Initialize number of sales
//     sales: [], // This will hold all the sales in the given month
//   };

//   // Filter sales by customer and the given month and year
//   const monthlySales = sales.filter((sale) => {
//     const date = new Date(sale.date);
//     return date.getFullYear() === targetYear && date.getMonth() === targetMonth;
//   });
//   for (const sale of monthlySales) {
//     totalMonthlySales += sale.total_amount;
//     monthlySalesSummary.sales.push(sale); // Add the sale to the sales array

//     if (monthlySales.length === 0) {
//       return reply
//         .code(404)
//         .send({
//           message: "No sales found for this customer in the given month",
//         });
//     }
//     monthlySalesSummary.totalMonthlySales = totalMonthlySales.toFixed(2); // Round to 2 decimal places
//     monthlySalesSummary.numberOfSales = monthlySales.length; // Set the number of sales
  
// }


//   reply.send(monthlySalesSummary);
// };


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
  
  // Get all sales in a specific year and month
  const getSalesByMonthController = async (req, reply) => {
    const { year, month } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT * FROM sales
         WHERE EXTRACT(YEAR FROM date) = $1
           AND EXTRACT(MONTH FROM date) = $2
           AND deleted_at IS NULL`,
        [year, month]
      );
  
      const totalAmount = result.rows.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  
      reply.send({
        month: Number(month),
        year: Number(year),
        numberOfSales: result.rows.length,
        totalMonthlySales: totalAmount.toFixed(2),
        sales: result.rows
      });
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving monthly sales", error: err });
    }
  };
  
  // (Optional) Get sales for a specific customer in a given month
  const getSalesByCustomerAndMonthController = async (req, reply) => {
    const { customer_id, year, month } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT * FROM sales
         WHERE customer_id = $1
           AND EXTRACT(YEAR FROM date) = $2
           AND EXTRACT(MONTH FROM date) = $3
           AND deleted_at IS NULL`,
        [customer_id, year, month]
      );
  
      if (result.rows.length === 0) {
        return reply.code(404).send({ message: "No sales found for this customer in the given month" });
      }
  
      reply.send(result.rows);
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving sales", error: err });
    }
  };
export {
  getSalesController,
  getSaleController,
  addSaleController,
  updateSaleController,
  softDeleteSaleController,
  getSalesByCustomerAndMonthController,
  getSalesByMonthController,
};
