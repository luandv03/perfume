import { Router } from "express";

import { FeedbackController } from "../../../controllers/feedbacks/feedback.controller";
const feedbackRoutes = Router();
const feedbackController = new FeedbackController();

// create feedback
feedbackRoutes.post("/feedback/create", feedbackController.createFeedback);

export default feedbackRoutes;
