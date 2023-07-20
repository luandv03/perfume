import { query } from "../../db/index.db";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { ResponseType } from "../../types/response.type";

interface OrderLine {
    order_id?: number;
    product_id: number;
    quantity: number;
    net_price: number;
}

type Order = {
    customer_id: number;
    tax: number;
    delivery_cost: number;
    orderList: OrderLine[];
};

class OrderService {
    async createOrder(order: Order): Promise<any> {
        try {
            const { customer_id, tax, delivery_cost, orderList } = order;

            await query("BEGIN");

            const results_1 = await query(
                `INSERT INTO orders(customer_id, tax, status, delivery_cost, order_date) VALUES($1, $2, 'Đang chờ xác nhận', $3, NOW()::DATE) RETURNING *`,
                [customer_id, tax, delivery_cost]
            );

            const order_id = results_1.rows[0].order_id;

            let query_insert = "";

            for (let i = 0; i < orderList.length; i++) {
                query_insert = query_insert.concat(
                    `(${order_id}, ${orderList[i].product_id}, ${orderList[i].quantity}, ${orderList[i].net_price}),`
                );
            }

            const results_2 = await query(
                `INSERT INTO orderlines(order_id, product_id, quantity, net_price)
            VALUES  ${query_insert.substring(0, query_insert.length - 1)}`
            );

            if (results_2.rowCount < orderList.length) {
                await query("ROLLBACK");

                return {
                    statusCode: HttpStatusCode.NOT_ACCEPTABLE,
                    message:
                        "Tạo đơn hàng không thành công do có sản phẩm vượt quá số lượng trong kho ",
                };
            }

            await query("COMMIT");

            return {
                statusCode: HttpStatusCode.OK,
                message: "Đặt hàng thành công",
            };
        } catch (error) {
            await query(`ROLLBACK`);
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Tạo đơn hàng không thành công",
                error: error,
            };
        }
    }

    async getOrder(offset: string, limit: string): Promise<any> {
        const results = await query(`SELECT * from ORDERS OFFSET $1 LIMIT $2`, [
            Number(offset),
            Number(limit),
        ]);

        return {
            stausCode: HttpStatusCode.OK,
            message: "Success",
            data: results.rows,
        };
    }

    async getOrderByCustomerId(
        customer_id: number
    ): Promise<ResponseType<any>> {
        try {
            const results = await query(
                `with tmp_2 as (
                with tmp as (
                select order_id, tax, delivery_cost, sum(quantity*net_price) tam_tinh , order_date from orders
                join orderlines using(order_id)
                where customer_id = $1
                group by order_id
            )
            select tmp.order_id, tax, delivery_cost, tam_tinh,   sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date
            from tmp
            left join coupon_orders cpo on tmp.order_id = cpo. order_id
            left join coupons cp on cp.coupon_id = cpo.coupon_id
            group by tmp.order_id, tax, delivery_cost, tam_tinh, order_date
        )
        select order_id, tax, delivery_cost, tong_giam_gia, order_date, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost   as tong_hoa_don
        from tmp_2 order by order_id`,
                [customer_id]
            );

            if (!results.rows.length) {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message: "Not orders",
                };
            }

            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Get orders successfull",
                data: results.rows,
            };
        } catch (error) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Have error",
            };
        }
    }
}

export const orderService = new OrderService();
