//controller for items / handleer for items 
import items from "../items.js";

const getItemsController = (req, reply) => {
  reply.send(items);
};
const getItemController = (req, reply) => {
    const { id } = req.params;
    const item = items.find((item) => item.id === parseInt(id));
    console.log(id);
    if (!item) {
      return reply.code(404).send({ message: "Item not found" });
    }

    reply.send(item);
  };
  
  export { getItemController, getItemsController,  };
