import { BaseService } from "./base.service";

class OrderService extends BaseService {
    async getOrder(offset: number, limit: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/order/view?offset=${offset}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const orderService: OrderService = new OrderService();
