//Business logic for sales
import customers from "../testData/customers.js";
import sales from "../sales.js";
import sale_items from "../testData/items.js";
import products from "../testData/products.js";

/**
 * Get customer purchases and spending summary by year and month
 */
export const getCustomerSalesSummaryByMonth = (year, month) => {
  const targetMonth = parseInt(month) - 1;
  const result = [];

  // Filter sales in given month and year
  // extracts the full year from the Date object (e.g. 2025).
  //date.getMonth() gives the zero-based month index (e.g. 3 for April).

  const filteredSales = sales.filter((sale) => {
    const date = new Date(sale.date);
    return (
      date.getFullYear() === parseInt(year) && date.getMonth() === targetMonth
    );
  });

  // Group by customer_id
  const grouped = {};
  console.log(
    "Filtered sales:",
    filteredSales.map((s) => s.id)
  );

  for (const sale of filteredSales) {
    const custId = sale.customer_id;
    const customer = customers.find((c) => c.id === custId);

    if (!grouped[custId]) {
      grouped[custId] = {
        total_spent: 0,
        customer: {
          uuid: customer?.uuid || "Unknown",
          name: customer?.name || "Unknown",
          // Add other customer fields if needed
        },
        sales: [],
      };
    }

    const items = sale_items
      .filter((item) => {
        const match = item.sale_id === sale.id && item.deleted_at === null;
        if (!match) {
          console.log(
            `No match: item.sale_id=${item.sale_id} vs sale.id=${sale.id}`
          );
        }
        return match;
      })
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          product_name: product?.name || "Unknown",
          item_uuid: item.uuid,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
          product_uuid: product?.uuid || "Unknown",
          // Add other item fields if needed
        };
      });

    if (items.length > 0) {
      grouped[custId].total_spent += sale.total_amount;
      grouped[custId].sales.push({
        sale_uuid: sale.uuid,
        date: sale.date,
        total_amount: sale.total_amount,
        items,
      });
    }
  }

  // Convert object to array
  for (const key in grouped) {
    if (grouped[key].sales.length > 0) {
      result.push(grouped[key]);
    }
  }

  console.log(result);
  return result;
};
