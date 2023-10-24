import { Router } from "express";

import { authMiddleware } from "../../../middlewares/auth.middleware";
import { RevenueController } from "../../../controllers/revenues/revenue.controller";

const revenueRoutes: Router = Router();
const revenueController: RevenueController = new RevenueController();

revenueRoutes.get(
    "/revenue/view",
    authMiddleware,
    revenueController.getRevenueByYear
);

export default revenueRoutes;
