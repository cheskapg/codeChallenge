// Business logic for sales
import pool from "../plugins/db.js"; // Database connection

/**
 * Get customer purchases and spending summary by year and month
 */
export const getCustomerSalesSummaryByMonth = async (year, month) => {
    const targetMonth = parseInt(month) - 1;
    const result = [];

    try {
        // Step 1: Get active customers
        const activeCustomerIdsResult = await pool.query(
            'SELECT id, uuid, name FROM customers WHERE deleted_at IS NULL'
        );
        const activeCustomers = activeCustomerIdsResult.rows;

        // Step 2: Get sales for the given year and month
        const salesResult = await pool.query(`
            SELECT s.uuid AS sale_uuid, s.customer_id, s.date AS sale_date, s.total_amount,
                   si.uuid AS item_uuid, si.quantity, si.unit_price, si.subtotal,
                   p.uuid AS product_uuid, p.name AS product_name
            FROM sales s
            JOIN sale_items si ON s.uuid = si.sale_id
            JOIN products p ON si.product_id = p.id
            WHERE EXTRACT(YEAR FROM s.date::DATE) = $1 AND EXTRACT(MONTH FROM s.date::DATE) = $2
            AND s.customer_id::text = ANY (SELECT id::text FROM customers WHERE deleted_at IS NULL)
        `, [year, month]);

        // Step 3: Group by customer_id and build the response
        const grouped = {};
        for (const sale of salesResult.rows) {
            const custId = sale.customer_id;
            const customer = activeCustomers.find((c) => c.id === custId);

            if (!grouped[custId]) {
                grouped[custId] = {
                    total_spent: 0,
                    customer: {
                        uuid: customer?.uuid || "Unknown",
                        name: customer?.name || "Unknown",
                    },
                    sales: [],
                };
            }

            // Add the sale item to the group
            grouped[custId].total_spent += sale.total_amount;
            grouped[custId].sales.push({
                sale_uuid: sale.sale_uuid,
                date: sale.sale_date,
                total_amount: sale.total_amount,
                items: [{
                    item_uuid: sale.item_uuid,
                    product_name: sale.product_name,
                    quantity: sale.quantity,
                    unit_price: sale.unit_price,
                    subtotal: sale.subtotal,
                    product_uuid: sale.product_uuid,
                }],
            });
        }

        // Convert object to array and return
        for (const key in grouped) {
            if (grouped[key].sales.length > 0) {
                result.push(grouped[key]);
            }
        }

        return result;

    } catch (err) {
        console.error("Error retrieving customer sales summary:", err);
        throw new Error("Error retrieving customer sales summary");
    }
};
