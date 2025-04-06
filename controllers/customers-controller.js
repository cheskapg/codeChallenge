import { v4 as uuidv4 } from "uuid";
// import customers from "../testData/customers.js"; // Assuming the `customers` data is imported
// import { getCustomerSalesSummaryByMonth } from "../services/sales-service.js";
import pool from "../plugins/db.js"; // 

//test data
// const getCustomersController = (req, reply) => {
//   // Filter out soft-deleted customers
//   const activeCustomers = customers.filter((customer) => !customer.deleted_at);
//   reply.send(activeCustomers);
// };

// const getCustomerController = (req, reply) => {
//   const { uuid } = req.params; // Get UUID from URL params
//   const customer = customers.find((customer) => customer.uuid === uuid);

//   if (!customer || customer.deleted_at) {
//     return reply.code(404).send({ message: "Customer not found or deleted" });
//   }

//   reply.send(customer);
// };

// const addCustomerController = (req, reply) => {
//   const { name, email, phone, address } = req.body;

//   // Validation checks
//   if (!name || !email || !phone || !address) {
//     return reply.code(400).send({ message: "Missing required fields" });
//   }

//   // Create a new customer object
//   const newCustomer = {
//     id: customers.length + 1, // Increment the id
//     uuid: "cust-" + uuidv4(), // Generate a new UUID for customer
//     name,
//     email,
//     phone,
//     address,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     deleted_at: null, // No soft delete initially
//   };

//   // Add the new customer to the customers array
//   customers.push(newCustomer);

//   // Respond with the newly created customer
//   reply.code(201).send(newCustomer);
// };

// // Update an existing customer by UUID
// const updateCustomerController = (req, reply) => {
//   const { uuid } = req.params; // Use uuid for identification
//   const { name, email, phone, address } = req.body;

//   // Validation checks
//   //   if (!name || !email || !phone || !address) {
//   //     return reply.code(400).send({ message: "Missing required fields" });
//   //   }

//   // Find the customer by UUID
//   const customer = customers.find((customer) => customer.uuid === uuid);
//   if (!customer) {
//     return reply.code(404).send({ message: "Customer not found" });
//   }

//   // Update the customer

//   // Only update fields if they're provided
//   if (name !== undefined) customer.name = name;
//   if (email !== undefined) customer.email = email;
//   if (phone !== undefined) customer.phone = phone;
//   if (address !== undefined) customer.address = address;

//   // Respond with the updated customer
//   reply.send(customer);
// };

// // Soft delete a customer by UUID (Mark it as deleted without removing)
// const softDeleteCustomerController = (req, reply) => {
//   const { uuid } = req.params; // Use uuid for identification

//   // Find the customer by UUID
//   const customer = customers.find((customer) => customer.uuid === uuid);
//   if (!customer) {
//     return reply.code(404).send({ message: "Customer not found" });
//   }

//   // Mark the customer as deleted by setting the `deleted_at` field
//   customer.deleted_at = new Date().toISOString(); // Add a timestamp to indicate when it was deleted

//   // Respond with the updated customer
//   reply.send(customer);
// };

// const getCustomerSalesMonthlySummaryController = (req, reply) => {
//   const { year, month } = req.params;

//   // Get active (non-deleted) customers' UUIDs for filtering
//   const activeCustomerIds = customers
//     .filter((customer) => !customer.deleted_at)
//     .map((customer) => customer.id);

//   // Get full summary
//   const customerSalesByMonth = getCustomerSalesSummaryByMonth(year, month);

//   // Filter the results to include only active customers
//   const filteredSummary = customerSalesByMonth.filter((entry) => {
//     return activeCustomerIds.includes(
//       customers.find((c) => c.uuid === entry.customer.uuid)?.id
//     );
//   });

//   reply.send(filteredSummary);
// };
// ----------------------------------------

// Assuming you have a database connection pool set up
// Get all active customers
const getCustomersController = async (req, reply) => {
    try {
      const result = await pool.query('SELECT * FROM customers WHERE deleted_at IS NULL');
      reply.send(result.rows);
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving customers", error: err });
    }
  };

  
// Get a single customer by UUID
const getCustomerController = async (req, reply) => {
    const { uuid } = req.params;
    try {
      const result = await pool.query('SELECT * FROM customers WHERE uuid = $1 AND deleted_at IS NULL', [uuid]);
  
      if (result.rows.length === 0) {
        return reply.code(404).send({ message: "Customer not found or deleted" });
      }
  
      reply.send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving customer", error: err });
    }
  };
  
  // Add a new customer
  const addCustomerController = async (req, reply) => {
    const { name, email, phone, address } = req.body;
  
    if (!name || !email || !phone || !address) {
      return reply.code(400).send({ message: "Missing required fields" });
    }
  
    const uuid = "cust-" + uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    try {
      const result = await pool.query(
        'INSERT INTO customers (uuid, name, email, phone, address, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [uuid, name, email, phone, address, createdAt,updatedAt]
      );
  
      reply.code(201).send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ message: "Error adding customer", error: err });
    }
  };
  // Update an existing customer by UUID
  const updateCustomerController = async (req, reply) => {
    const { uuid } = req.params;
    const { name, email, phone, address } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE customers
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             address = COALESCE($4, address),
             updated_at = NOW()
         WHERE uuid = $5
         RETURNING *`,
        [name, email, phone, address, uuid]
      );
  
      if (result.rows.length === 0) {
        return reply.code(404).send({ message: "Customer not found" });
      }
  
      reply.send(result.rows[0]);
    } catch (err) {
      reply.code(500).send({ message: "Error updating customer", error: err });
    }
  };
  
  
  // Soft delete a customer by UUID
  const softDeleteCustomerController = async (req, reply) => {
    const { uuid } = req.params;
  
    try {
      // Find customer in database
      const result = await pool.query('SELECT * FROM customers WHERE uuid = $1', [uuid]);
      if (result.rows.length === 0) {
        return reply.code(404).send({ message: "Customer not found" });
      }
  
      // Mark as deleted by setting `deleted_at`
      const deletedAt = new Date().toISOString();
      await pool.query('UPDATE customers SET deleted_at = $1 WHERE uuid = $2', [deletedAt, uuid]);
  
      reply.send({ message: "Customer soft-deleted successfully" });
    } catch (err) {
      reply.code(500).send({ message: "Error deleting customer", error: err });
    }
  };
  
  // Get customer sales monthly summary
  const getCustomerSalesMonthlySummaryController = async (req, reply) => {
    const { year, month } = req.params;
  
    try {
      // Get the active customers' UUIDs
      const activeCustomerIdsResult = await pool.query('SELECT id FROM customers WHERE deleted_at IS NULL');
      const activeCustomerIds = activeCustomerIdsResult.rows.map((customer) => customer.id);
  
      // Get sales for the given month
      const salesResult = await pool.query(`
        SELECT s.uuid, s.date, s.total_amount, si.quantity, si.unit_price
        FROM sales s
        JOIN sale_items si ON s.uuid = si.sale_id
        WHERE EXTRACT(YEAR FROM s.date) = $1 AND EXTRACT(MONTH FROM s.date) = $2
      `, [year, month]);
  
      // Filter sales to include only active customers
      const filteredSales = salesResult.rows.filter((sale) =>
        activeCustomerIds.includes(sale.customer_id)
      );
  
      reply.send(filteredSales);
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving customer sales summary", error: err });
    }
  };
  
export {
  getCustomerController,
  getCustomersController,
  addCustomerController,
  updateCustomerController,
  softDeleteCustomerController,
  getCustomerSalesMonthlySummaryController,
};


