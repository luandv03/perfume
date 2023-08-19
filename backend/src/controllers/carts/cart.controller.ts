import { Request, Response } from "express";
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
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}
