"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var payment_controller_1 = require("../../../controllers/payments/payment.controller");
var paymentRoutes = (0, express_1.Router)();
var paymentController = new payment_controller_1.PaymentController();
// vnpay wallet
paymentRoutes.get("/payment/vnpay/create_payment_url", paymentController.getVnpayPayment);
paymentRoutes.post("/payment/vnpay/create_payment_url", paymentController.createVnpayPayment);
paymentRoutes.get("/order/vnpay_return", paymentController.vnpayReturn);
paymentRoutes.get("/vnpay_ipn", paymentController.vnpayIpn);
//get payments
paymentRoutes.get("/payment/:order_id/vnpay/view", paymentController.getVnpayTrans);
// momo wallet
paymentRoutes.get("/payment/momo/create_payment_url", paymentController.createPaymentWithMomo);
// momo pay url
paymentRoutes.get("/payment/momo/return_url", paymentController.paymentWithMomoReturn);
exports.default = paymentRoutes;
