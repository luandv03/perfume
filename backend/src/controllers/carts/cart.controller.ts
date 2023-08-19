import { Request, Response, query } from "express";
import { cartService } from "../../services/carts/cart.service";

export class CartController {
    async addCartItemIntoCart(req: Request, res: Response): Promise<any> {
        try {
            const { cart_id, product_id, quantity } = req.body;

            const data = await cartService.addCartItemIntoCart({
                cart_id,
                product_id,
                quantity,
            });

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }

    async updateCartItem(req: Request, res: Response): Promise<any> {
        try {
            const { cart_id, product_id, quantity } = req.body;

            const data = await cartService.updateCartItem({
                cart_id,
                product_id,
                quantity,
            });

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }

    async removeCartItem(req: Request, res: Response) {
        try {
            const { cart_id, product_id } = req.params;

            const data = await cartService.removeCartItem({
                cart_id,
                product_id,
            });

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }

    async getCartListByCustomerId(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = req.params;

            const data = await cartService.getCartListByCustomerId(
                Number(customer_id)
            );

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }
}
