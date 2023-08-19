import { Request, Response } from "express";
import { feedbackService } from "../../services/feedbacks/feedback.service";

export class FeedbackController {
    async createFeedback(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id, product_id, content, stars } = req.body;

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

    async updateFeedback(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id, product_id, content, stars } = req.body;

            const data = await feedbackService.updateFeedback({
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
}
