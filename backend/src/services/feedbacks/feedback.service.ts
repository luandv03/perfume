import { query } from "../../db/index.db";
import { ResponseType } from "../../types/response.type";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";

interface FeedbackType {
    customer_id: number;
    product_id: number;
    content: string;
    stars: number;
}

class FeedbackService {
    async createFeedback(feedback: FeedbackType): Promise<ResponseType<any>> {
        const { customer_id, product_id, content, stars } = feedback;
        const results = await query(
            `INSERT INTO feedbacks VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
            [product_id, customer_id, content, stars]
        );

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Create feedback failed",
                data: results.rows[0],
            };
        }

        return {
            statusCode: HttpStatusCode.BAD_REQUEST,
            message: "Create feedback failed",
            data: results.rows[0],
        };
    }
}

export const feedbackService = new FeedbackService();
