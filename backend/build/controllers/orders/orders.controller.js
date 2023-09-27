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
exports.OrderController = void 0;
var order_service_1 = require("../../services/orders/order.service");
var OrderController = /** @class */ (function () {
    function OrderController() {
    }
    OrderController.prototype.createOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, customer_id, tax, delivery_cost, coupon_id, payment_type, orderList, data, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, customer_id = _a.customer_id, tax = _a.tax, delivery_cost = _a.delivery_cost, coupon_id = _a.coupon_id, payment_type = _a.payment_type, orderList = _a.orderList;
                        return [4 /*yield*/, order_service_1.orderService.createOrder({
                                customer_id: customer_id,
                                tax: tax,
                                delivery_cost: delivery_cost,
                                orderList: orderList,
                                coupon_id: coupon_id,
                                payment_type: payment_type,
                            })];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        err_1 = _b.sent();
                        res.status(500).json({ message: err_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getOrderByOwnerId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, _a, page, limit, data, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        customer_id = res.locals.data.customer_id;
                        _a = req.query, page = _a.page, limit = _a.limit;
                        return [4 /*yield*/, order_service_1.orderService.getOrderByCustomerId(Number(customer_id), Number(page), Number(limit))];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 2:
                        err_2 = _b.sent();
                        res.status(500).json({ message: err_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getOrderByCustomerId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, _a, page, limit, data, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        customer_id = req.params.customer_id;
                        _a = req.query, page = _a.page, limit = _a.limit;
                        return [4 /*yield*/, order_service_1.orderService.getOrderByCustomerId(Number(customer_id), Number(page), Number(limit))];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 2:
                        err_3 = _b.sent();
                        res.status(500).json({ message: err_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, limit, status, data, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, page = _a.page, limit = _a.limit, status = _a.status;
                        return [4 /*yield*/, order_service_1.orderService.getOrder(Number(page), Number(limit), status)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 2:
                        err_4 = _b.sent();
                        res.status(500).json({ message: err_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getOrderById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var order_id, data, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        order_id = req.params.order_id;
                        return [4 /*yield*/, order_service_1.orderService.getOrderById(Number(order_id))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 2:
                        err_5 = _a.sent();
                        res.status(500).json({ message: err_5 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getValidCouponByCode = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var coupon_code, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        coupon_code = req.params.coupon_code;
                        return [4 /*yield*/, order_service_1.orderService.getValidCouponByCode(coupon_code)];
                    case 1:
                        data = _a.sent();
                        res.status(data.statusCode).json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({ message: error_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.createCoupon = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, coupon_name, coupon_code, coupon_discount, condition, quantity, start_time, end_time, data, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, coupon_name = _a.coupon_name, coupon_code = _a.coupon_code, coupon_discount = _a.coupon_discount, condition = _a.condition, quantity = _a.quantity, start_time = _a.start_time, end_time = _a.end_time;
                        return [4 /*yield*/, order_service_1.orderService.createCoupon({
                                coupon_name: coupon_name,
                                coupon_code: coupon_code,
                                coupon_discount: coupon_discount,
                                condition: condition,
                                quantity: quantity,
                                start_time: start_time,
                                end_time: end_time,
                            })];
                    case 1:
                        data = _b.sent();
                        res.status(data.statusCode).json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        res.status(500).json({ message: error_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.acceptOrderByOrderId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var order_id, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        order_id = req.params.order_id;
                        return [4 /*yield*/, order_service_1.orderService.acceptOrderByOrderId(order_id)];
                    case 1:
                        data = _a.sent();
                        res.status(data.statusCode).json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).json({ message: error_3 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.cancelOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var order_id, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        order_id = req.params.order_id;
                        return [4 /*yield*/, order_service_1.orderService.cancelOrder(order_id)];
                    case 1:
                        data = _a.sent();
                        res.status(data.statusCode).json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(500).json({ message: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OrderController;
}());
exports.OrderController = OrderController;
