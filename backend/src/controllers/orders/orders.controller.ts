import { Request, Response } from "express";
import { orderService } from "../../services/orders/order.service";

export class OrderController {
    async createOrder(req: Request, res: Response): Promise<any> {
        try {
            const {
                customer_id,
                tax,
                delivery_cost,
                coupon_id,
                payment_type,
                orderList,
            } = req.body;

            const data = await orderService.createOrder({
                customer_id,
                tax,
                delivery_cost,
                orderList,
                coupon_id, // have or no
                payment_type,
            });
            return res.status(data.statusCode).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }

    async getOrderByOwnerId(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = res.locals.data;
            const { page, limit } = req.query;
            const data = await orderService.getOrderByCustomerId(
                Number(customer_id),
                Number(page),
                Number(limit)
            );
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }

    async getOrderByCustomerId(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = req.params;
            const { page, limit } = req.query;
            const data = await orderService.getOrderByCustomerId(
                Number(customer_id),
                Number(page),
                Number(limit)
            );
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }

    async getOrder(req: Request, res: Response): Promise<any> {
        try {
            const { page, limit, status } = req.query;
            const data = await orderService.getOrder(
                Number(page),
                Number(limit),
                status as string
            );
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }

    async getOrderById(req: Request, res: Response): Promise<any> {
        try {
            const { order_id } = req.params;
            const data = await orderService.getOrderById(Number(order_id));
            return res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }

    async getValidCouponByCode(req: Request, res: Response): Promise<any> {
        try {
            const coupon_code = req.params.coupon_code;

            const data = await orderService.getValidCouponByCode(coupon_code);

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async createCoupon(req: Request, res: Response): Promise<any> {
        try {
            const {
                coupon_name,
                coupon_code,
                coupon_discount,
                condition,
                quantity,
                start_time,
                end_time,
            } = req.body;

            const data = await orderService.createCoupon({
                coupon_name,
                coupon_code,
                coupon_discount,
                condition,
                quantity,
                start_time,
                end_time,
            });

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async acceptOrderByOrderId(req: Request, res: Response): Promise<any> {
        try {
            const order_id = req.params.order_id;
            const data = await orderService.acceptOrderByOrderId(order_id);

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async cancelOrder(req: Request, res: Response): Promise<any> {
        try {
            const order_id = req.params.order_id;
            const data = await orderService.cancelOrder(order_id);

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}
