import { v4 as uuidv4 } from "uuid";
//which customer bought what in a particular month
//group the sales by customer and month
//and calculate the total amount spent by each customer in that month
//then fetch the customer details and the item details for each sale
//and return the data in a structured format
const sales = [
  {
    id: 1, // integer ID
    uuid: uuidv4(), // new UUID field
    customer_id: 1, // reference to customer UUID
    date: "2025-06-05T14:00:00Z",
    total_amount: 9.27,
  },
  {
    id: 2, // integer ID
    uuid: uuidv4(), // new UUID field
    customer_id: 1, // reference to customer UUID
    date: "2025-04-05T15:30:00Z",
    total_amount: 6.28,
  },
  {
    id: 3, // integer ID
    uuid: uuidv4(), // new UUID field
    customer_id: 2, // reference to customer UUID
    date: "2025-04-05T14:00:00Z",
    total_amount: 9.27,
  },
  {
    id: 4, // integer ID
    uuid: uuidv4(), // new UUID field
    customer_id: 2, // reference to customer UUID
    date: "2025-04-05T15:30:00Z",
    total_amount: 6.28,
  },
];
export default sales;
