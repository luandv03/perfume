import { BaseService } from "./base.service";

class CartService extends BaseService {
    async getCartList() {
        try {
            const res = await this.httpClientPrivate.get("/cart/customer");

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async addCartItem(cart_id: number, product_id: number, quantity: number) {
        try {
            const res = await this.httpClientPrivate.post(
                "/cart/add_cart_item",
                {
                    cart_id,
                    product_id,
                    quantity,
                }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const cartService = new CartService();
