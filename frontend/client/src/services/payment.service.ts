import { BaseService } from "./base.service";

class PaymentService extends BaseService {
    async createPayment() {
        try {
            const res = await this.httpClientPublic.post(
                "/payment/create_payment_url"
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getVnpayTrans(order_id: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/payment/${order_id}/vnpay/view`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const paymentService = new PaymentService();
