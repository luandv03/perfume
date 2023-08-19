import { query } from "../../db/index.db";
import { ResponseType } from "../../types/response.type";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";

interface CartItem {
    cart_id: string;
    product_id: string;
    quantity: number;
}

class CartService {
    async createCart(customer_id: number): Promise<ResponseType<any>> {
        const results = await query(`INSERT INTO carts (DEFAULT, $1)`, [
            customer_id,
        ]);

        if (!results.rowCount) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Create cart failed",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: " Create Cart successfully",
        };
    }

    async addCartItemIntoCart(cartItem: CartItem): Promise<ResponseType<any>> {
        try {
            const { cart_id, product_id, quantity } = cartItem;
            // kiem tra trong cart co product_id nay chua
            const cartItemExist = await query(
                `SELECT product_id FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
                [cart_id, product_id]
            );

            // neu chua ton tai thi insert
            if (!cartItemExist.rows[0].length) {
                const results = await query(
                    `INSERT INTO cart_items VALUES ($1, $2, $3)`,
                    [cart_id, product_id, quantity]
                );
            } else {
                const results = await query(
                    `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3`,
                    [quantity, cart_id, product_id]
                );
            }

            return {
                statusCode: HttpStatusCode.OK,
                message: "Add cart item successfully",
            };
        } catch (error: any) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error,
            };
        }
    }

    // update cart item: API này dùng để update số lượng cart item trực tiếp trong giỏ hàng
    async updateCartItem(cartItem: CartItem): Promise<ResponseType<any>> {
        try {
            const { cart_id, product_id, quantity } = cartItem;

            const results = await query(
                `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3`,
                [quantity, cart_id, product_id]
            );

            return {
                statusCode: HttpStatusCode.OK,
                message: "Add cart item successfully",
            };
        } catch (error: any) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error,
            };
        }
    }

    async removeCartItem({
        cart_id,
        product_id,
    }: {
        cart_id: string;
        product_id: string;
    }): Promise<ResponseType<any>> {
        try {
            const results = await query(
                `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
                [Number(cart_id), Number(product_id)]
            );

            if (!results.rowCount) {
                return {
                    statusCode: HttpStatusCode.NOT_ACCEPTABLE,
                    message: "Delete cart item failed",
                };
            }

            return {
                statusCode: HttpStatusCode.OK,
                message: "Delete cart item success",
            };
        } catch (error: any) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error,
            };
        }
    }
}

export const cartService = new CartService();
