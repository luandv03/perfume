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

    async getOrderByCustomerId(customr_id: number) {
        try {
            const res = await this.httpClientPrivate.get(
                `/order/view/customer/${customr_id}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    // async getOrderById() {}
}

export const orderService: OrderService = new OrderService();
