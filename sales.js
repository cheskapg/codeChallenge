import { v4 as uuidv4 } from 'uuid';



const sales = [
    {
      id: 1,  // integer ID
      uuid: uuidv4(),  // new UUID field
      customer_id: customers[0].uuid,  // reference to customer UUID
      date: "2025-04-05T14:00:00Z",
      total_amount: 9.27,
    },
    {
      id: 2,  // integer ID
      uuid: uuidv4(),  // new UUID field
      customer_id: customers[1].uuid,  // reference to customer UUID
      date: "2025-04-05T15:30:00Z",
      total_amount: 6.28,
    },
  ];
export default sales;