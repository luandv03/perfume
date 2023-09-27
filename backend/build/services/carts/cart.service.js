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
exports.cartService = void 0;
var index_db_1 = require("../../db/index.db");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var CartService = /** @class */ (function () {
    function CartService() {
    }
    CartService.prototype.createCart = function (customer_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO carts VALUES (DEFAULT, $1) RETURNING *", [customer_id])];
                    case 1:
                        results = _a.sent();
                        if (!results.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Create cart failed",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: " Create Cart successfully",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    CartService.prototype.addCartItemIntoCart = function (customer_id, cartItem) {
        return __awaiter(this, void 0, void 0, function () {
            var product_id, quantity, cartResuslt, cart_id, cartItemExist, results, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        product_id = cartItem.product_id, quantity = cartItem.quantity;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT cart_id from carts WHERE customer_id = $1", [customer_id])];
                    case 1:
                        cartResuslt = _a.sent();
                        cart_id = cartResuslt.rows[0].cart_id;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT product_id FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cart_id, product_id])];
                    case 2:
                        cartItemExist = _a.sent();
                        results = void 0;
                        if (!!cartItemExist.rows.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO cart_items VALUES ($1, $2, $3) RETURNING *", [cart_id, product_id, quantity])];
                    case 3:
                        results = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, (0, index_db_1.query)("UPDATE cart_items SET quantity = quantity + $1 \n                    WHERE cart_id = $2 AND product_id = $3 RETURNING *", [quantity, cart_id, product_id])];
                    case 5:
                        results = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, {
                            statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                            message: "Add cart item successfully",
                            data: results.rows[0],
                        }];
                    case 7:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: error_1,
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // update cart item: API này dùng để update số lượng cart item trực tiếp trong giỏ hàng
    CartService.prototype.updateCartItem = function (customer_id, cartItem) {
        return __awaiter(this, void 0, void 0, function () {
            var product_id, quantity, cartResuslt, cart_id, cartItemExist, results, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        product_id = cartItem.product_id, quantity = cartItem.quantity;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT cart_id from carts WHERE customer_id = $1", [customer_id])];
                    case 1:
                        cartResuslt = _a.sent();
                        cart_id = cartResuslt.rows[0].cart_id;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT product_id FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cart_id, product_id])];
                    case 2:
                        cartItemExist = _a.sent();
                        // neu chua ton tai thi next
                        if (!cartItemExist.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Cart item not exist",
                                }];
                        }
                        if (quantity < 0) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Quantity can't less than 0",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("UPDATE cart_items SET quantity = $1 \n                WHERE cart_id = $2 AND product_id = $3 RETURNING *", [quantity, cart_id, product_id])];
                    case 3:
                        results = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Update cart item successfully",
                                data: results.rows[0],
                            }];
                    case 4:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: error_2,
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CartService.prototype.removeCartItem = function (customer_id, product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var cartResuslt, cart_id, results, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT cart_id FROM carts WHERE customer_id = $1", [customer_id])];
                    case 1:
                        cartResuslt = _a.sent();
                        cart_id = cartResuslt.rows[0].cart_id;
                        return [4 /*yield*/, (0, index_db_1.query)("DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *", [cart_id, product_id])];
                    case 2:
                        results = _a.sent();
                        if (!results.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_ACCEPTABLE,
                                    message: "Delete cart item failed",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Delete cart item success",
                                data: results.rows[0],
                            }];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: error_3,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // get cart list by customer_id
    CartService.prototype.getCartListByCustomerId = function (customer_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results, cartList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT cart_id FROM carts WHERE customer_id = $1", [customer_id])];
                    case 1:
                        results = _a.sent();
                        if (!results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "User not have cart list",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT product_id, title, brand, volume, discount, price, ci.quantity \n            FROM cart_items ci\n            JOIN products p USING(product_id)\n            WHERE cart_id = $1", [results.rows[0].cart_id])];
                    case 2:
                        cartList = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get cart list successfull!",
                                data: {
                                    cart_id: results.rows[0].cart_id,
                                    cart_list: cartList.rows,
                                },
                            }];
                }
            });
        });
    };
    return CartService;
}());
exports.cartService = new CartService();
