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
exports.userService = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var index_db_1 = require("../../db/index.db");
var configService_config_1 = require("../../configs/configService.config");
var create_token_util_1 = require("../../utils/create_token.util");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var cart_service_1 = require("../carts/cart.service");
var mailer_service_1 = require("../mailers/mailer.service");
var generatePasswordRandom_util_1 = require("../../utils/generatePasswordRandom.util");
var generateOtp_util_1 = require("../../utils/generateOtp.util");
var configService = new configService_config_1.ConfigService();
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.prototype.loginAccount = function (account) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var email, password, result, isMatch, access_token_user, refresh_token_user, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        email = account.email, password = account.password;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM system_account WHERE email = $1", [email])];
                    case 1:
                        result = _d.sent();
                        // rowCount: số lượng bản ghi trả về từ câu truy vấn
                        if (!result.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Not found",
                                }];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.password)];
                    case 2:
                        isMatch = _d.sent();
                        if (!isMatch) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Username or Password incorrect",
                                }];
                        }
                        access_token_user = (0, create_token_util_1.createToken)({
                            customer_id: (_b = result.rows[0]) === null || _b === void 0 ? void 0 : _b.customer_id,
                        }, configService.getSecretKeyAccessToken(), {
                            expiresIn: configService.getExpiresInAccessToken(),
                        });
                        refresh_token_user = (0, create_token_util_1.createToken)({
                            customer_id: (_c = result.rows[0]) === null || _c === void 0 ? void 0 : _c.customer_id,
                        }, configService.getSecretKeyRefreshToken(), {
                            expiresIn: configService.getExpiresInRefreshToken(),
                        });
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Login successfull",
                                data: {
                                    access_token_user: access_token_user,
                                    refresh_token_user: refresh_token_user,
                                    EXPIRES_ACCESS_TOKEN: configService.getExpiresInAccessToken(),
                                    EXPIRES_REFRESH_TOKEN: configService.getExpiresInRefreshToken(),
                                },
                            }];
                    case 3:
                        err_1 = _d.sent();
                        return [2 /*return*/, err_1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.registerAccount = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, phone_number, dob, fullname, address, results, hashPassword, customer, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 10]);
                        email = account.email, password = account.password, phone_number = account.phone_number, dob = account.dob, fullname = account.fullname, address = account.address;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM customers WHERE email = $1", [email])];
                    case 1:
                        results = _a.sent();
                        if (results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Email already exist",
                                }];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 2:
                        hashPassword = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("BEGIN")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO customers( email, fullname, phone_number, dob, address, auth_method) \n            VALUES ($1, $2, $3, $4, $5, 'system') RETURNING customer_id", [email, fullname, phone_number, dob, address])];
                    case 4:
                        customer = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO system_account(email, password, customer_id) VALUES ($1, $2, $3)", [email, hashPassword, customer.rows[0].customer_id])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, cart_service_1.cartService.createCart(customer.rows[0].customer_id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("COMMIT")];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "You have registed successfully",
                            }];
                    case 8:
                        error_1 = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("ROLLBACK")];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: "Have error user",
                                data: error_1,
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.refreshTokenService = function (token) {
        var decoded = jsonwebtoken_1.default.verify(token, configService.getSecretKeyRefreshToken());
        if (!decoded) {
            return {
                statusCode: 401,
                message: "Invalid token",
            };
        }
        var access_token_user = (0, create_token_util_1.createToken)({
            customer_id: decoded.customer_id,
        }, configService.getSecretKeyAccessToken(), {
            expiresIn: configService.getExpiresInAccessToken(),
        });
        return {
            statusCode: 201,
            message: "refesh token successfull",
            data: {
                access_token_user: access_token_user,
                EXPIRES_ACCESS_TOKEN: configService.getExpiresInAccessToken(),
            },
        };
    };
    UserService.prototype.loginWithGoogle = function (profile) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var google_id, email, fullname, result, customer_id, account, access_token_user, refresh_token_user, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 10]);
                        google_id = profile.google_id, email = profile.email, fullname = profile.fullname;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT customer_id, auth_method FROM customers WHERE email = $1", [email])];
                    case 1:
                        result = _c.sent();
                        customer_id = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.customer_id;
                        if (!!customer_id) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, index_db_1.query)("BEGIN")];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO customers(email, fullname, auth_method) VALUES($1, $2, 'google') RETURNING customer_id", [email, fullname])];
                    case 3:
                        account = _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO google_account(customer_id, google_id) VALUES($1, $2)", [account.rows[0].customer_id, google_id])];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("COMMIT")];
                    case 5:
                        _c.sent();
                        customer_id = account.rows[0].customer_id;
                        // sau khi đăng ký tài khoản thành công thì tự động tạo cart
                        return [4 /*yield*/, cart_service_1.cartService.createCart(Number(customer_id))];
                    case 6:
                        // sau khi đăng ký tài khoản thành công thì tự động tạo cart
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        // check email này đã đăng nhập dưới 1 hình thức khác google
                        if (result.rows[0] && ((_b = result.rows[0]) === null || _b === void 0 ? void 0 : _b.auth_method) !== "google") {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Email này đã được đăng nhập bằng 1 hình thức khác google",
                                }];
                        }
                        access_token_user = (0, create_token_util_1.createToken)({
                            customer_id: customer_id,
                        }, configService.getSecretKeyAccessToken(), {
                            expiresIn: configService.getExpiresInAccessToken(),
                        });
                        refresh_token_user = (0, create_token_util_1.createToken)({
                            customer_id: customer_id,
                        }, configService.getSecretKeyRefreshToken(), {
                            expiresIn: configService.getExpiresInRefreshToken(),
                        });
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: "Login successfull",
                                data: {
                                    access_token_user: access_token_user,
                                    refresh_token_user: refresh_token_user,
                                    EXPIRES_ACCESS_TOKEN: configService.getExpiresInAccessToken(),
                                    EXPIRES_REFRESH_TOKEN: configService.getExpiresInRefreshToken(),
                                },
                            }];
                    case 8:
                        err_2 = _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("ROLLBACK")];
                    case 9:
                        _c.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: "Have error by user",
                                data: err_2,
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.loginWithFacebook = function (profile) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var facebook_id, email, fullname, result, customer_id, account, access_token_user, refresh_token_user, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 10]);
                        facebook_id = profile.facebook_id, email = profile.email, fullname = profile.fullname;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT customer_id, auth_method FROM customers WHERE email = $1", [email])];
                    case 1:
                        result = _c.sent();
                        customer_id = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.customer_id;
                        if (!!customer_id) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, index_db_1.query)("BEGIN")];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO customers(email, fullname, auth_method) VALUES($1, $2, 'facebook') RETURNING customer_id", [email, fullname])];
                    case 3:
                        account = _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO facebook_account(customer_id, facebook_id) VALUES($1, $2)", [account.rows[0].customer_id, facebook_id])];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("COMMIT")];
                    case 5:
                        _c.sent();
                        customer_id = account.rows[0].customer_id;
                        // sau khi đăng ký thành công thì tự động tạo cart
                        return [4 /*yield*/, cart_service_1.cartService.createCart(Number(customer_id))];
                    case 6:
                        // sau khi đăng ký thành công thì tự động tạo cart
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        // check email này đã đăng nhập dưới 1 hình thức khác facebook
                        if (result.rows[0] && ((_b = result.rows[0]) === null || _b === void 0 ? void 0 : _b.auth_method) !== "facebook") {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Email này đã được đăng nhập bằng 1 hình thức khác facebook",
                                }];
                        }
                        access_token_user = (0, create_token_util_1.createToken)({
                            customer_id: customer_id,
                        }, configService.getSecretKeyAccessToken(), {
                            expiresIn: configService.getExpiresInAccessToken(),
                        });
                        refresh_token_user = (0, create_token_util_1.createToken)({
                            customer_id: customer_id,
                        }, configService.getSecretKeyRefreshToken(), {
                            expiresIn: configService.getExpiresInRefreshToken(),
                        });
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: "Login successfull",
                                data: {
                                    access_token_user: access_token_user,
                                    refresh_token_user: refresh_token_user,
                                    EXPIRES_ACCESS_TOKEN: configService.getExpiresInAccessToken(),
                                    EXPIRES_REFRESH_TOKEN: configService.getExpiresInRefreshToken(),
                                },
                            }];
                    case 8:
                        err_3 = _c.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("ROLLBACK")];
                    case 9:
                        _c.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                message: "Have error by user",
                                data: err_3,
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getProfile = function (customer_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT customer_id, email, fullname, address, phone_number, dob, auth_method FROM customers WHERE customer_id = $1", [customer_id])];
                    case 1:
                        results = _a.sent();
                        if (!results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: 404,
                                    message: "User not exist",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: "Get Profile Successfull",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    // get customers : role admin
    UserService.prototype.getCustomers = function (type, page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, results, n_customers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = (page - 1) * limit;
                        if (!(type === "all")) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, index_db_1.query)("with tmp_4 as (\n            with tmp_3 as (\n            with tmp_2 as (\n                            with tmp as (\n                            select order_id, customer_id, tax, delivery_cost, sum(quantity*net_price) tam_tinh , order_date from orders\n                            join orderlines using(order_id)\n                            group by order_id\n                        )\n                        select tmp.order_id, customer_id, tax, delivery_cost, tam_tinh,   sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date\n                        from tmp\n                        left join coupon_orders cpo on tmp.order_id = cpo.order_id\n                        left join coupons cp on cp.coupon_id = cpo.coupon_id\n                        group by tmp.order_id, customer_id, tax, delivery_cost, tam_tinh, order_date\n                    )\n                    select order_id, customer_id, tax, delivery_cost, tong_giam_gia, order_date, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don\n                    from tmp_2 order by customer_id, order_id\n            ) select customer_id, count(order_id) n_orders , sum(tong_hoa_don) total_spent from tmp_3 \n            group by customer_id)\n            select c.customer_id, COALESCE(n_orders, 0) n_orders, COALESCE(total_spent, 0) total_spent, c.fullname, c.address, c.email, c.dob from tmp_4\n            right join customers c using(customer_id)\n            ORDER BY customer_id\n            OFFSET $1 LIMIT $2\n            ", [offset, limit])];
                    case 1:
                        results = _a.sent();
                        return [4 /*yield*/, this.countCustomers("all")];
                    case 2:
                        n_customers = _a.sent();
                        return [3 /*break*/, 9];
                    case 3:
                        if (!(type === "yes")) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, index_db_1.query)("with tmp_4 as (\n            with tmp_3 as (\n            with tmp_2 as (\n                            with tmp as (\n                            select order_id, customer_id, tax, delivery_cost, sum(quantity*net_price) tam_tinh , order_date from orders\n                            join orderlines using(order_id)\n                            group by order_id\n                        )\n                        select tmp.order_id, customer_id, tax, delivery_cost, tam_tinh,   sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date\n                        from tmp\n                        left join coupon_orders cpo on tmp.order_id = cpo.order_id\n                        left join coupons cp on cp.coupon_id = cpo.coupon_id\n                        group by tmp.order_id, customer_id, tax, delivery_cost, tam_tinh, order_date\n                    )\n                    select order_id, customer_id, tax, delivery_cost, tong_giam_gia, order_date, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don\n                    from tmp_2 order by customer_id, order_id\n            ) select customer_id, count(order_id) n_orders , sum(tong_hoa_don) total_spent from tmp_3 \n            group by customer_id)\n            select c.customer_id, COALESCE(n_orders, 0) n_orders, COALESCE(total_spent, 0) total_spent, c.fullname, c.address, c.email, c.dob from tmp_4\n            join customers c using(customer_id)\n            ORDER BY customer_id\n            OFFSET $1 LIMIT $2\n            ", [offset, limit])];
                    case 4:
                        results = _a.sent();
                        return [4 /*yield*/, this.countCustomers("yes")];
                    case 5:
                        n_customers = _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!(type === "no")) return [3 /*break*/, 9];
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT c.customer_id, c.fullname, c.address, c.email, c.dob, 0 n_orders, 0 total_spent FROM customers c\n                WHERE customer_id NOT IN (select customer_id from orders)\n                ORDER BY customer_id\n                OFFSET $1 LIMIT $2\n            ", [offset, limit])];
                    case 7:
                        results = _a.sent();
                        return [4 /*yield*/, this.countCustomers("no")];
                    case 8:
                        n_customers = _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, {
                            statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                            message: "Get customers successfully",
                            data: {
                                customers: results === null || results === void 0 ? void 0 : results.rows,
                                page: page,
                                limit: limit,
                                totalPage: n_customers && Math.ceil(n_customers / limit),
                                totalCustomer: n_customers,
                            },
                        }];
                }
            });
        });
    };
    UserService.prototype.getCustomerById = function (customer_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM customers WHERE customer_id = $1", [customer_id])];
                    case 1:
                        results = _a.sent();
                        if (!results.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Get customer failed",
                                    data: {},
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get customer successfully",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    UserService.prototype.countCustomers = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(type === "all")) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT count(*) n_customers FROM customers")];
                    case 1:
                        results = _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(type === "yes")) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT count(*) n_customers FROM customers \n                WHERE customer_id IN (select customer_id from orders)")];
                    case 3:
                        // list customers who ordered
                        results = _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(type === "no")) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT count(*) n_customers FROM customers \n                WHERE customer_id NOT IN (select customer_id from orders)")];
                    case 5:
                        results = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, Number(results === null || results === void 0 ? void 0 : results.rows[0].n_customers)];
                }
            });
        });
    };
    UserService.prototype.updateProfileCustomer = function (customer_id, _a) {
        var fullname = _a.fullname, dob = _a.dob, address = _a.address, phone_number = _a.phone_number;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!fullname || !dob || !phone_number || !address) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Please fill in all field",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("UPDATE customers SET fullname = $1, dob = $2, address = $3, phone_number = $4 \n             WHERE customer_id = $5 RETURNING *", [fullname, dob, address, phone_number, customer_id])];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Update profile successfull",
                                data: result.rows[0],
                            }];
                }
            });
        });
    };
    UserService.prototype.sendOtpToEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var checkUser, checkOtp, newOtp, hash, result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT customer_id FROM system_account WHERE email = $1", [email])];
                    case 1:
                        checkUser = _a.sent();
                        if (!checkUser.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "User not exists",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM otp WHERE customer_id = $1", [checkUser.rows[0].customer_id])];
                    case 2:
                        checkOtp = _a.sent();
                        if (!checkOtp.rowCount) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, index_db_1.query)("DELETE FROM otp WHERE otp_id = $1", [
                                checkOtp.rows[0].otp_id,
                            ])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        newOtp = (0, generateOtp_util_1.geneateOtp)();
                        return [4 /*yield*/, bcrypt_1.default.hash(newOtp, 10)];
                    case 5:
                        hash = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO otp VALUES(DEFAULT, $1, $2, $3) RETURNING *", [checkUser.rows[0].customer_id, hash, Date.now() + 30 * 60 * 1000] // 30 minutes
                            )];
                    case 6:
                        result = _a.sent();
                        if (!result.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Create otp failed",
                                }];
                        }
                        return [4 /*yield*/, mailer_service_1.mailerService.sendMail({
                                from: "<No reply> dinhvanluan2k3@gmail.com",
                                subject: "Yêu cầu khôi phục mật khẩu PERFUME LDA",
                                to: email,
                                text: "Hello world?",
                                html: "otp",
                            }, { otp: newOtp })];
                    case 7:
                        data = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Send otp success",
                                data: data,
                            }];
                }
            });
        });
    };
    UserService.prototype.confirmOtpAndSendNewPassword = function (email, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var checkUser, checkOtp, isValid, newPassword, hashNewPassword, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT customer_id FROM system_account WHERE email = $1", [email])];
                    case 1:
                        checkUser = _a.sent();
                        if (!checkUser.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "User not exists",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM otp WHERE customer_id = $1", [checkUser.rows[0].customer_id])];
                    case 2:
                        checkOtp = _a.sent();
                        if (!checkOtp.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "OTP not exist",
                                }];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(otp, checkOtp.rows[0].otp_code)];
                    case 3:
                        isValid = _a.sent();
                        if (!isValid) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_ACCEPTABLE,
                                    message: "Invalid OTP",
                                }];
                        }
                        if (checkOtp.rows[0].expired < Date.now()) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_ACCEPTABLE,
                                    message: "OTP expired",
                                }];
                        }
                        newPassword = (0, generatePasswordRandom_util_1.generatePasswordRandom)(10);
                        return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
                    case 4:
                        hashNewPassword = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("UPDATE system_account SET password = $1 WHERE customer_id = $2", [hashNewPassword, checkUser.rows[0].customer_id])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, mailer_service_1.mailerService.sendMail({
                                from: "<No reply> dinhvanluan2k3@gmail.com",
                                subject: "Yêu cầu đổi mật khẩu PERFUME LDA",
                                to: email,
                                text: "Hello world?",
                                html: "reset_password",
                            }, { newPassword: newPassword })];
                    case 6:
                        data = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Reset password success",
                                data: data,
                            }];
                }
            });
        });
    };
    UserService.prototype.resetPassword = function (customer_id, password, newPassword, confirmNewPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var checkPassword, isMatch, hashNewPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT password FROM system_account WHERE customer_id = $1", [customer_id])];
                    case 1:
                        checkPassword = _a.sent();
                        return [4 /*yield*/, bcrypt_1.default.compare(password, checkPassword.rows[0].password)];
                    case 2:
                        isMatch = _a.sent();
                        if (!isMatch) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Current password not match",
                                }];
                        }
                        if (newPassword !== confirmNewPassword) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "New password not match with confirm password",
                                }];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
                    case 3:
                        hashNewPassword = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("UPDATE system_account SET password = $1 WHERE customer_id = $2", [hashNewPassword, customer_id])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Reset password success",
                            }];
                }
            });
        });
    };
    return UserService;
}());
exports.userService = new UserService();
