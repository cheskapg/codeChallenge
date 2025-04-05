//Business logic for sales
import customers from "../data/customers.js";
import sales from "../data/sales.js";
import sale_items from "../data/sale_items.js";
import products from "../data/products.js";

/**
 * Get customer purchases and spending summary by year and month
 */
export const getCustomerSalesSummaryByMonth = (year, month) => {
  const targetMonth = parseInt(month) - 1;
  const result = [];

  // Filter sales in given month and year
  // extracts the full year from the Date object (e.g. 2025).
  // date.getMonth() gives the zero-based month index (e.g. 3 for April).

  const filteredSales = sales.filter((sale) => {
    const date = new Date(sale.date);
    return (
      date.getFullYear() === parseInt(year) && date.getMonth() === targetMonth
    );
  });

  // Group by customer_id
  const grouped = {};

  for (const sale of filteredSales) {
    const custId = sale.customer_id;
    const customer = customers.find((c) => c.id === custId);

    if (!grouped[custId]) {
      grouped[custId] = {
        customer,
        total_spent: 0,
        sales: [],
      };
    }

    const items = sale_items
      .filter((item) => item.sale_id === sale.id && item.deleted_at === null)
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          ...item,
          product_name: product?.name || "Unknown",
          product_description: product?.description || "",
        };
      });

    grouped[custId].total_spent += sale.total_amount;
    grouped[custId].sales.push({
      sale_id: sale.id,
      uuid: sale.uuid,
      date: sale.date,
      total_amount: sale.total_amount,
      items,
    });
  }

  // Convert object to array
  for (const key in grouped) {
    result.push(grouped[key]);
  }

  return result;
};
