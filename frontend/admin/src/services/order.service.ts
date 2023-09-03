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
}

export const orderService: OrderService = new OrderService();
