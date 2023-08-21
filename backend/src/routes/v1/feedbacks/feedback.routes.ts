import { Router } from "express";

import { FeedbackController } from "../../../controllers/feedbacks/feedback.controller";
import { userAuthMiddleware } from "../../../middlewares/user-auth.middleware";
const feedbackRoutes = Router();
const feedbackController = new FeedbackController();

// create feedback
feedbackRoutes.post(
    "/feedback/create",
    userAuthMiddleware,
    feedbackController.createFeedback
);

// update feedback
feedbackRoutes.patch(
    "/feedback/update",
    userAuthMiddleware,
    feedbackController.updateFeedback
);

// delete feedback
feedbackRoutes.delete(
    "/feedback/customer/:customer_id/product/:product_id",
    userAuthMiddleware,
    feedbackController.updateFeedback
);

// get feedback with paging
feedbackRoutes.get("/feedback/view", feedbackController.getFeedbackByProductId);

export default feedbackRoutes;
