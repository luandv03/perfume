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
exports.UserController = void 0;
var user_service_1 = require("../../services/users/user.service");
// import { IRegisterAccount } from "../../types/admins/register-account.type";
var handle_error_dto_util_1 = require("../../utils/handle_error_dto.util");
var user_dto_1 = require("../../dtos/users/user.dto");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var configService_config_1 = require("../../configs/configService.config");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, fullname, password, phone_number, address, email, dob, data, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, fullname = _a.fullname, password = _a.password, phone_number = _a.phone_number, address = _a.address, email = _a.email, dob = _a.dob;
                        return [4 /*yield*/, user_service_1.userService.registerAccount({
                                fullname: fullname,
                                password: password,
                                phone_number: phone_number,
                                email: email,
                                dob: dob,
                                address: address,
                            })];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        err_1 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Internal Server Error",
                                err: err_1,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, errorResult, data, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, (0, handle_error_dto_util_1.handleErrorDto)({ email: email, password: password }, new user_dto_1.LoginUserAccountDto())];
                    case 1:
                        errorResult = _b.sent();
                        if (errorResult.statusCode) {
                            return [2 /*return*/, res.status(errorResult.statusCode).json(errorResult)];
                        }
                        return [4 /*yield*/, user_service_1.userService.loginAccount({
                                email: email,
                                password: password,
                            })];
                    case 2:
                        data = _b.sent();
                        if (data.statusCode === 200) {
                            res.cookie("access_token_user", data.data.access_token_user, {
                                httpOnly: true,
                                maxAge: data.data.EXPIRES_ACCESS_TOKEN * 1000,
                                domain: configService_config_1.configService.getDomain(),
                            });
                            res.cookie("refresh_token_user", data.data.refresh_token_user, {
                                httpOnly: true,
                                maxAge: data.data.EXPIRES_REFRESH_TOKEN * 1000,
                                domain: configService_config_1.configService.getDomain(),
                            });
                        }
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 3:
                        err_2 = _b.sent();
                        console.log(err_2);
                        res.status(500).json({ err: err_2 });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.refreshToken = function (req, res) {
        try {
            var refresh_token = req.cookies.refresh_token_user;
            if (!refresh_token) {
                return res.status(403).json({
                    statusCode: 403,
                    message: "Refresh token not valid",
                });
            }
            var data = user_service_1.userService.refreshTokenService(refresh_token);
            data.statusCode === 201 &&
                res.cookie("access_token_user", data.data.access_token_user, {
                    httpOnly: true,
                    maxAge: data.data.EXPIRES_ACCESS_TOKEN * 1000,
                    domain: configService_config_1.configService.getDomain(),
                });
            res.status(data.statusCode).json(data);
        }
        catch (err) {
            res.status(400).json({
                error: err,
            });
        }
    };
    UserController.prototype.loginWithGoolge = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, email, displayName, data, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.user, id = _a.id, email = _a.email, displayName = _a.displayName;
                        return [4 /*yield*/, user_service_1.userService.loginWithGoogle({
                                google_id: id,
                                email: email,
                                fullname: displayName,
                            })];
                    case 1:
                        data = _b.sent();
                        data.statusCode === 200 &&
                            res.cookie("access_token_user", data.data.access_token_user, {
                                httpOnly: true,
                                maxAge: data.data.EXPIRES_ACCESS_TOKEN * 1000,
                                sameSite: "none",
                                secure: true,
                                domain: configService_config_1.configService.getDomain(),
                            }) &&
                            res.cookie("refresh_token_user", data.data.refresh_token_user, {
                                httpOnly: true,
                                maxAge: data.data.EXPIRES_REFRESH_TOKEN * 1000,
                                sameSite: "none",
                                secure: true,
                                domain: configService_config_1.configService.getDomain(),
                            });
                        res.redirect("http://localhost:5173/login/success");
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: 500,
                                message: err_3,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.loginWithFacebook = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, email, displayName, data, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.user, id = _a.id, email = _a.email, displayName = _a.displayName;
                        return [4 /*yield*/, user_service_1.userService.loginWithFacebook({
                                facebook_id: id,
                                email: email,
                                fullname: displayName,
                            })];
                    case 1:
                        data = _b.sent();
                        data.statusCode === 200 &&
                            res.cookie("access_token_user", data.data.access_token_user, {
                                httpOnly: true,
                                maxAge: data.data.EXPIRES_ACCESS_TOKEN * 1000,
                                sameSite: "none",
                                secure: true,
                                domain: configService_config_1.configService.getDomain(),
                            }) &&
                            res.cookie("refresh_token_user", data.data.refresh_token_user, {
                                httpOnly: true,
                                maxAge: data.data.EXPIRES_REFRESH_TOKEN * 1000,
                                sameSite: "none",
                                secure: true,
                                domain: configService_config_1.configService.getDomain(),
                            });
                        res.redirect("".concat(configService_config_1.configService.getClientDomain(), "/login/success"));
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: 500,
                                message: err_4,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.logout = function (req, res) {
        try {
            res.clearCookie("access_token_user");
            res.clearCookie("refresh_token_user");
            return res.status(200).json({
                statusCode: 200,
                message: "Logout successfully",
            });
        }
        catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err,
            });
        }
    };
    UserController.prototype.getProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, data, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        customer_id = res.locals.data.customer_id;
                        return [4 /*yield*/, user_service_1.userService.getProfile(customer_id)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        err_5 = _a.sent();
                        res.status(500).json({
                            statusCode: 500,
                            message: err_5,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getCustomers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, type, page, limit, data, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, type = _a.type, page = _a.page, limit = _a.limit;
                        return [4 /*yield*/, user_service_1.userService.getCustomers(type, Number(page), Number(limit))];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        err_6 = _b.sent();
                        res.status(500).json({
                            statusCode: 500,
                            message: err_6,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getCustomerById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, data, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        customer_id = req.params.customer_id;
                        return [4 /*yield*/, user_service_1.userService.getCustomerById(Number(customer_id))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        err_7 = _a.sent();
                        res.status(500).json({
                            statusCode: 500,
                            message: err_7,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, _a, fullname, dob, address, phone_number, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        customer_id = res.locals.data.customer_id;
                        _a = req.body, fullname = _a.fullname, dob = _a.dob, address = _a.address, phone_number = _a.phone_number;
                        return [4 /*yield*/, user_service_1.userService.updateProfileCustomer(customer_id, {
                                fullname: fullname,
                                dob: dob,
                                address: address,
                                phone_number: phone_number,
                            })];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_1 = _b.sent();
                        res.status(httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                            statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                            message: "Internal server error",
                            error: error_1,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.sendOtpToEmail = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = req.body.email;
                        return [4 /*yield*/, user_service_1.userService.sendOtpToEmail(email)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_2 = _a.sent();
                        res.status(httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                            statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                            message: "Internal server error",
                            error: error_2,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.confirmOtpAndSendNewPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, otp, data, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, email = _a.email, otp = _a.otp;
                        return [4 /*yield*/, user_service_1.userService.confirmOtpAndSendNewPassword(email, otp)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_3 = _b.sent();
                        res.status(httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                            statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                            message: "Internal server error",
                            error: error_3,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, _a, password, newPassword, confirmNewPassword, data, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        customer_id = res.locals.data.customer_id;
                        _a = req.body, password = _a.password, newPassword = _a.newPassword, confirmNewPassword = _a.confirmNewPassword;
                        return [4 /*yield*/, user_service_1.userService.resetPassword(customer_id, password, newPassword, confirmNewPassword)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_4 = _b.sent();
                        res.status(httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                            statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                            message: "Internal server error",
                            error: error_4,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
