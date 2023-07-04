import { query } from "../../db/index.db";

interface OrderLine {
    order_id: number;
    product_id: number;
    quantity: number;
    net_price: number;
}

class OrderService {
    async createOrder(orderLine: OrderLine): Promise<any> {
        const { order_id, product_id, quantity, net_price } = orderLine;

        const results = await query(
            `INSERT INTO orderlines(order_id, product_id, quantity, net_price)
        VALUES ($1, $2, $3, $4)`,
            [order_id, product_id, quantity, net_price]
        );

        if (results.rowCount) {
            return {
                message: "Insert khong thanh cong",
            };
        }

        console.log(results);

        return results;
    }
}

export const orderService = new OrderService();
