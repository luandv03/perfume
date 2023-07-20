import { Request, Response } from "express";
import { orderService } from "../../services/orders/order.service";

export class OrderController {
    async createOrder(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id, tax, delivery_cost, orderList } = req.body;

            const data = await orderService.createOrder({
                customer_id,
                tax,
                delivery_cost,
                orderList,
            });
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }

    async getOrderByCustomerId(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = req.params;
            const data = await orderService.getOrderByCustomerId(
                Number(customer_id)
            );
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }

    async getOrder(req: Request, res: Response): Promise<any> {
        try {
            const { offset, limit } = req.query;
            const data = await orderService.getOrder(
                offset as string,
                limit as string
            );
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }
}
