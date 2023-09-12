import { BaseService } from "./base.service";

class CustomerService extends BaseService {
    async getCustomers(type: string, page: number, limit: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/customer/view?type=${type}&page=${page}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getCustomerById(customer_id: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/customer/detail/${customer_id}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const customerService: CustomerService = new CustomerService();
