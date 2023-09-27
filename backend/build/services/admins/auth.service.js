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
exports.adminService = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var index_db_1 = require("../../db/index.db");
var configService_config_1 = require("../../configs/configService.config");
var create_token_util_1 = require("../../utils/create_token.util");
var configService = new configService_config_1.ConfigService();
var AdminService = /** @class */ (function () {
    function AdminService() {
    }
    AdminService.prototype.getAdmins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT admin_id, username, phone_number, role FROM admins")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    AdminService.prototype.loginAccount = function (account) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var username, password, result, isMatch, access_token, refresh_token, err_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 3, , 4]);
                        username = account.username, password = account.password;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM admins WHERE username = $1", [username])];
                    case 1:
                        result = _f.sent();
                        // rowCount: số lượng bản ghi trả về từ câu truy vấn
                        if (!result.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: 404,
                                    message: "Not found",
                                }];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(password, (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.password)];
                    case 2:
                        isMatch = _f.sent();
                        if (!isMatch) {
                            return [2 /*return*/, {
                                    statusCode: 404,
                                    message: "Username or Password not matches",
                                }];
                        }
                        access_token = (0, create_token_util_1.createToken)({
                            admin_id: (_b = result.rows[0]) === null || _b === void 0 ? void 0 : _b.admin_id,
                            role: (_c = result.rows[0]) === null || _c === void 0 ? void 0 : _c.role,
                        }, configService.getSecretKeyAccessToken(), {
                            expiresIn: configService.getExpiresInAccessToken(),
                        });
                        refresh_token = (0, create_token_util_1.createToken)({
                            admin_id: (_d = result.rows[0]) === null || _d === void 0 ? void 0 : _d.admin_id,
                            role: (_e = result.rows[0]) === null || _e === void 0 ? void 0 : _e.role,
                        }, configService.getSecretKeyRefreshToken(), {
                            expiresIn: configService.getExpiresInRefreshToken(),
                        });
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: "Login successfull",
                                data: {
                                    access_token: access_token,
                                    refresh_token: refresh_token,
                                    EXPIRES_ACCESS_TOKEN: configService.getExpiresInAccessToken(),
                                    EXPIRES_REFRESH_TOKEN: configService.getExpiresInRefreshToken(),
                                },
                            }];
                    case 3:
                        err_1 = _f.sent();
                        return [2 /*return*/, err_1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminService.prototype.registerAccount = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var username, password, phone_number, role, results, hashPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = account.username, password = account.password, phone_number = account.phone_number, role = account.role;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM admins WHERE username = $1", [username])];
                    case 1:
                        results = _a.sent();
                        if (results.rows[0]) {
                            return [2 /*return*/, {
                                    statusCode: 406,
                                    message: "Username already exist",
                                }];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 2:
                        hashPassword = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO admins(username, password, phone_number, role) VALUES ($1, $2, $3, $4) ", [username, hashPassword, phone_number, role])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: "You have registed successfully",
                            }];
                }
            });
        });
    };
    AdminService.prototype.refreshTokenService = function (token) {
        var decoded = jsonwebtoken_1.default.verify(token, configService.getSecretKeyRefreshToken());
        if (!decoded) {
            return {
                statusCode: 401,
                message: "Invalid token",
            };
        }
        var access_token = (0, create_token_util_1.createToken)({
            admin_id: decoded.admin_id,
            role: decoded.role,
        }, configService.getSecretKeyAccessToken(), {
            expiresIn: configService.getExpiresInAccessToken(),
        });
        return {
            statusCode: 201,
            message: "refesh token successfull",
            data: {
                access_token: access_token,
                EXPIRES_ACCESS_TOKEN: configService.getExpiresInAccessToken(),
            },
        };
    };
    AdminService.prototype.getProfile = function (admin_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT admin_id, username, role FROM admins WHERE admin_id = $1", [admin_id])];
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
    return AdminService;
}());
exports.adminService = new AdminService();
