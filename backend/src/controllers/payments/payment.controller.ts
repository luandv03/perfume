import { Request, Response } from "express";
import https from "https";
import crypto from "crypto";
import moment from "moment";

import { sortObject } from "../../utils/sortObject.util";
import { vnpayConfig } from "../../configs/vnpay.config";
import { paymentService } from "../../services/payments/payment.service";
import { orderService } from "../../services/orders/order.service";
import { configService } from "../../configs/configService.config";

export class PaymentController {
    // ################## VNPAY #####################
    // ################## VNPAY #####################
    async getVnpayPayment(req: Request, res: Response): Promise<any> {
        res.render("order", {
            title: "Tạo mới đơn hàng",
            amount: Number(req.query.amount),
            order_id: req.query.order_id,
        });
    }

    async createVnpayPayment(req: Request, res: Response): Promise<any> {
        process.env.TZ = "Asia/Ho_Chi_Minh";

        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");

        let ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // vnp_TxnRef, // order_id
        // vnp_Amount,
        // vnp_BankCode,
        // vnp_CardType,
        // vnp_OrderInfo,
        // vnp_PayDate,
        // vnp_ResponseCode,
        // vnp_TmnCode,
        // vnp_TransactionNo,
        // vnp_TransactionStatus,
        // vnp_SecureHash,

        let tmnCode = vnpayConfig["vnp_TmnCode"];
        let secretKey = vnpayConfig["vnp_HashSecret"];
        let vnpUrl = vnpayConfig["vnp_Url"];
        let returnUrl = vnpayConfig["vnp_ReturnUrl"];
        let orderId = req.body.order_id;
        let amount = req.body.amount;
        let bankCode = req.body.bankCode;

        let locale = "vn";
        if (locale === null || locale === "") {
            locale = "vn";
        }
        let currCode = "VND";
        let vnp_Params: any = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl);
    }

    async vnpayReturn(req: Request, res: Response): Promise<any> {
        let vnp_Params = req.query;

        let secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let tmnCode = vnpayConfig["vnp_TmnCode"];
        let secretKey = vnpayConfig["vnp_HashSecret"];

        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            await orderService.updatePaymentStatus(
                Number(vnp_Params.vnp_TxnRef),
                "1"
            );
            res.redirect(
                `${configService.getClientDomain()}/payment_end?code=${
                    vnp_Params["vnp_ResponseCode"]
                }`
            );
            // res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
        } else {
            await orderService.updatePaymentStatus(
                Number(vnp_Params.vnp_TxnRef),
                "2"
            );
            res.redirect(
                `${configService.getClientDomain()}/payment_end?code=97
                    
                }`
            );
            // res.render("success", { code: "97" });
        }
    }

    async vnpayIpn(req: Request, res: Response): Promise<any> {
        // const {
        //     vnp_TxnRef, // order_id
        //     vnp_Amount,
        //     vnp_BankCode,
        //     vnp_CardType,
        //     vnp_OrderInfo,
        //     vnp_PayDate,
        //     vnp_ResponseCode,
        //     vnp_TmnCode,
        //     vnp_TransactionNo,
        //     vnp_TransactionStatus,
        //     vnp_SecureHash,
        // } = req.query;

        // const data = await paymentService.createPaymentVnpayTrans({
        //     vnp_TxnRef: Number(vnp_TxnRef), // order_id
        //     vnp_Amount: vnp_Amount as string,
        //     vnp_BankCode: vnp_BankCode as string,
        //     vnp_CardType: vnp_CardType as string,
        //     vnp_OrderInfo: vnp_OrderInfo as string,
        //     vnp_PayDate: vnp_PayDate as string,
        //     vnp_ResponseCode: vnp_ResponseCode as string,
        //     vnp_TmnCode: vnp_TmnCode as string,
        //     vnp_TransactionNo: vnp_TransactionNo as string,
        //     vnp_TransactionStatus: vnp_TransactionStatus as string,
        //     vnp_SecureHash: vnp_SecureHash as string,
        // });

        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];

        let orderId = vnp_Params["vnp_TxnRef"];
        let rspCode = vnp_Params["vnp_ResponseCode"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = vnpayConfig["vnp_HashSecret"];
        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
        //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
        //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

        let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
        let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
        if (secureHash === signed) {
            //kiểm tra checksum
            if (checkOrderId) {
                if (checkAmount) {
                    if (paymentStatus == "0") {
                        //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                        if (rspCode == "00") {
                            //thanh cong
                            //paymentStatus = '1'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn

                            // await orderService.updatePaymentStatus(
                            //     Number(orderId),
                            //     "1"
                            // );

                            res.status(200).json({
                                RspCode: "00",
                                Message: "Success",
                            });
                        } else {
                            //that bai
                            //paymentStatus = '2'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                            // await orderService.updatePaymentStatus(
                            //     Number(orderId),
                            //     "2"
                            // );

                            res.status(200).json({
                                RspCode: "00",
                                Message: "Success",
                            });
                        }
                    } else {
                        res.status(200).json({
                            RspCode: "02",
                            Message:
                                "This order has been updated to the payment status",
                        });
                    }
                } else {
                    res.status(200).json({
                        RspCode: "04",
                        Message: "Amount invalid",
                    });
                }
            } else {
                res.status(200).json({
                    RspCode: "01",
                    Message: "Order not found",
                });
            }
        } else {
            res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
        }
    }

    async getVnpayTrans(req: Request, res: Response): Promise<any> {
        try {
            const order_id = req.params.order_id;
            const data = await paymentService.getVnpayTrans(Number(order_id));

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }

    // ############ MOMO ###########
    // ############ MOMO ###########
    async createPaymentWithMomo(
        request: Request,
        response: Response
    ): Promise<any> {
        try {
            const accessKey = "F8BBA842ECF85";
            const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            const orderInfo = "pay with MoMo";
            const partnerCode = "MOMO";
            // const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
            const redirectUrl = "http://localhost:8888/payment/momo/return_url";
            const ipnUrl =
                "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
            const requestType = "payWithMethod";
            const amount = request.query.amount;
            const orderId = partnerCode + request.query.order_id;
            const requestId = orderId;
            const extraData = "";
            const paymentCode =
                "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
            const orderGroupId = "";
            const autoCapture = true;
            const lang = "vi";

            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            const rawSignature =
                "accessKey=" +
                accessKey +
                "&amount=" +
                amount +
                "&extraData=" +
                extraData +
                "&ipnUrl=" +
                ipnUrl +
                "&orderId=" +
                orderId +
                "&orderInfo=" +
                orderInfo +
                "&partnerCode=" +
                partnerCode +
                "&redirectUrl=" +
                redirectUrl +
                "&requestId=" +
                requestId +
                "&requestType=" +
                requestType;
            //puts raw signature

            var signature = crypto
                .createHmac("sha256", secretKey)
                .update(rawSignature)
                .digest("hex");

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                partnerName: "Test",
                storeId: "MomoTestStore",
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                lang: lang,
                requestType: requestType,
                autoCapture: autoCapture,
                extraData: extraData,
                orderGroupId: orderGroupId,
                signature: signature,
            });

            const options = {
                hostname: "test-payment.momo.vn",
                port: 443,
                path: "/v2/gateway/api/create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
            };
            //Send the request and get the response
            const req = https.request(options, (res) => {
                res.setEncoding("utf8");
                res.on("data", (body) => {
                    const da = JSON.parse(body);

                    response.redirect(da.payUrl);
                });
                res.on("end", () => {
                    console.log("No more data in response.");
                });
            });

            req.on("error", (e) => {
                console.log(`problem with request: ${e.message}`);
            });

            req.write(requestBody);
            req.end("Request end!");
        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: "INTERNAL_ERROR_SERVER",
                error,
            });
        }
    }

    async paymentWithMomoReturn(req: Request, res: Response): Promise<any> {
        try {
            const {
                partnerCode,
                orderId,
                requestId,
                amount,
                orderType,
                transId,
                resultCode,
                message,
                payType,
                signature,
            } = req.query;
            // save into db

            const data = await paymentService.createPaymentMomoTrans({
                orderId: Number(orderId),
                partnerCode: partnerCode as string,
                requestId: requestId as string,
                amount: amount as string,
                orderType: orderType as string,
                transId: transId as string,
                resultCode: resultCode as string,
                message: message as string,
                payType: payType as string,
                signature: signature as string,
            });
            res.render("success_momo", { code: resultCode });
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL_ERROR_SERVER",
                error,
            });
        }
    }
}
