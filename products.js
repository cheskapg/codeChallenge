import { v4 as uuidv4 } from 'uuid';
const products = [
    {
      id: 1,  // integer ID
      uuid: uuidv4(),  // new UUID field
      name: "Cheddar Crunch",
      description: "Extra crunchy cheddar-flavored chips",
      price: 2.99,
      sku: "CHED-001",
      stock: 50,
    },
    {
      id: 2,  // integer ID
      uuid: uuidv4(),  // new UUID field
      name: "Spicy Jalapeño Dip",
      description: "Hot dip for the bold-hearted",
      price: 3.49,
      sku: "DIP-002",
      stock: 20,
    },
    {
      id: 3,  // integer ID
      uuid: uuidv4(),  // new UUID field
      name: "Sour Cream Salsa",
      description: "Smooth salsa with a sour twist",
      price: 2.79,
      sku: "SALSA-003",
      stock: 35,
    }
]
  export default products;