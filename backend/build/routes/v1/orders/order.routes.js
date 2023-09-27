"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var orderRoutes = (0, express_1.Router)();
var orders_controller_1 = require("../../../controllers/orders/orders.controller");
var user_auth_middleware_1 = require("../../../middlewares/user-auth.middleware");
var auth_middleware_1 = require("../../../middlewares/auth.middleware");
var orderController = new orders_controller_1.OrderController();
orderRoutes.post("/order/create", user_auth_middleware_1.userAuthMiddleware, orderController.createOrder);
// get order by customer_id: role customer
orderRoutes.get("/order/view/customer", user_auth_middleware_1.userAuthMiddleware, orderController.getOrderByOwnerId);
// get order by customer_id: role admin
orderRoutes.get("/order/view/customer/:customer_id", orderController.getOrderByCustomerId);
//get orders : role admin
orderRoutes.get("/order/view", orderController.getOrder);
//get orders by id : role admin
orderRoutes.get("/order/detail/:order_id", orderController.getOrderById);
// accept order : role admin
orderRoutes.patch("/order/accept/:order_id", auth_middleware_1.authMiddleware, orderController.acceptOrderByOrderId);
// cancel order : role customer
orderRoutes.patch("/order/cancel/:order_id", user_auth_middleware_1.userAuthMiddleware, orderController.cancelOrder);
//get coupon
orderRoutes.get("/coupon/:coupon_code/view", orderController.getValidCouponByCode);
//create coupon
orderRoutes.post("/coupon/create", orderController.createCoupon);
exports.default = orderRoutes;
