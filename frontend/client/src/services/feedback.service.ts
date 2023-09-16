import { BaseService } from "./base.service";

class FeedbackService extends BaseService {
    async getFeedbackByProductId(
        product_id: number,
        page: number,
        limit: number
    ) {
        try {
            const res = await this.httpClientPublic.get(
                `/feedback/view?product_id=${product_id}&page=${page}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const feedbackService = new FeedbackService();
