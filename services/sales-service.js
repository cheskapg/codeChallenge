    // Business logic for sales
    import pool from "../plugins/db.js"; // Database connection

    /**
     * Get customer purchases and spending summary by year and month
     */
    const getCustomerSalesSummaryByMonth = async (year, month) => {
        const result = [];
    
        try {
        // Step 1: Get active customers
        const activeCustomerIdsResult = await pool.query(
            "SELECT id, uuid, name FROM customers WHERE deleted_at IS NULL"
        );
        const activeCustomers = activeCustomerIdsResult.rows;
        const customerIds = activeCustomers.map(c => c.id);
    console.log(customerIds, "customerIds");
        // Step 2: Get sales data
        const salesResult = await pool.query(
            `
            SELECT 
                s.uuid AS sale_uuid, 
                s.customer_id, 
                s.date AS sale_date, 
                s.total_amount,
                si.uuid AS item_uuid, 
                si.quantity, 
                si.unit_price, 
                si.subtotal,
                p.uuid AS product_uuid, 
                p.name AS product_name
            FROM sales s
            JOIN sale_items si ON s.id = si.sale_id
            JOIN products p ON si.product_id = p.id
            WHERE 
                EXTRACT(YEAR FROM s.date::DATE) = $1
                AND EXTRACT(MONTH FROM s.date::DATE) = $2
                AND s.customer_id = ANY ($3)
            `,
            [year, month, customerIds]
        );
    
        // Step 3: Group by customer_id and sale_uuid
        const grouped = {};
    
        for (const row of salesResult.rows) {
            const customer = activeCustomers.find(c => c.id === row.customer_id);
            const custId = row.customer_id;
    
            if (!grouped[custId]) {
            grouped[custId] = {
                total_spent: 0,
                customer: {
                uuid: customer?.uuid || "Unknown",
                name: customer?.name || "Unknown",
                },
                sales: {},
            };
            }
    
            // If sale doesn't exist yet under this customer, add it
            if (!grouped[custId].sales[row.sale_uuid]) {
            grouped[custId].sales[row.sale_uuid] = {
                sale_uuid: row.sale_uuid,
                date: row.sale_date,
                total_amount: parseFloat(row.total_amount),
                items: [],
            };
    
            // Add to total spent once per sale
            grouped[custId].total_spent += parseFloat(row.total_amount);
            }
    
            // Add item to the sale's items list
            grouped[custId].sales[row.sale_uuid].items.push({
            item_uuid: row.item_uuid,
            product_name: row.product_name,
            quantity: row.quantity,
            unit_price: parseFloat(row.unit_price),
            subtotal:parseFloat(row.subtotal),
            product_uuid: row.product_uuid,
            });
        }
    
        // Step 4: Format final result
        for (const custId in grouped) {
            const salesArray = Object.values(grouped[custId].sales);
            result.push({
            total_customer_monthly_sale: parseFloat(grouped[custId].total_spent.toFixed(2)),
            customer: grouped[custId].customer,
            sales: salesArray,
            });
        }
    
        return result;
        } catch (err) {
        console.error("Error retrieving customer sales summary:", err);
        throw new Error("Error retrieving customer sales summary");
        }
    };
    

    export { getCustomerSalesSummaryByMonth };
