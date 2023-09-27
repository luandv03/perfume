"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var feedback_controller_1 = require("../../../controllers/feedbacks/feedback.controller");
var user_auth_middleware_1 = require("../../../middlewares/user-auth.middleware");
var feedbackRoutes = (0, express_1.Router)();
var feedbackController = new feedback_controller_1.FeedbackController();
// create feedback or update
feedbackRoutes.post("/feedback/create", user_auth_middleware_1.userAuthMiddleware, feedbackController.createFeedback);
// // update feedback
// feedbackRoutes.patch(
//     "/feedback/update",
//     userAuthMiddleware,
//     feedbackController.updateFeedback
// );
// delete feedback
feedbackRoutes.delete("/feedback/product/:product_id/delete", user_auth_middleware_1.userAuthMiddleware, feedbackController.removeFeedback);
// get feedback by product id
feedbackRoutes.get("/feedback/view", feedbackController.getFeedbackByProductId);
exports.default = feedbackRoutes;
