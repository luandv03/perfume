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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
var index_db_1 = require("../../db/index.db");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var PaymentService = /** @class */ (function () {
    function PaymentService() {
    }
    PaymentService.prototype.createPaymentVnpayTrans = function (vnpayData) {
        return __awaiter(this, void 0, void 0, function () {
            var vnp_TxnRef, vnp_Amount, vnp_BankCode, vnp_CardType, vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_SecureHash, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vnp_TxnRef = vnpayData.vnp_TxnRef, vnp_Amount = vnpayData.vnp_Amount, vnp_BankCode = vnpayData.vnp_BankCode, vnp_CardType = vnpayData.vnp_CardType, vnp_OrderInfo = vnpayData.vnp_OrderInfo, vnp_PayDate = vnpayData.vnp_PayDate, vnp_ResponseCode = vnpayData.vnp_ResponseCode, vnp_TmnCode = vnpayData.vnp_TmnCode, vnp_TransactionNo = vnpayData.vnp_TransactionNo, vnp_TransactionStatus = vnpayData.vnp_TransactionStatus, vnp_SecureHash = vnpayData.vnp_SecureHash;
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO vnpay_wallet VALUES(DEFAULT, $1, $2, $3, \n            $4, $5, $6, $7, $8, \n            $9, $10, $11)", [
                                vnp_TxnRef,
                                vnp_Amount,
                                vnp_BankCode,
                                vnp_CardType,
                                vnp_OrderInfo,
                                vnp_PayDate,
                                vnp_ResponseCode,
                                vnp_TmnCode,
                                vnp_TransactionNo,
                                vnp_TransactionStatus,
                                vnp_SecureHash,
                            ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Giao dịch hoàn tất",
                                data: result.rows[0],
                            }];
                }
            });
        });
    };
    PaymentService.prototype.getVnpayTrans = function (order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT vnpay_wallet_id, vnp_BankCode, vnp_CardType, vnp_PayDate, vnp_TransactionStatus FROM vnpay_wallet WHERE vnp_TxnRef = $1", [order_id])];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get transaction payment success",
                                data: res.rows,
                            }];
                }
            });
        });
    };
    PaymentService.prototype.createPaymentMomoTrans = function (momoData) {
        return __awaiter(this, void 0, void 0, function () {
            var partnerCode, orderId, requestId, amount, orderType, transId, resultCode, message, payType, signature, checkExist, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        partnerCode = momoData.partnerCode, orderId = momoData.orderId, requestId = momoData.requestId, amount = momoData.amount, orderType = momoData.orderType, transId = momoData.transId, resultCode = momoData.resultCode, message = momoData.message, payType = momoData.payType, signature = momoData.signature;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM vnpay_wallet WHERE orderId = $1", [orderId])];
                    case 1:
                        checkExist = _a.sent();
                        if (!checkExist.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                    message: "Thông tin giao dịch của đơn hàng:::" + orderId,
                                    data: checkExist.rows[0],
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO momo_wallet VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [
                                orderId,
                                partnerCode,
                                requestId,
                                amount,
                                orderType,
                                transId,
                                resultCode,
                                message,
                                payType,
                                signature,
                            ])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Giao dịch hoàn tất",
                                data: result.rows[0],
                            }];
                }
            });
        });
    };
    return PaymentService;
}());
exports.paymentService = new PaymentService();
