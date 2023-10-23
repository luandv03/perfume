import { query } from "../../db/index.db";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { ResponseType } from "../../types/response.type";
import { handleTimeExpired } from "../../utils/handle_time_expired";

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
    payment_type: string;
    coupon_id?: string;
};

class OrderService {
    async createOrder(order: Order): Promise<any> {
        try {
            const {
                customer_id,
                tax,
                delivery_cost,
                coupon_id,
                orderList,
                payment_type,
            } = order;

            await query("BEGIN");

            const results_1 = await query(
                `INSERT INTO orders(customer_id, tax, status, delivery_cost, order_date, payment_type, payment_status) 
                VALUES($1, $2, 'ordered', $3, NOW()::DATE, $4, '0') RETURNING *`,
                [customer_id, tax, delivery_cost, payment_type]
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

            // use coupon :if have then use else have no (empty) then next
            if (coupon_id) {
                const coupon_results = await query(
                    `INSERT INTO coupon_orders VALUES ($1, $2)`,
                    [Number(coupon_id), Number(order_id)]
                );

                if (!coupon_results.rowCount) {
                    await query(`ROLLBACK`);
                    return {
                        statusCode: HttpStatusCode.ACCEPTED,
                        message:
                            "Đặt hàng không thành công. Phiếu giảm giá đã hết hạn hoặc không hữu dụng!",
                    };
                }
            }

            await query("COMMIT");

            return {
                statusCode: HttpStatusCode.OK,
                message: "Đặt hàng thành công",
                data: results_1.rows[0],
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

    // status
    // all: all of types
    // ordered: ordered but no accepted
    // canceled
    // accepted: processing, shipping
    // done!
    async getOrder(page: number, limit: number, status: string): Promise<any> {
        const offset = (page - 1) * limit;

        let results;
        if (status === "all") {
            results = await query(
                `with tmp_2 as (
                    with tmp as (
                    select order_id, customer_id, cast(count(orderline_id) as int) n_item , tax, 
                    delivery_cost, sum(quantity*net_price) tam_tinh , order_date, payment_type 
                    from orders
                    join orderlines using(order_id)
                    group by order_id
                )
                select tmp.order_id, customer_id, n_item, tax, delivery_cost,
                tam_tinh, sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date, payment_type
                from tmp
                left join coupon_orders cpo on tmp.order_id = cpo. order_id
                left join coupons cp on cp.coupon_id = cpo.coupon_id
                group by tmp.order_id, customer_id, n_item, tax, delivery_cost, tam_tinh, order_date, payment_type
                )
                select order_id, customer_id, n_item, tax, delivery_cost, cast(tong_giam_gia as int), 
                order_date, payment_type, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don
                from tmp_2 ORDER BY order_id
                OFFSET $1 LIMIT $2 `,
                [offset, limit]
            );
        } else {
            results = await query(
                `with tmp_2 as (
                    with tmp as (
                    select order_id, customer_id, cast(count(orderline_id) as int) n_item , tax , delivery_cost, sum(quantity*net_price) tam_tinh , order_date, payment_type 
                    from orders
                    join orderlines using(order_id)
                    WHERE status = $1 
                    group by order_id
                )
                select tmp.order_id, customer_id, n_item, tax, delivery_cost, tam_tinh, sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date, payment_type
                from tmp
                left join coupon_orders cpo on tmp.order_id = cpo. order_id
                left join coupons cp on cp.coupon_id = cpo.coupon_id
                group by tmp.order_id, customer_id, n_item, tax, delivery_cost, tam_tinh, order_date, payment_type
                )
                select order_id, customer_id, n_item, tax, delivery_cost, cast(tong_giam_gia as int), order_date, payment_type, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost   as tong_hoa_don
                from tmp_2 ORDER BY order_id
                OFFSET $2 LIMIT $3 `,
                [status, offset, limit]
            );
        }

        const totalOrders = await this.countOrder(status);

        return {
            stausCode: HttpStatusCode.OK,
            message: "Get order Success",
            data: {
                orders: results?.rows,
                page: page,
                total: limit,
                totalPage: Math.ceil(totalOrders / limit),
                totalOrders: Number(totalOrders),
            },
        };
    }

    async getOrderById(order_id: number): Promise<ResponseType<any>> {
        const orderQuery = query(
            `select o.*, c.email, c.fullname, c.address  from orders o 
        join customers c using(customer_id)
        where order_id = $1`,
            [order_id]
        );

        const orderlinesQuery = query(
            `select ol.orderline_id, ol.product_id, ol.quantity, cast(ol.net_price as int), p.title
        from orderlines ol
        join products p using(product_id)
        where order_id = $1`,
            [order_id]
        );

        const couponQuery = query(
            `select coupon_id, coupon_code, cast(coupon_discount as int) from coupons 
        where coupon_id in (select coupon_id from coupon_orders where order_id = $1)`,
            [order_id]
        );

        const [orderResults, orderlinesResults, couponResults] =
            await Promise.all([orderQuery, orderlinesQuery, couponQuery]);

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get order detail successfull",
            data: {
                order: orderResults.rows[0],
                orderlines: orderlinesResults.rows,
                coupons: couponResults.rows,
            },
        };
    }

    async getOrderByCustomerId(
        customer_id: number,
        page: number,
        limit: number
    ): Promise<ResponseType<any>> {
        try {
            const offset = (page - 1) * limit;
            const results = await query(
                `with tmp_2 as (
                with tmp as (
                select order_id,cast(count(orderline_id) as int) n_item, status, tax, delivery_cost, sum(quantity*net_price) tam_tinh , order_date, payment_type from orders
                join orderlines using(order_id)
                where customer_id = $1
                group by order_id
            )
            select tmp.order_id, n_item, status, tax, delivery_cost, tam_tinh,   sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date, payment_type
            from tmp
            left join coupon_orders cpo on tmp.order_id = cpo. order_id
            left join coupons cp on cp.coupon_id = cpo.coupon_id
            group by tmp.order_id, n_item, status, tax, delivery_cost, tam_tinh, order_date, payment_type
        )
        select order_id, n_item, status, tax, delivery_cost, tong_giam_gia, order_date, payment_type, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don
        from tmp_2 order by order_id OFFSET $2 LIMIT $3`,
                [customer_id, offset, limit]
            );

            const n_orders = await this.countOrderByCustomerId(customer_id);

            if (!results.rows.length) {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message: "Not orders",
                    data: {
                        orders: results.rows,
                        page: page,
                        limit: limit,
                        totalPage: Math.ceil(n_orders / limit),
                        totalOrder: n_orders,
                    },
                };
            }

            return {
                statusCode: HttpStatusCode.OK,
                message: "Get orders successfull",
                data: {
                    orders: results.rows,
                    page: page,
                    limit: limit,
                    totalPage: Math.ceil(n_orders / limit),
                    totalOrder: n_orders,
                },
            };
        } catch (error) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Have error",
            };
        }
    }

    //cancel order with role customer
    async cancelOrder(order_id: string): Promise<ResponseType<any>> {
        const results = await query(
            `SELECT order_id, status FROM orders WHERE order_id = $1`,
            [Number(order_id)]
        );

        if (!results.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Order not exist!",
            };
        }

        if (results.rows[0].status !== "ordered") {
            return {
                statusCode: HttpStatusCode.NOT_ACCEPTABLE,
                message:
                    "Không thể hủy đơn hàng. Hãy liên hệ với chúng tôi để được giúp đỡ!",
            };
        }

        const resData = await query(
            `UPDATE orders SET status = 'canceled' WHERE order_id = $1 RETURNING *`,
            [Number(order_id)]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Cancel order successfully!",
            data: resData.rows[0],
        };
    }

    // acceptOrder
    async acceptOrderByOrderId(order_id: string): Promise<ResponseType<any>> {
        const results = await query(
            `UPDATE orders SET status = 'accepted' WHERE order_id = $1`,
            [Number(order_id)]
        );

        if (!results.rowCount) {
            return {
                statusCode: HttpStatusCode.ACCEPTED,
                message: "Update status order failure!",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Accepted order!",
        };
    }

    //done order
    async doneOrderByOrderId(order_id: string): Promise<ResponseType<any>> {
        const results = await query(
            `UPDATE orders SET status = 'done' WHERE order_id = $1`,
            [Number(order_id)]
        );

        if (!results.rowCount) {
            return {
                statusCode: HttpStatusCode.ACCEPTED,
                message: "Update status order failure!",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Done order!",
        };
    }

    async getValidCouponByCode(coupon_code: string): Promise<any> {
        const results = await query(
            `SELECT * FROM coupons WHERE coupon_code = $1`,
            [coupon_code]
        );

        if (!results.rows[0]) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Mã giảm giá không tồn tại",
            };
        }

        // check quantity
        if (results.rows[0].quantity <= 0) {
            return {
                statusCode: HttpStatusCode.ACCEPTED,
                message: "Mã giảm giá này đã hết",
            };
        }

        // check expire
        const startTimeCoupon = handleTimeExpired(results.rows[0].start_time);
        const endTimeCoupon = handleTimeExpired(results.rows[0].end_time);
        const currentTime = handleTimeExpired(new Date());

        if (startTimeCoupon > currentTime || endTimeCoupon < currentTime) {
            return {
                statusCode: HttpStatusCode.NOT_ACCEPTABLE,
                message: "Mã giảm giá đã hết hạn",
            };
        }

        // còn lại => OK
        return {
            statusCode: HttpStatusCode.OK,
            message: "COUPON OK",
            data: results.rows[0],
        };
    }

    async createCoupon({
        coupon_name,
        coupon_code,
        coupon_discount,
        condition,
        quantity,
        start_time,
        end_time,
    }: any): Promise<ResponseType<any>> {
        const results = await query(
            `SELECT * FROM coupons WHERE coupon_code = $1`,
            [coupon_code]
        );

        if (!!results.rows[0]) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Mã giảm giá đã tồn tại",
            };
        }

        const resCoupon = await query(
            `INSERT INTO coupons(coupon_name, coupon_code, coupon_discount, condition, quantity, start_time, end_time)  
             VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                coupon_name,
                coupon_code,
                coupon_discount,
                condition,
                quantity,
                start_time,
                end_time,
            ]
        );

        if (!resCoupon.rowCount) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Tạo mã giảm giá thất bại",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "COUPON OK",
            data: resCoupon.rows[0],
        };
    }

    // status
    // all: all of types
    // ordered: ordered but no accepted
    // canceled
    // accepted: processing, shipping
    // done!
    async countOrder(status: string): Promise<number> {
        let results;
        if (status === "all") {
            results = await query(
                `SELECT count(order_id) number_of_orders FROM orders`
            );
        } else {
            results = await query(
                `SELECT count(order_id) number_of_orders FROM orders 
                 WHERE status = $1`,
                [status]
            );
        }

        return results?.rows[0].number_of_orders;
    }

    async countOrderByCustomerId(customer_id: number): Promise<number> {
        const results = await query(
            `SELECT count(order_id) n_orders FROM orders WHERE customer_id = $1`,
            [customer_id]
        );

        return Number(results.rows[0].n_orders);
    }

    async updatePaymentStatus(
        order_id: number,
        payment_status: string
    ): Promise<ResponseType<any>> {
        await query(
            `UPDATE orders SET payment_status = $1 WHERE order_id = $2`,
            [payment_status, order_id]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "OK do nha hihihi",
        };
    }
}

export const orderService = new OrderService();
