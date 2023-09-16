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

    async createFeedback(product_id: number, stars: number, content: string) {
        try {
            const res = await this.httpClientPrivate.post("/feedback/create", {
                product_id,
                stars,
                content,
            });

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async removeFeedback(product_id: number) {
        try {
            const res = await this.httpClientPrivate.delete(
                `/feedback/product/${product_id}/delete`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const feedbackService = new FeedbackService();
