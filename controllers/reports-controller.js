import pool from "../plugins/db.js";
import {getCustomerSalesSummaryByMonth} from "../services/sales-service.js";
// Get all sales in a specific year and month
const getSalesByMonthController = async (req, reply) => {
  const { year, month } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM sales
         WHERE EXTRACT(YEAR FROM date) = $1
           AND EXTRACT(MONTH FROM date) = $2
           AND deleted_at IS NULL`,
      [year, month]
    );

    const totalAmount = result.rows.reduce(
      (sum, sale) => sum + parseFloat(sale.total_amount),
      0
    );

    reply.send({
      month: Number(month),
      year: Number(year),
      numberOfSales: result.rows.length,
      totalMonthlySales: totalAmount.toFixed(2),
      sales: result.rows,
    });
  } catch (err) {
    reply
      .code(500)
      .send({ message: "Error retrieving monthly sales", error: err });
  }
};

// (Optional) Get sales for a specific customer in a given month
const getSalesByCustomerAndMonthController = async (req, reply) => {
  const { customer_id: customer_uuid, year, month } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM sales
         WHERE customer_id = $1
           AND EXTRACT(YEAR FROM date) = $2
           AND EXTRACT(MONTH FROM date) = $3
           AND deleted_at IS NULL`,
      [customer_uuid, year, month]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        message: "No sales found for this customer in the given month",
      });
    }

    reply.send(result.rows);
  } catch (err) {
    reply.code(500).send({ message: "Error retrieving sales", error: err });
  }
};

const getCustomerSalesMonthlySummaryController = async (req, reply) => {
  const { year, month } = req.params;
  const summary = await getCustomerSalesSummaryByMonth(year, month);
  console.log(summary);
  try {
    const summary = await getCustomerSalesSummaryByMonth(year, month);
    console.log(summary);
      reply.send(summary);
  } catch (err) {
    reply
      .code(500)
      .send({ message: "Error retrieving customer sales summary", error: err });
  }
};

export {
  getSalesByMonthController,
  getCustomerSalesMonthlySummaryController,
  getSalesByCustomerAndMonthController,
};
