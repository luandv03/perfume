import { Router } from "express";

const orderRoutes: Router = Router();

import { OrderController } from "../../../controllers/orders/orders.controller";
const orderController = new OrderController();

orderRoutes.post("/order/create", orderController.createOrder);

export default orderRoutes;
