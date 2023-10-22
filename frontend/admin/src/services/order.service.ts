import { BaseService } from "./base.service";

class OrderService extends BaseService {
    async getOrder(page: number, limit: number, status: string) {
        try {
            const res = await this.httpClientPublic.get(
                `/order/view?status=${status}&page=${page}&limit=${limit}`
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

    async acceptOrderById(order_id: number) {
        try {
            const res = await this.httpClientPrivate.patch(
                `/order/accept/${order_id}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getOrderByCustomerId(
        customer_id: number,
        page: number,
        limit: number
    ) {
        try {
            const res = await this.httpClientPublic.get(
                `/order/view/customer/${customer_id}?page=${page}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const orderService: OrderService = new OrderService();
