"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
var https_1 = __importDefault(require("https"));
var crypto_1 = __importDefault(require("crypto"));
var moment_1 = __importDefault(require("moment"));
var sortObject_util_1 = require("../../utils/sortObject.util");
var vnpay_config_1 = require("../../configs/vnpay.config");
var payment_service_1 = require("../../services/payments/payment.service");
var order_service_1 = require("../../services/orders/order.service");
var PaymentController = /** @class */ (function () {
    function PaymentController() {
    }
    // ################## VNPAY #####################
    // ################## VNPAY #####################
    PaymentController.prototype.getVnpayPayment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.render("order", {
                    title: "Tạo mới đơn hàng",
                    amount: Number(req.query.amount),
                    order_id: req.query.order_id,
                });
                return [2 /*return*/];
            });
        });
    };
    PaymentController.prototype.createVnpayPayment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var date, createDate, ipAddr, tmnCode, secretKey, vnpUrl, returnUrl, orderId, amount, bankCode, locale, currCode, vnp_Params, querystring, signData, crypto, hmac, signed;
            return __generator(this, function (_a) {
                process.env.TZ = "Asia/Ho_Chi_Minh";
                date = new Date();
                createDate = (0, moment_1.default)(date).format("YYYYMMDDHHmmss");
                ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                tmnCode = vnpay_config_1.vnpayConfig["vnp_TmnCode"];
                secretKey = vnpay_config_1.vnpayConfig["vnp_HashSecret"];
                vnpUrl = vnpay_config_1.vnpayConfig["vnp_Url"];
                returnUrl = vnpay_config_1.vnpayConfig["vnp_ReturnUrl"];
                orderId = req.body.order_id;
                amount = req.body.amount;
                bankCode = req.body.bankCode;
                locale = "vn";
                if (locale === null || locale === "") {
                    locale = "vn";
                }
                currCode = "VND";
                vnp_Params = {};
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
                vnp_Params = (0, sortObject_util_1.sortObject)(vnp_Params);
                querystring = require("qs");
                signData = querystring.stringify(vnp_Params, { encode: false });
                crypto = require("crypto");
                hmac = crypto.createHmac("sha512", secretKey);
                signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
                vnp_Params["vnp_SecureHash"] = signed;
                vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
                res.redirect(vnpUrl);
                return [2 /*return*/];
            });
        });
    };
    PaymentController.prototype.vnpayReturn = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var vnp_Params, secureHash, tmnCode, secretKey, querystring, signData, crypto, hmac, signed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vnp_Params = req.query;
                        secureHash = vnp_Params["vnp_SecureHash"];
                        delete vnp_Params["vnp_SecureHash"];
                        delete vnp_Params["vnp_SecureHashType"];
                        vnp_Params = (0, sortObject_util_1.sortObject)(vnp_Params);
                        tmnCode = vnpay_config_1.vnpayConfig["vnp_TmnCode"];
                        secretKey = vnpay_config_1.vnpayConfig["vnp_HashSecret"];
                        querystring = require("qs");
                        signData = querystring.stringify(vnp_Params, { encode: false });
                        crypto = require("crypto");
                        hmac = crypto.createHmac("sha512", secretKey);
                        signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
                        if (!(secureHash === signed)) return [3 /*break*/, 2];
                        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                        return [4 /*yield*/, order_service_1.orderService.updatePaymentStatus(Number(vnp_Params.vnp_TxnRef), "1")];
                    case 1:
                        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                        _a.sent();
                        res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, order_service_1.orderService.updatePaymentStatus(Number(vnp_Params.vnp_TxnRef), "2")];
                    case 3:
                        _a.sent();
                        res.render("success", { code: "97" });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentController.prototype.vnpayIpn = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var vnp_Params, secureHash, orderId, rspCode, secretKey, querystring, signData, crypto, hmac, signed, paymentStatus, checkOrderId, checkAmount;
            return __generator(this, function (_a) {
                vnp_Params = req.query;
                secureHash = vnp_Params["vnp_SecureHash"];
                orderId = vnp_Params["vnp_TxnRef"];
                rspCode = vnp_Params["vnp_ResponseCode"];
                delete vnp_Params["vnp_SecureHash"];
                delete vnp_Params["vnp_SecureHashType"];
                vnp_Params = (0, sortObject_util_1.sortObject)(vnp_Params);
                secretKey = vnpay_config_1.vnpayConfig["vnp_HashSecret"];
                querystring = require("qs");
                signData = querystring.stringify(vnp_Params, { encode: false });
                crypto = require("crypto");
                hmac = crypto.createHmac("sha512", secretKey);
                signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
                paymentStatus = "0";
                checkOrderId = true;
                checkAmount = true;
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
                                }
                                else {
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
                            }
                            else {
                                res.status(200).json({
                                    RspCode: "02",
                                    Message: "This order has been updated to the payment status",
                                });
                            }
                        }
                        else {
                            res.status(200).json({
                                RspCode: "04",
                                Message: "Amount invalid",
                            });
                        }
                    }
                    else {
                        res.status(200).json({
                            RspCode: "01",
                            Message: "Order not found",
                        });
                    }
                }
                else {
                    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
                }
                return [2 /*return*/];
            });
        });
    };
    PaymentController.prototype.getVnpayTrans = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var order_id, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        order_id = req.params.order_id;
                        return [4 /*yield*/, payment_service_1.paymentService.getVnpayTrans(Number(order_id))];
                    case 1:
                        data = _a.sent();
                        res.status(data.statusCode).json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({
                            statusCode: 500,
                            message: "INTERNAL SERVER ERROR",
                            error: error_1,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ############ MOMO ###########
    // ############ MOMO ###########
    PaymentController.prototype.createPaymentWithMomo = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var accessKey, secretKey, orderInfo, partnerCode, redirectUrl, ipnUrl, requestType, amount, orderId, requestId, extraData, paymentCode, orderGroupId, autoCapture, lang, rawSignature, signature, requestBody, options, req;
            return __generator(this, function (_a) {
                try {
                    accessKey = "F8BBA842ECF85";
                    secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
                    orderInfo = "pay with MoMo";
                    partnerCode = "MOMO";
                    redirectUrl = "http://localhost:8888/payment/momo/return_url";
                    ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
                    requestType = "payWithMethod";
                    amount = request.query.amount;
                    orderId = partnerCode + request.query.order_id;
                    requestId = orderId;
                    extraData = "";
                    paymentCode = "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
                    orderGroupId = "";
                    autoCapture = true;
                    lang = "vi";
                    rawSignature = "accessKey=" +
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
                    signature = crypto_1.default
                        .createHmac("sha256", secretKey)
                        .update(rawSignature)
                        .digest("hex");
                    requestBody = JSON.stringify({
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
                    options = {
                        hostname: "test-payment.momo.vn",
                        port: 443,
                        path: "/v2/gateway/api/create",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Content-Length": Buffer.byteLength(requestBody),
                        },
                    };
                    req = https_1.default.request(options, function (res) {
                        res.setEncoding("utf8");
                        res.on("data", function (body) {
                            var da = JSON.parse(body);
                            response.redirect(da.payUrl);
                        });
                        res.on("end", function () {
                            console.log("No more data in response.");
                        });
                    });
                    req.on("error", function (e) {
                        console.log("problem with request: ".concat(e.message));
                    });
                    req.write(requestBody);
                    req.end("Request end!");
                }
                catch (error) {
                    response.status(500).json({
                        statusCode: 500,
                        message: "INTERNAL_ERROR_SERVER",
                        error: error,
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    PaymentController.prototype.paymentWithMomoReturn = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, partnerCode, orderId, requestId, amount, orderType, transId, resultCode, message, payType, signature, data, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, partnerCode = _a.partnerCode, orderId = _a.orderId, requestId = _a.requestId, amount = _a.amount, orderType = _a.orderType, transId = _a.transId, resultCode = _a.resultCode, message = _a.message, payType = _a.payType, signature = _a.signature;
                        return [4 /*yield*/, payment_service_1.paymentService.createPaymentMomoTrans({
                                orderId: Number(orderId),
                                partnerCode: partnerCode,
                                requestId: requestId,
                                amount: amount,
                                orderType: orderType,
                                transId: transId,
                                resultCode: resultCode,
                                message: message,
                                payType: payType,
                                signature: signature,
                            })];
                    case 1:
                        data = _b.sent();
                        res.render("success_momo", { code: resultCode });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        res.status(500).json({
                            statusCode: 500,
                            message: "INTERNAL_ERROR_SERVER",
                            error: error_2,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PaymentController;
}());
exports.PaymentController = PaymentController;
