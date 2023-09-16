import { Request, Response } from "express";
import { feedbackService } from "../../services/feedbacks/feedback.service";

export class FeedbackController {
    async createFeedback(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = res.locals.data;
            const { product_id, content, stars } = req.body;

            const data = await feedbackService.createFeedback({
                customer_id,
                product_id,
                content,
                stars,
            });

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }

    // async updateFeedback(req: Request, res: Response): Promise<any> {
    //     try {
    //         const { customer_id } = res.locals.data;

    //         const { product_id, content, stars } = req.body;

    //         const data = await feedbackService.updateFeedback({
    //             customer_id,
    //             product_id,
    //             content,
    //             stars,
    //         });

    //         res.status(data.statusCode).json(data);
    //     } catch (error) {
    //         res.status(500).json({
    //             statusCode: 500,
    //             message: "INTERNAL SERVER ERROR",
    //             error: error,
    //         });
    //     }
    // }

    async removeFeedback(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = res.locals.data;

            const { product_id } = req.params;

            const data = await feedbackService.removeFeedback(
                Number(customer_id),
                Number(product_id)
            );

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }

    async getFeedbackByProductId(req: Request, res: Response): Promise<any> {
        try {
            const { product_id, page, limit } = req.query;

            const data = await feedbackService.getFeedbackByProductId({
                product_id: Number(product_id),
                page: Number(page),
                limit: Number(limit),
            });

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }
}
