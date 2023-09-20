import { Request, Response } from "express";
import https from "https";
import crypto from "crypto";

const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const orderInfo = "pay with MoMo";
const partnerCode = "MOMO";
// const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
const redirectUrl = "http://localhost:8888/payment/momo/return_url";
const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
const requestType = "payWithMethod";
const amount = "1000";
const orderId = partnerCode + new Date().getTime();
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

export class PaymentController {
    async createPaymentWithMomo(
        request: Request,
        response: Response
    ): Promise<any> {
        try {
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
