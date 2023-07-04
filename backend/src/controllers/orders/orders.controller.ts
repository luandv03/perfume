import { Request, Response } from "express";
import { orderService } from "../../services/orders/order.service";

export class OrderController {
    async createOrder(req: Request, res: Response): Promise<any> {
        try {
            const { order_id, product_id, quantity, net_price } = req.body;
            const data = await orderService.createOrder({
                order_id,
                product_id,
                quantity,
                net_price,
            });

            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }
}
