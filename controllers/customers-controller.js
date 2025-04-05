import { v4 as uuidv4 } from 'uuid';


const getCustomersController = (req, reply) => {
  // Filter out soft-deleted customers
  const activeCustomers = customers.filter((customer) => !customer.deleted_at);
  reply.send(activeCustomers);
};

const getCustomerController = (req, reply) => {
  const { uuid } = req.params; // Get UUID from URL params
  const customer = customers.find((customer) => customer.uuid === uuid);

  if (!customer || customer.deleted_at) {
    return reply.code(404).send({ message: "Customer not found or deleted" });
  }

  reply.send(customer);
};

const addCustomerController = (req, reply) => {
  const { name, email, phone, address } = req.body;

  // Validation checks
  if (!name || !email || !phone || !address) {
    return reply.code(400).send({ message: "Missing required fields" });
  }

  // Create a new customer object
  const newCustomer = {
    id: customers.length + 1, // Increment the id
    uuid: "cust-" + uuidv4(), // Generate a new UUID for customer
    name,
    email,
    phone,
    address,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null, // No soft delete initially
  };

  // Add the new customer to the customers array
  customers.push(newCustomer);

  // Respond with the newly created customer
  reply.code(201).send(newCustomer);
};

// Update an existing customer by UUID
const updateCustomerController = (req, reply) => {
  const { uuid } = req.params; // Use uuid for identification
  const { name, email, phone, address } = req.body;

  // Validation checks
  if (!name || !email || !phone || !address) {
    return reply.code(400).send({ message: "Missing required fields" });
  }

  // Find the customer by UUID
  const customer = customers.find((customer) => customer.uuid === uuid);
  if (!customer) {
    return reply.code(404).send({ message: "Customer not found" });
  }

  // Update the customer
  customer.name = name;
  customer.email = email;
  customer.phone = phone;
  customer.address = address;
  customer.updated_at = new Date().toISOString(); // Update the timestamp

  // Respond with the updated customer
  reply.send(customer);
};

// Soft delete a customer by UUID (Mark it as deleted without removing)
const softDeleteCustomerController = (req, reply) => {
  const { uuid } = req.params; // Use uuid for identification

  // Find the customer by UUID
  const customer = customers.find((customer) => customer.uuid === uuid);
  if (!customer) {
    return reply.code(404).send({ message: "Customer not found" });
  }

  // Mark the customer as deleted by setting the `deleted_at` field
  customer.deleted_at = new Date().toISOString(); // Add a timestamp to indicate when it was deleted

  // Respond with the updated customer
  reply.send(customer);
};

export {
  getCustomerController,
  getCustomersController,
  addCustomerController,
  updateCustomerController,
  softDeleteCustomerController,
};
