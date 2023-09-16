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

    async addCartItem(product_id: number, quantity: number) {
        try {
            const res = await this.httpClientPrivate.post(
                "/cart/add_cart_item",
                {
                    product_id,
                    quantity,
                }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async updateCartItem(product_id: number, quantity: number) {
        try {
            const res = await this.httpClientPrivate.patch(
                `/cart/update_cart_item`,
                {
                    product_id,
                    quantity,
                }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async deleteCartItem(product_id: number) {
        try {
            const res = await this.httpClientPrivate.delete(
                `/cart/product/${product_id}/delete`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const cartService = new CartService();
