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
        // check customer bought that product ?
        const checkBought = await this.checkCustomerBoughtProuduct(
            product_id,
            customer_id
        );

        if (!checkBought) {
            return {
                statusCode: HttpStatusCode.NOT_ACCEPTABLE,
                message:
                    "You haven't already bought this product, so you can't feedback it",
            };
        }

        const results = await query(
            `INSERT INTO feedbacks
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT ON CONSTRAINT feedbacks_pkey
            DO UPDATE SET content = $3, 
            stars = $4, updated_at = CURRENT_TIMESTAMP RETURNING *`,
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

    // async updateFeedback(feedback: FeedbackType): Promise<ResponseType<any>> {
    //     const { customer_id, product_id, content, stars } = feedback;

    //     const results = await query(
    //         `UPDATE feedbacks
    //         SET content = $1, stars = $2, updated_at = CURRENT_TIMESTAMP
    //         WHERE customer_id = $3 AND product_id = $4
    //         RETURNING *`,
    //         [content, stars, customer_id, product_id]
    //     );

    //     if (!results.rows.length) {
    //         return {
    //             statusCode: HttpStatusCode.BAD_REQUEST,
    //             message: "Update feedback failed",
    //             data: results.rows[0],
    //         };
    //     }

    //     return {
    //         statusCode: HttpStatusCode.OK,
    //         message: "Update feedback success",
    //         data: results.rows[0],
    //     };
    // }

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
            statusCode: HttpStatusCode.OK,
            message: "Delete feedback success!",
        };
    }

    async getFeedbackByProductId({
        product_id,
        page,
        limit,
    }: {
        product_id: number;
        page: number;
        limit: number;
    }): Promise<ResponseType<any>> {
        const offset = (page - 1) * limit;

        const feedbacks = await query(
            `SELECT * FROM (
            SELECT f.*, c.fullname FROM feedbacks f
            JOIN customers c USING(customer_id)
             WHERE product_id = $1 OFFSET $2 LIMIT $3) tmp
             ORDER BY customer_id
             `,
            [product_id, offset, limit]
        );
        //VD: limit = 5, page = 1
        // page = 1 => offset = 0 : 1 2 3 4 5  | offset = (page-1)*limit
        // page 2 => offset = 5   | 6 7 8 9 10
        // page 3 => offset = 10
        const totalFeedback = await this.countFeedbackCountByProductId(
            product_id
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get feedback success",
            data: {
                feedbackList: feedbacks.rows,
                pageNumber: page,
                feedbackPerPage: limit,
                totalPage: Math.ceil(totalFeedback / limit),
                totalFeedback: Number(totalFeedback),
            },
        };
    }

    async countFeedbackCountByProductId(product_id: number) {
        const results = await query(
            `SELECT count(*) AS feedback_number FROM feedbacks WHERE product_id = $1`,
            [product_id]
        );

        if (results.rowCount) {
            return results.rows[0]?.feedback_number;
        }
    }

    async checkCustomerBoughtProuduct(
        product_id: number,
        customer_id: number
    ): Promise<boolean> {
        const results = await query(
            `select customer_id from orders
            join orderlines using(order_id)
            where product_id = $1 and customer_id = $2 and status = 'done'`,
            [product_id, customer_id]
        );

        if (!results.rows.length) return false;

        return true;
    }
}

export const feedbackService = new FeedbackService();
