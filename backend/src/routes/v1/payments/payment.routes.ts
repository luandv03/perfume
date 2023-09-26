import { Router } from "express";
import moment from "moment";

import { PaymentController } from "../../../controllers/payments/payment.controller";

const paymentRoutes: Router = Router();
const paymentController = new PaymentController();

// vnpay wallet
paymentRoutes.get(
    "/payment/vnpay/create_payment_url",
    paymentController.getVnpayPayment
);

paymentRoutes.post(
    "/payment/vnpay/create_payment_url",
    paymentController.createVnpayPayment
);

paymentRoutes.get("/order/vnpay_return", paymentController.vnpayReturn);

paymentRoutes.get("/vnpay_ipn", paymentController.vnpayIpn);

//get payments
paymentRoutes.get(
    "/payment/:order_id/vnpay/view",
    paymentController.getVnpayTrans
);

// momo wallet
paymentRoutes.get(
    "/payment/momo/create_payment_url",
    paymentController.createPaymentWithMomo
);

// momo pay url
paymentRoutes.get(
    "/payment/momo/return_url",
    paymentController.paymentWithMomoReturn
);

export default paymentRoutes;
