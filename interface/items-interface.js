// schema validation

import {
  getItemsController,
  getItemController,
} from "../controllers/items-controller.js";

//Interface for item object
const Item = {
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
  },
};
// -----------------------------

//Options for get all items
const getItemsOptions = {
  schema: {
    response: {
      200: {
        type: "array",
        //returns an array of objects
        items: Item,
      },
    },
  },
  handler: getItemsController,
};

// Options for get item by id
const getItemOptions = {
  schema: {
    //to add a params object to the schema, uncomment the params object below
    // params: {
    //   type: 'object',
    //   properties: {
    //     id: { type: 'integer' },
    //   },
    // },
    response: {
      200: Item,
      // returns a singular object
    },
  },
  handler: getItemController,
};

export { getItemsOptions, getItemOptions };
// export { getItemsOptions, getItemOptions, Item }; // export the options and item object
