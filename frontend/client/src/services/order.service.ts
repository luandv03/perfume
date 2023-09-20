import { BaseService } from "./base.service";

type OrderItem = {
    product_id: number;
    quantity: number;
    net_price: number;
};

type OrderCreate = {
    customer_id: number;
    delivery_cost: number;
    tax: number;
    orderList: OrderItem[];
};

class OrderService extends BaseService {
    async createOrder(orderCreate: OrderCreate) {
        try {
            const res = await this.httpClientPrivate.post(
                `/order/create`,
                orderCreate
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getOrderByCustomerId(page: number, limit: number) {
        try {
            const res = await this.httpClientPrivate.get(
                `/order/view/customer?page=${page}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getOrderById(order_id: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/order/detail/${order_id}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async cancelOrder(order_id: number) {
        try {
            const res = await this.httpClientPrivate.patch(
                `/order/cancel/${order_id}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    getCouponByCode = async (coupon_code: string) => {
        try {
            const res = await this.httpClientPublic.get(
                `/coupon/${coupon_code}/view`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    };
}

export const orderService: OrderService = new OrderService();
