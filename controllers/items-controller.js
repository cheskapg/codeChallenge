//controller for sale_items / handler for sale_items 
import sale_items from "../items.js";

const getItemsController = (req, reply) => {
  reply.send(sale_items);
};
const getItemController = (req, reply) => {
    const { id } = req.params;
    const item = sale_items.find((item) => item.id === parseInt(id));
    console.log(id);
    if (!item) {
      return reply.code(404).send({ message: "Item not found" });
    }

    reply.send(item);
  };

  const addItem = (req, reply) => {
    const { id } = req.params;
    const item = sale_items.find((item) => item.id === parseInt(id));
    console.log(id);
    if (!item) {
      return reply.code(404).send({ message: "Item not found" });
    }

    reply.send(item);
  };
  
  export { getItemController, getItemsController, addItem };
