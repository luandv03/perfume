export const vnpayConfig = {
    vnp_TmnCode: "6PBD5E7U",
    vnp_HashSecret: "RCOCQUMRSOFIKJLSJEINOJZKGHTFPZYF",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    vnp_ReturnUrl: `${process.env.SERVER_DOMAIN}/api/v1/order/vnpay_return`,
};
