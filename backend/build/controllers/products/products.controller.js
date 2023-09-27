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
exports.ProductController = void 0;
var products_service_1 = require("../../services/products/products.service");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var ProductController = /** @class */ (function () {
    function ProductController() {
    }
    ProductController.prototype.listProducts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, limit, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, page = _a.page, limit = _a.limit;
                        return [4 /*yield*/, products_service_1.productService.listProducts(Number(page), Number(limit))];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_1 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                                error: error_1,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getProductByCateId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var category_id, _a, page, limit, data, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        category_id = req.params.category_id;
                        _a = req.query, page = _a.page, limit = _a.limit;
                        return [4 /*yield*/, products_service_1.productService.getProductByCateId(Number(category_id), Number(page), Number(limit))];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_2 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getAllBrand = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, products_service_1.productService.getAllBrand()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getProductPhotoById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var product_id, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        product_id = req.params.product_id;
                        return [4 /*yield*/, products_service_1.productService.getProductPhotoById(Number(product_id))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getProductById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var product_id, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        product_id = req.params.product_id;
                        return [4 /*yield*/, products_service_1.productService.getProductById(Number(product_id))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getProductByTitle = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, page, limit, data, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, title = _a.title, page = _a.page, limit = _a.limit;
                        return [4 /*yield*/, products_service_1.productService.getProductByTitle(title, Number(page), Number(limit))];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_6 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                                error: error_6,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getProductByNewTime = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offset, limit, data, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, offset = _a.offset, limit = _a.limit;
                        return [4 /*yield*/, products_service_1.productService.getProductByNewTime(offset, limit)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_7 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getProductByFilter = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, category_id, page, limit, _b, price, brand, data, error_8;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.query, category_id = _a.category_id, page = _a.page, limit = _a.limit;
                        _b = req.body, price = _b.price, brand = _b.brand;
                        return [4 /*yield*/, products_service_1.productService.getProductByFilter(Number(category_id), brand, price, Number(page), Number(limit))];
                    case 1:
                        data = _c.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_8 = _c.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                                error: error_8,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.createProduct = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, product, photos, data, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, product = _a.product, photos = _a.photos;
                        return [4 /*yield*/, products_service_1.productService.createProduct(product, photos)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_9 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                                error: error_9,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.updateProductById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var product, data, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        product = req.body;
                        return [4 /*yield*/, products_service_1.productService.updateProductById(product)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(data.statusCode).json(data)];
                    case 2:
                        error_10 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                statusCode: httpStatusCode_config_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
                                message: "Server Error",
                                error: error_10,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProductController;
}());
exports.ProductController = ProductController;
