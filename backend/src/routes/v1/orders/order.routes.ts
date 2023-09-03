import { Router } from "express";

const orderRoutes: Router = Router();

import { OrderController } from "../../../controllers/orders/orders.controller";
import { userAuthMiddleware } from "../../../middlewares/user-auth.middleware";
import { authMiddleware } from "../../../middlewares/auth.middleware";
const orderController = new OrderController();

orderRoutes.post(
    "/order/create",
    userAuthMiddleware,
    orderController.createOrder
);

// get order by customer_id
orderRoutes.get(
    "/order/view/customer/:customer_id",
    userAuthMiddleware,
    orderController.getOrderByCustomerId
);

//get orders : role admin
orderRoutes.get("/order/view", orderController.getOrder);

//get orders by id : role admin
orderRoutes.get("/order/detail/:order_id", orderController.getOrderById);

// accept order : role admin
orderRoutes.patch(
    "/order/accept/:order_id",
    // authMiddleware,
    orderController.acceptOrderByOrderId
);

// cancel order : role customer
orderRoutes.patch(
    "/order/cancel/:order_id",
    userAuthMiddleware,
    orderController.cancelOrder
);

//use coupon
orderRoutes.get("/coupon/:coupon_code", orderController.getValidCouponByCode);

export default orderRoutes;
