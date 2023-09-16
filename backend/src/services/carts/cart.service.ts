import { query } from "../../db/index.db";
import { ResponseType } from "../../types/response.type";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";

interface CartItem {
    product_id: string;
    quantity: number;
}

class CartService {
    async createCart(customer_id: number): Promise<ResponseType<any>> {
        const results = await query(
            `INSERT INTO carts (DEFAULT, $1) RETURNING *`,
            [customer_id]
        );

        if (!results.rowCount) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Create cart failed",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: " Create Cart successfully",
            data: results.rows[0],
        };
    }

    async addCartItemIntoCart(
        customer_id: number,
        cartItem: CartItem
    ): Promise<ResponseType<any>> {
        try {
            const { product_id, quantity } = cartItem;
            const cartResuslt = await query(
                `SELECT cart_id from carts WHERE customer_id = $1`,
                [customer_id]
            );

            const cart_id = cartResuslt.rows[0].cart_id;

            // kiem tra trong cart co product_id nay chua
            const cartItemExist = await query(
                `SELECT product_id FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
                [cart_id, product_id]
            );

            let results;
            // neu chua ton tai thi insert
            if (!cartItemExist.rows.length) {
                results = await query(
                    `INSERT INTO cart_items VALUES ($1, $2, $3) RETURNING *`,
                    [cart_id, product_id, quantity]
                );
            } else {
                results = await query(
                    `UPDATE cart_items SET quantity = quantity + $1 
                    WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
                    [quantity, cart_id, product_id]
                );
            }

            return {
                statusCode: HttpStatusCode.OK,
                message: "Add cart item successfully",
                data: results.rows[0],
            };
        } catch (error: any) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error,
            };
        }
    }

    // update cart item: API này dùng để update số lượng cart item trực tiếp trong giỏ hàng
    async updateCartItem(
        customer_id: number,
        cartItem: CartItem
    ): Promise<ResponseType<any>> {
        try {
            const { product_id, quantity } = cartItem;

            const cartResuslt = await query(
                `SELECT cart_id from carts WHERE customer_id = $1`,
                [customer_id]
            );

            const cart_id = cartResuslt.rows[0].cart_id;

            const cartItemExist = await query(
                `SELECT product_id FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
                [cart_id, product_id]
            );

            // neu chua ton tai thi next
            if (!cartItemExist.rows.length) {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message: "Cart item not exist",
                };
            }

            if (quantity < 0) {
                return {
                    statusCode: HttpStatusCode.BAD_REQUEST,
                    message: "Quantity can't less than 0",
                };
            }

            const results = await query(
                `UPDATE cart_items SET quantity = $1 
                WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
                [quantity, cart_id, product_id]
            );

            return {
                statusCode: HttpStatusCode.OK,
                message: "Update cart item successfully",
                data: results.rows[0],
            };
        } catch (error: any) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error,
            };
        }
    }

    async removeCartItem(
        customer_id: number,
        product_id: number
    ): Promise<ResponseType<any>> {
        try {
            const cartResuslt = await query(
                `SELECT cart_id FROM carts WHERE customer_id = $1`,
                [customer_id]
            );

            const cart_id = cartResuslt.rows[0].cart_id;

            const results = await query(
                `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
                [cart_id, product_id]
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
                data: results.rows[0],
            };
        } catch (error: any) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: error,
            };
        }
    }

    // get cart list by customer_id
    async getCartListByCustomerId(customer_id: number) {
        const results = await query(
            `SELECT cart_id FROM carts WHERE customer_id = $1`,
            [customer_id]
        );

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "User not have cart list",
            };
        }

        const cartList = await query(
            `SELECT product_id, title, brand, volume, discount, price, ci.quantity 
            FROM cart_items ci
            JOIN products p USING(product_id)
            WHERE cart_id = $1`,
            [results.rows[0].cart_id]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get cart list successfull!",
            data: {
                cart_id: results.rows[0].cart_id,
                cart_list: cartList.rows,
            },
        };
    }
}

export const cartService = new CartService();
