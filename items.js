import { v4 as uuidv4 } from "uuid";
// Initial sale_items array with a `deleted_at` field to support soft delete
const sale_items = [
  {
    id: 1,  // integer ID
    uuid: "item-" + uuidv4(),  // new UUID field
    sale_id: 1,  // referencing sale ID
    product_id: 1,  // referencing "Cheddar Crunch"
    quantity: 3,
    unit_price: 2.99,
    subtotal: 8.97,
    created_at: "2025-04-05T14:30:00Z",
    updated_at: "2025-04-05T14:30:00Z",
    deleted_at: null, // No soft delete initially
  },
  {
    id: 2,  // integer ID
    uuid: "item-" + uuidv4(),  // new UUID field
    sale_id: 2,
    product_id: 3,  // referencing "Sour Cream Salsa"
    quantity: 2,
    unit_price: 1.99,
    subtotal: 3.98,
    created_at: "2025-04-05T14:30:00Z",
    updated_at: "2025-04-05T14:30:00Z",
    deleted_at: null, // No soft delete initially
  },
  {
    id: 3,  // integer ID
    uuid: "item-" + uuidv4(),  // new UUID field
    sale_id: 1,
    product_id: 2,  // referencing "Spicy Jalapeño Dip"
    quantity: 1,
    unit_price: 3.99,
    subtotal: 3.99,
    created_at: "2025-04-05T14:30:00Z",
    updated_at: "2025-04-05T14:30:00Z",
    deleted_at: null, // No soft delete initially
  },
];

export default sale_items;
