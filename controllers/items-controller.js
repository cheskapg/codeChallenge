//controller for sale_items / handler for sale_items
import sale_items from "../items.js";
import { v4 as uuidv4 } from "uuid";
import sales from "../sales.js"; // Assuming the `sales` data is imported.

const getItemsController = (req, reply) => {
  reply.send(sale_items);
};
const getItemController = (req, reply) => {
  const { uuid } = req.params;
  const item = sale_items.find((item) => item.uuid === uuid);
  console.log(uuid);
  if (!item) {
    return reply.code(404).send({ message: "Item not found" });
  }
  delete item.id; // Remove deleted_at field if it exists
  reply.send(item);
};
const addItemController = (req, reply) => {
  // Extract data from request body (assuming it's in the correct format)
  const { sale_uuid, product_uuid, quantity } = req.body;

  // Validation checks
  if (!sale_id || !product_id || !quantity || !unit_price) {
    return reply.code(400).send({ message: "Missing required fields" });
  }
  const sale = sales.find((sale) => sale.uuid === sale_uuid);
  const product = sales.find((prod) => prod.uuid === product_uuid);

  // Calculate subtotal with toFixed to round of values
  const subtotal = (quantity * product.price).toFixed(2);

  // Create a new item object
  const newItem = {
    id: sale_items.length + 1, // increment the id
    uuid: "item-" + -uuidv4(), // generate a unique UUID
    sale_id: sale.id, // referencing sale ID
    product_id: product.id, // referencing product ID
    quantity,
    unit_price: product.price, // price from the product object
    subtotal: parseFloat(subtotal), // ensuring it's a number
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Add the new item to the sale_items array
  sale_items.push(newItem);

  // Respond with the newly created item
  reply.code(201).send(newItem);
};
// Update an existing sale item by UUID
const updateItemController = (req, reply) => {
  const { uuid } = req.params; // Use uuid for identification
  const { quantity, unit_price } = req.body;

  // Validation checks
  if (!quantity || !unit_price) {
    return reply.code(400).send({ message: "Missing required fields" });
  }

  // Find the item by UUID
  const item = sale_items.find((item) => item.uuid === uuid);
  if (!item) {
    return reply.code(404).send({ message: "Item not found" });
  }

  // Update the item
  item.quantity = quantity;
  item.unit_price = unit_price;
  item.subtotal = (quantity * unit_price).toFixed(2); // Recalculate the subtotal

  item.updated_at = new Date().toISOString(); // Update the timestamp

  // Respond with the updated item
  reply.send(item);
};
// Soft delete a sale item by UUID (Mark it as deleted without removing)
const softDeleteItemController = (req, reply) => {
  const { uuid } = req.params; // Use uuid for identification

  // Find the item by UUID
  const item = sale_items.find((item) => item.uuid === uuid);
  if (!item) {
    return reply.code(404).send({ message: "Item not found" });
  }

  // Mark the item as deleted by setting the `deleted_at` field
  item.deleted_at = new Date().toISOString(); // Add a timestamp to indicate when it was deleted

  // Respond with the updated item
  reply.send(item);
};

export {
  getItemController,
  getItemsController,
  addItemController,
  updateItemController,
  softDeleteItemController,
};
