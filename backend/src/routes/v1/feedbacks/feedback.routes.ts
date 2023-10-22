import { Router } from "express";

import { FeedbackController } from "../../../controllers/feedbacks/feedback.controller";
import { userAuthMiddleware } from "../../../middlewares/user-auth.middleware";
import { authMiddleware } from "../../../middlewares/auth.middleware";
const feedbackRoutes = Router();
const feedbackController = new FeedbackController();

// create feedback or update
feedbackRoutes.post(
    "/feedback/create",
    userAuthMiddleware,
    feedbackController.createFeedback
);

// // update feedback
// feedbackRoutes.patch(
//     "/feedback/update",
//     userAuthMiddleware,
//     feedbackController.updateFeedback
// );

// delete feedback
feedbackRoutes.delete(
    "/feedback/product/:product_id/delete",
    userAuthMiddleware,
    feedbackController.removeFeedback
);

// get feedback by product id
feedbackRoutes.get("/feedback/view", feedbackController.getFeedbackByProductId);

// get feedback recently
feedbackRoutes.get(
    "/feedback/recently/view",
    authMiddleware,
    feedbackController.getRecentlyFeedbacks
);

export default feedbackRoutes;
