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
            statusCode: HttpStatusCode.OK,
            message: "Create feedback success",
            data: results.rows[0],
        };
    }

    async updateFeedback(feedback: FeedbackType): Promise<ResponseType<any>> {
        const { customer_id, product_id, content, stars } = feedback;

        const results = await query(
            `UPDATE feedbacks 
            SET content = $1, stars = $2, updated_at = CURRENT_TIMESTAMP
            WHERE customer_id = $3 AND product_id = $4
            RETURNING *`,
            [content, stars, customer_id, product_id]
        );

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Update feedback failed",
                data: results.rows[0],
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Update feedback success",
            data: results.rows[0],
        };
    }

    async removeFeedback(
        customer_id: number,
        product_id: number
    ): Promise<ResponseType<any>> {
        const feedbackFound = await query(
            `SELECT customer_id, product_id FROM feedbacks WHERE customer_id = $1 AND product_id = $2`,
            [customer_id, product_id]
        );

        if (!feedbackFound.rows.length) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Feedback not exist!",
                data: feedbackFound.rows[0],
            };
        }

        const deletedFeedback = await query(
            `DELETE FROM feedbacks WHERE customer_id = $1 AND product_id = $2 `,
            [customer_id, product_id]
        );

        if (!deletedFeedback.rowCount) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Delete feedback failed!",
            };
        }

        return {
            statusCode: HttpStatusCode.NOT_FOUND,
            message: "Delete feedback success!",
        };
    }
}

export const feedbackService = new FeedbackService();
