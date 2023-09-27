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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
var index_db_1 = require("../../db/index.db");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var ProductService = /** @class */ (function () {
    function ProductService() {
    }
    // list in admin page
    ProductService.prototype.listProducts = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var totalProducts, offset, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.countProducts()];
                    case 1:
                        totalProducts = _a.sent();
                        offset = (page - 1) * limit;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT product_id, category_name, title, description , brand, year_publish, \n            volume, price, discount, quantity, created_at\n            FROM products JOIN categories using(category_id) OFFSET $1 LIMIT $2", [offset, limit])];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get products successfully",
                                data: {
                                    products: results.rows,
                                    page: page,
                                    total: limit,
                                    totalPage: Math.ceil(totalProducts / limit),
                                    totalProducts: totalProducts,
                                },
                            }];
                }
            });
        });
    };
    ProductService.prototype.getProductByCateId = function (category_id, page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, results, totalProductRes, totalProduct;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = (page - 1) * limit;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT product_id, title, price, discount, volume, brand, year_publish, description \n            FROM products  JOIN categories USING(category_id)\n            WHERE category_id = $1 \n            OFFSET $2 LIMIT $3", [category_id, offset, limit])];
                    case 1:
                        results = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT count(*) as total_product FROM products WHERE category_id = $1", [category_id])];
                    case 2:
                        totalProductRes = _a.sent();
                        totalProduct = Number(totalProductRes.rows[0].total_product);
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get Products Success",
                                data: {
                                    products: results.rows,
                                    page: page,
                                    total: limit,
                                    totalPage: Math.ceil(totalProduct / limit),
                                    totalProduct: totalProduct,
                                },
                            }];
                }
            });
        });
    };
    ProductService.prototype.getAllBrand = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT distinct brand FROM products")];
                    case 1:
                        results = _a.sent();
                        if (!results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Brand Not Found",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get All Brand Success",
                                data: results.rows,
                            }];
                }
            });
        });
    };
    ProductService.prototype.getProductPhotoById = function (product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT product_photo_id, product_photo_url FROM product_photos \n            WHERE product_id = $1 ", [product_id])];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get Product Photo Success",
                                data: results.rows,
                            }];
                }
            });
        });
    };
    ProductService.prototype.getProductById = function (product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM products WHERE product_id = $1", [product_id])];
                    case 1:
                        results = _a.sent();
                        if (!results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Product not found",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get Product Success",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    ProductService.prototype.getProductByTitle = function (title, page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var totalProducts, offset, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT count(product_id) number_of_products\n            FROM products WHERE title ILIKE '%' || $1 || '%'", [title])];
                    case 1:
                        totalProducts = _a.sent();
                        offset = (page - 1) * limit;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT product_id, category_name, title, description , brand, year_publish, \n            volume, price, discount, quantity, created_at\n            FROM products JOIN categories using(category_id) \n            WHERE title ILIKE '%' || $1 || '%' OFFSET $2 LIMIT $3 ", [title, offset, limit])];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get Product Success",
                                data: {
                                    products: results.rows,
                                    page: page,
                                    total: limit,
                                    totalPage: Math.ceil(totalProducts.rows[0].number_of_products / limit),
                                    totalProducts: Number(totalProducts.rows[0].number_of_products),
                                },
                            }];
                }
            });
        });
    };
    ProductService.prototype.getProductByNewTime = function (offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT product_id, title, price, discount \n            FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2 ", [limit, offset])];
                    case 1:
                        results = _a.sent();
                        if (!results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Product not found",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get Product Success",
                                data: results.rows,
                            }];
                }
            });
        });
    };
    // "Giá dưới 500.0000"; 0 - 500.000
    // "500.000đ - 1.000.000đ";
    // "1.000.000đ - 5.000.000đ";
    // "Giá trên 10.000.000đ";
    ProductService.prototype.getProductByFilter = function (category_id, brand, price, page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var tmp, brand_filter, prices, priceArr, price_filter, query_filter, count_filter, offset, results, resCountFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmp = brand.map(function (item) { return "'".concat(item, "'"); });
                        brand_filter = brand.length <= 0 ? "" : "(".concat(__spreadArray([], tmp, true), ")");
                        prices = price.length <= 0 ? [] : price;
                        priceArr = [];
                        price.map(function (item) {
                            // 0 - 5.000.000 : tức là không có cận dưới (<=)
                            if (!item[0]) {
                                return priceArr.push("(price <= ".concat(item[1], ")"));
                            }
                            // 5.000.000 - 0 : tức là không có cận trên (>=)
                            if (!item[1]) {
                                return priceArr.push("(price >= ".concat(item[0], ")"));
                            }
                            return priceArr.push("(price >= ".concat(item[0], " and price <= ").concat(item[1], ")"));
                        });
                        price_filter = !prices.length ? "" : "(".concat(priceArr.join(" OR "), ")");
                        query_filter = "";
                        count_filter = "";
                        offset = (page - 1) * limit;
                        if (!brand_filter.length && !price_filter.length) {
                            query_filter = "SELECT product_id, title, description, cast(price as int), cast(discount as int), volume, brand, quantity, created_at FROM products WHERE category_id = ".concat(category_id, " OFFSET ").concat(offset, " LIMIT ").concat(limit);
                            count_filter = "SELECT count(*) n_product FROM products WHERE category_id = ".concat(category_id);
                        }
                        else if (!brand_filter.length) {
                            query_filter = "SELECT product_id, title, description, cast(price as int), cast(discount as int), volume, brand, quantity, created_at FROM products WHERE category_id = ".concat(category_id, " AND ").concat(price_filter, " OFFSET ").concat(offset, " LIMIT ").concat(limit);
                            count_filter = "SELECT count(*) n_product FROM products WHERE category_id=".concat(category_id, " AND ").concat(price_filter, " ");
                        }
                        else if (!price_filter.length) {
                            query_filter = "SELECT product_id, title, description, cast(price as int), cast(discount as int), volume, brand, quantity, created_at FROM products WHERE category_id=".concat(category_id, " AND brand IN ").concat(brand_filter, " OFFSET ").concat(offset, " LIMIT ").concat(limit);
                            count_filter = "SELECT count(*) n_product FROM products WHERE category_id=".concat(category_id, " AND brand IN ").concat(brand_filter, " ");
                        }
                        else {
                            query_filter = "SELECT product_id, title, description, cast(price as int), cast(discount as int), volume, brand, quantity, created_at FROM products WHERE category_id=".concat(category_id, " AND brand IN ").concat(brand_filter, " and ").concat(price_filter, " OFFSET ").concat(offset, " LIMIT ").concat(limit);
                            count_filter = "SELECT count(*) n_product FROM products WHERE category_id=".concat(category_id, " AND brand IN ").concat(brand_filter, " and ").concat(price_filter, " ");
                        }
                        return [4 /*yield*/, (0, index_db_1.query)(query_filter)];
                    case 1:
                        results = _a.sent();
                        return [4 /*yield*/, (0, index_db_1.query)(count_filter)];
                    case 2:
                        resCountFilter = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get products success",
                                data: {
                                    products: results.rows,
                                    page: page,
                                    total: limit,
                                    totalPage: Math.ceil(resCountFilter.rows[0].n_product / limit),
                                    totalProduct: Number(resCountFilter.rows[0].n_product),
                                },
                            }];
                }
            });
        });
    };
    //update product by id
    ProductService.prototype.updateProductById = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var product_id, title, description, category_id, volume, price, quantity, year_publish, brand, discount, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        product_id = product.product_id, title = product.title, description = product.description, category_id = product.category_id, volume = product.volume, price = product.price, quantity = product.quantity, year_publish = product.year_publish, brand = product.brand, discount = product.discount;
                        return [4 /*yield*/, (0, index_db_1.query)("UPDATE products SET title = $1, category_id = $2, \n            brand = $3, year_publish = $4, volume = $5, price = $6, discount = $7, quantity = $8,\n            description = $9, updated_at = current_date\n            WHERE product_id = $10  RETURNING *\n        ", [
                                title,
                                category_id,
                                brand,
                                year_publish,
                                volume,
                                Number(price),
                                Number(discount),
                                quantity,
                                description,
                                product_id,
                            ])];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Update successfull",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    // create product
    ProductService.prototype.createProduct = function (product, photos) {
        return __awaiter(this, void 0, void 0, function () {
            var title, description, category_id, volume, price, quantity, year_publish, brand, discount, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        title = product.title, description = product.description, category_id = product.category_id, volume = product.volume, price = product.price, quantity = product.quantity, year_publish = product.year_publish, brand = product.brand, discount = product.discount;
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO products VALUES (DEFAULT, $1, $2,$3,$4,$5,$6,$7,$8,$9, current_date, current_date) RETURNING *", [
                                category_id,
                                title,
                                description,
                                brand,
                                year_publish,
                                volume,
                                price,
                                discount,
                                quantity,
                            ])];
                    case 1:
                        results = _a.sent();
                        if (!results.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Create product failed",
                                    data: results.rows[0],
                                }];
                        }
                        return [4 /*yield*/, this.createProductPhoto(photos, results.rows[0].product_id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Create product successfull",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    //create product image
    ProductService.prototype.createProductPhoto = function (product_photos, product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = product_photos.map(function (photo) {
                            return (0, index_db_1.query)("INSERT INTO product_photos \n             VALUES (DEFAULT, $1, $2, $3) RETURNING *", [product_id, photo.secure_url, photo.public_id]);
                        });
                        return [4 /*yield*/, Promise.all(promises)
                                .then(function (res) { return res; })
                                .catch(function (err) { return err; })];
                    case 1:
                        results = _a.sent();
                        /// neu thanh cong se tra ve 1 mang result cua moi cau query
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Create product photo successfull",
                                data: results.map(function (item) { return item.rows[0]; }),
                            }];
                }
            });
        });
    };
    // count products in store
    ProductService.prototype.countProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT count(product_id) number_of_products FROM products")];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, Number(results.rows[0].number_of_products)];
                }
            });
        });
    };
    return ProductService;
}());
exports.productService = new ProductService();
