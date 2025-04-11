

import { getCustomerSalesMonthlySummaryController } from "../controllers/reports-controller.js";
import {
getSalesByMonthOptions,getSalesByCustomerAndMonthOptions
} from "../schemas/reports-schema.js";
function reportsRoutes(fastify, options, done) {
    //get sales by month
    fastify.get("/reports/month/:year/:month", getSalesByMonthOptions);

    fastify.get("/reports/month/:year/:month/:customer_id", getSalesByCustomerAndMonthOptions);

  
    done();
  }
  
  export default reportsRoutes;