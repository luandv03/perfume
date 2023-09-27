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
exports.orderService = void 0;
var index_db_1 = require("../../db/index.db");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var handle_time_expired_1 = require("../../utils/handle_time_expired");
var OrderService = /** @class */ (function () {
    function OrderService() {
    }
    OrderService.prototype.createOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, tax, delivery_cost, coupon_id, orderList, payment_type, results_1, order_id, query_insert, i, results_2, coupon_results, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 12]);
                        customer_id = order.customer_id, tax = order.tax, delivery_cost = order.delivery_cost, coupon_id = order.coupon_id, orderList = order.orderList, payment_type = order.payment_type;
                        return [4 /*yield*/, (0, index_db_1.query)("BEGIN")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO orders(customer_id, tax, status, delivery_cost, order_date, payment_type, payment_status) VALUES($1, $2, 'ordered', $3, NOW()::DATE, $4, '0') RETURNING *", [customer_id, tax, delivery_cost, payment_type])];
                    case 2:
                        results_1 = _a.sent();
                        order_id = results_1.rows[0].order_id;
                        query_insert = "";
                        for (i = 0; i < orderList.length; i++) {
                            query_insert = query_insert.concat("(".concat(order_id, ", ").concat(orderList[i].product_id, ", ").concat(orderList[i].quantity, ", ").concat(orderList[i].net_price, "),"));
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO orderlines(order_id, product_id, quantity, net_price)\n            VALUES  ".concat(query_insert.substring(0, query_insert.length - 1)))];
                    case 3:
                        results_2 = _a.sent();
                        if (!(results_2.rowCount < orderList.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, index_db_1.query)("ROLLBACK")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_ACCEPTABLE,
                                message: "Tạo đơn hàng không thành công do có sản phẩm vượt quá số lượng trong kho ",
                            }];
                    case 5:
                        if (!coupon_id) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO coupon_orders VALUES ($1, $2)", [Number(coupon_id), Number(order_id)])];
                    case 6:
                        coupon_results = _a.sent();
                        if (!!coupon_results.rowCount) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, index_db_1.query)("ROLLBACK")];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.ACCEPTED,
                                message: "Đặt hàng không thành công. Phiếu giảm giá đã hết hạn hoặc không hữu dụng!",
                            }];
                    case 8: return [4 /*yield*/, (0, index_db_1.query)("COMMIT")];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Đặt hàng thành công",
                                data: results_1.rows[0],
                            }];
                    case 10:
                        error_1 = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("ROLLBACK")];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: "Tạo đơn hàng không thành công",
                                error: error_1,
                            }];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // status
    // all: all of types
    // ordered: ordered but no accepted
    // canceled
    // accepted: processing, shipping
    // done!
    OrderService.prototype.getOrder = function (page, limit, status) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, results, totalOrders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = (page - 1) * limit;
                        if (!(status === "all")) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, index_db_1.query)("with tmp_2 as (\n                    with tmp as (\n                    select order_id, customer_id, cast(count(orderline_id) as int) n_item , tax, \n                    delivery_cost, sum(quantity*net_price) tam_tinh , order_date, payment_type \n                    from orders\n                    join orderlines using(order_id)\n                    group by order_id\n                )\n                select tmp.order_id, customer_id, n_item, tax, delivery_cost,\n                tam_tinh, sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date, payment_type\n                from tmp\n                left join coupon_orders cpo on tmp.order_id = cpo. order_id\n                left join coupons cp on cp.coupon_id = cpo.coupon_id\n                group by tmp.order_id, customer_id, n_item, tax, delivery_cost, tam_tinh, order_date, payment_type\n                )\n                select order_id, customer_id, n_item, tax, delivery_cost, cast(tong_giam_gia as int), \n                order_date, payment_type, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don\n                from tmp_2 ORDER BY order_id\n                OFFSET $1 LIMIT $2 ", [offset, limit])];
                    case 1:
                        results = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, (0, index_db_1.query)("with tmp_2 as (\n                    with tmp as (\n                    select order_id, customer_id, cast(count(orderline_id) as int) n_item , tax , delivery_cost, sum(quantity*net_price) tam_tinh , order_date, payment_type \n                    from orders\n                    join orderlines using(order_id)\n                    WHERE status = $1 \n                    group by order_id\n                )\n                select tmp.order_id, customer_id, n_item, tax, delivery_cost, tam_tinh, sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date, payment_type\n                from tmp\n                left join coupon_orders cpo on tmp.order_id = cpo. order_id\n                left join coupons cp on cp.coupon_id = cpo.coupon_id\n                group by tmp.order_id, customer_id, n_item, tax, delivery_cost, tam_tinh, order_date, payment_type\n                )\n                select order_id, customer_id, n_item, tax, delivery_cost, cast(tong_giam_gia as int), order_date, payment_type, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost   as tong_hoa_don\n                from tmp_2 ORDER BY order_id\n                OFFSET $2 LIMIT $3 ", [status, offset, limit])];
                    case 3:
                        results = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.countOrder(status)];
                    case 5:
                        totalOrders = _a.sent();
                        return [2 /*return*/, {
                                stausCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get order Success",
                                data: {
                                    orders: results === null || results === void 0 ? void 0 : results.rows,
                                    page: page,
                                    total: limit,
                                    totalPage: Math.ceil(totalOrders / limit),
                                    totalOrders: Number(totalOrders),
                                },
                            }];
                }
            });
        });
    };
    OrderService.prototype.getOrderById = function (order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var orderQuery, orderlinesQuery, couponQuery, _a, orderResults, orderlinesResults, couponResults;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orderQuery = (0, index_db_1.query)("select o.*, c.email, c.fullname, c.address  from orders o \n        join customers c using(customer_id)\n        where order_id = $1", [order_id]);
                        orderlinesQuery = (0, index_db_1.query)("select ol.orderline_id, ol.product_id, ol.quantity, cast(ol.net_price as int), p.title\n        from orderlines ol\n        join products p using(product_id)\n        where order_id = $1", [order_id]);
                        couponQuery = (0, index_db_1.query)("select coupon_id, coupon_code, cast(coupon_discount as int) from coupons \n        where coupon_id in (select coupon_id from coupon_orders where order_id = $1)", [order_id]);
                        return [4 /*yield*/, Promise.all([orderQuery, orderlinesQuery, couponQuery])];
                    case 1:
                        _a = _b.sent(), orderResults = _a[0], orderlinesResults = _a[1], couponResults = _a[2];
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get order detail successfull",
                                data: {
                                    order: orderResults.rows[0],
                                    orderlines: orderlinesResults.rows,
                                    coupons: couponResults.rows,
                                },
                            }];
                }
            });
        });
    };
    OrderService.prototype.getOrderByCustomerId = function (customer_id, page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, results, n_orders, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        offset = (page - 1) * limit;
                        return [4 /*yield*/, (0, index_db_1.query)("with tmp_2 as (\n                with tmp as (\n                select order_id,cast(count(orderline_id) as int) n_item, status, tax, delivery_cost, sum(quantity*net_price) tam_tinh , order_date, payment_type from orders\n                join orderlines using(order_id)\n                where customer_id = $1\n                group by order_id\n            )\n            select tmp.order_id, n_item, status, tax, delivery_cost, tam_tinh,   sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date, payment_type\n            from tmp\n            left join coupon_orders cpo on tmp.order_id = cpo. order_id\n            left join coupons cp on cp.coupon_id = cpo.coupon_id\n            group by tmp.order_id, n_item, status, tax, delivery_cost, tam_tinh, order_date, payment_type\n        )\n        select order_id, n_item, status, tax, delivery_cost, tong_giam_gia, order_date, payment_type, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don\n        from tmp_2 order by order_id OFFSET $2 LIMIT $3", [customer_id, offset, limit])];
                    case 1:
                        results = _a.sent();
                        return [4 /*yield*/, this.countOrderByCustomerId(customer_id)];
                    case 2:
                        n_orders = _a.sent();
                        if (!results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Not orders",
                                    data: {
                                        orders: results.rows,
                                        page: page,
                                        limit: limit,
                                        totalPage: Math.ceil(n_orders / limit),
                                        totalOrder: n_orders,
                                    },
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get orders successfull",
                                data: {
                                    orders: results.rows,
                                    page: page,
                                    limit: limit,
                                    totalPage: Math.ceil(n_orders / limit),
                                    totalOrder: n_orders,
                                },
                            }];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: "Have error",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //cancel order with role customer
    OrderService.prototype.cancelOrder = function (order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results, resData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT order_id, status FROM orders WHERE order_id = $1", [Number(order_id)])];
                    case 1:
                        results = _a.sent();
                        if (!results.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Order not exist!",
                                }];
                        }
                        if (results.rows[0].status !== "ordered") {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_ACCEPTABLE,
                                    message: "Không thể hủy đơn hàng. Hãy liên hệ với chúng tôi để được giúp đỡ!",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("UPDATE orders SET status = 'canceled' WHERE order_id = $1 RETURNING *", [Number(order_id)])];
                    case 2:
                        resData = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Cancel order successfully!",
                                data: resData.rows[0],
                            }];
                }
            });
        });
    };
    // acceptOrder
    OrderService.prototype.acceptOrderByOrderId = function (order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("UPDATE orders SET status = 'accepted' WHERE order_id = $1", [Number(order_id)])];
                    case 1:
                        results = _a.sent();
                        if (!results.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.ACCEPTED,
                                    message: "Update status order failure!",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Accepted order!",
                            }];
                }
            });
        });
    };
    OrderService.prototype.getValidCouponByCode = function (coupon_code) {
        return __awaiter(this, void 0, void 0, function () {
            var results, startTimeCoupon, endTimeCoupon, currentTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM coupons WHERE coupon_code = $1", [coupon_code])];
                    case 1:
                        results = _a.sent();
                        if (!results.rows[0]) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Mã giảm giá không tồn tại",
                                }];
                        }
                        // check quantity
                        if (results.rows[0].quantity <= 0) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.ACCEPTED,
                                    message: "Mã giảm giá này đã hết",
                                }];
                        }
                        startTimeCoupon = (0, handle_time_expired_1.handleTimeExpired)(results.rows[0].start_time);
                        endTimeCoupon = (0, handle_time_expired_1.handleTimeExpired)(results.rows[0].end_time);
                        currentTime = (0, handle_time_expired_1.handleTimeExpired)(new Date());
                        if (startTimeCoupon > currentTime || endTimeCoupon < currentTime) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_ACCEPTABLE,
                                    message: "Mã giảm giá đã hết hạn",
                                }];
                        }
                        // còn lại => OK
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "COUPON OK",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    OrderService.prototype.createCoupon = function (_a) {
        var coupon_name = _a.coupon_name, coupon_code = _a.coupon_code, coupon_discount = _a.coupon_discount, condition = _a.condition, quantity = _a.quantity, start_time = _a.start_time, end_time = _a.end_time;
        return __awaiter(this, void 0, void 0, function () {
            var results, resCoupon;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM coupons WHERE coupon_code = $1", [coupon_code])];
                    case 1:
                        results = _b.sent();
                        if (!!results.rows[0]) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Mã giảm giá đã tồn tại",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO coupons(coupon_name, coupon_code, coupon_discount, condition, quantity, start_time, end_time)  \n             VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *", [
                                coupon_name,
                                coupon_code,
                                coupon_discount,
                                condition,
                                quantity,
                                start_time,
                                end_time,
                            ])];
                    case 2:
                        resCoupon = _b.sent();
                        if (!resCoupon.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Tạo mã giảm giá thất bại",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "COUPON OK",
                                data: resCoupon.rows[0],
                            }];
                }
            });
        });
    };
    // status
    // all: all of types
    // ordered: ordered but no accepted
    // canceled
    // accepted: processing, shipping
    // done!
    OrderService.prototype.countOrder = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(status === "all")) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT count(order_id) number_of_orders FROM orders")];
                    case 1:
                        results = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, (0, index_db_1.query)("SELECT count(order_id) number_of_orders FROM orders \n                 WHERE status = $1", [status])];
                    case 3:
                        results = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, results === null || results === void 0 ? void 0 : results.rows[0].number_of_orders];
                }
            });
        });
    };
    OrderService.prototype.countOrderByCustomerId = function (customer_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT count(order_id) n_orders FROM orders WHERE customer_id = $1", [customer_id])];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, Number(results.rows[0].n_orders)];
                }
            });
        });
    };
    OrderService.prototype.updatePaymentStatus = function (order_id, payment_status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("UPDATE orders SET payment_status = $1 WHERE order_id = $2", [payment_status, order_id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "OK do nha hihihi",
                            }];
                }
            });
        });
    };
    return OrderService;
}());
exports.orderService = new OrderService();
