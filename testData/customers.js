import { v4 as uuidv4 } from 'uuid';

// Customers with UUID as a new field
const customers = [
  {
    id: 1,  // integer ID
    uuid: "cust-"+uuidv4(), 
    name: "Tony Taco",
    email: "tony.taco@example.com",
    phone: "123-456-7890",
    address: "123 Nacho Lane, Queso City",
  },
  {
    id: 2,  // integer ID
    uuid: "cust-"+uuidv4(),  // new UUID field
    name: "Lisa Lime",
    email: "lisa.lime@example.com",
    phone: "987-654-3210",
    address: "456 Guac Ave, Dip Town",
  },
];

export default customers;