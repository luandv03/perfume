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
exports.feedbackService = void 0;
var index_db_1 = require("../../db/index.db");
var httpStatusCode_config_1 = require("../../configs/httpStatusCode.config");
var FeedbackService = /** @class */ (function () {
    function FeedbackService() {
    }
    FeedbackService.prototype.createFeedback = function (feedback) {
        return __awaiter(this, void 0, void 0, function () {
            var customer_id, product_id, content, stars, checkBought, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customer_id = feedback.customer_id, product_id = feedback.product_id, content = feedback.content, stars = feedback.stars;
                        return [4 /*yield*/, this.checkCustomerBoughtProuduct(product_id, customer_id)];
                    case 1:
                        checkBought = _a.sent();
                        if (!checkBought) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_ACCEPTABLE,
                                    message: "You haven't already bought this product, so you can't feedback it",
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("INSERT INTO feedbacks\n            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)\n            ON CONFLICT ON CONSTRAINT feedbacks_pkey\n            DO UPDATE SET content = $3, \n            stars = $4, updated_at = CURRENT_TIMESTAMP RETURNING *", [product_id, customer_id, content, stars])];
                    case 2:
                        results = _a.sent();
                        if (!results.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Create feedback failed",
                                    data: results.rows[0],
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Create feedback success",
                                data: results.rows[0],
                            }];
                }
            });
        });
    };
    // async updateFeedback(feedback: FeedbackType): Promise<ResponseType<any>> {
    //     const { customer_id, product_id, content, stars } = feedback;
    //     const results = await query(
    //         `UPDATE feedbacks
    //         SET content = $1, stars = $2, updated_at = CURRENT_TIMESTAMP
    //         WHERE customer_id = $3 AND product_id = $4
    //         RETURNING *`,
    //         [content, stars, customer_id, product_id]
    //     );
    //     if (!results.rows.length) {
    //         return {
    //             statusCode: HttpStatusCode.BAD_REQUEST,
    //             message: "Update feedback failed",
    //             data: results.rows[0],
    //         };
    //     }
    //     return {
    //         statusCode: HttpStatusCode.OK,
    //         message: "Update feedback success",
    //         data: results.rows[0],
    //     };
    // }
    FeedbackService.prototype.removeFeedback = function (customer_id, product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var feedbackFound, deletedFeedback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT customer_id, product_id FROM feedbacks WHERE customer_id = $1 AND product_id = $2", [customer_id, product_id])];
                    case 1:
                        feedbackFound = _a.sent();
                        if (!feedbackFound.rows.length) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.NOT_FOUND,
                                    message: "Feedback not exist!",
                                    data: feedbackFound.rows[0],
                                }];
                        }
                        return [4 /*yield*/, (0, index_db_1.query)("DELETE FROM feedbacks WHERE customer_id = $1 AND product_id = $2 ", [customer_id, product_id])];
                    case 2:
                        deletedFeedback = _a.sent();
                        if (!deletedFeedback.rowCount) {
                            return [2 /*return*/, {
                                    statusCode: httpStatusCode_config_1.HttpStatusCode.BAD_REQUEST,
                                    message: "Delete feedback failed!",
                                }];
                        }
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Delete feedback success!",
                            }];
                }
            });
        });
    };
    FeedbackService.prototype.getFeedbackByProductId = function (_a) {
        var product_id = _a.product_id, page = _a.page, limit = _a.limit;
        return __awaiter(this, void 0, void 0, function () {
            var offset, feedbacks, totalFeedback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        offset = (page - 1) * limit;
                        return [4 /*yield*/, (0, index_db_1.query)("SELECT * FROM (\n            SELECT f.*, c.fullname FROM feedbacks f\n            JOIN customers c USING(customer_id)\n             WHERE product_id = $1 OFFSET $2 LIMIT $3) tmp\n             ORDER BY customer_id\n             ", [product_id, offset, limit])];
                    case 1:
                        feedbacks = _b.sent();
                        return [4 /*yield*/, this.countFeedbackCountByProductId(product_id)];
                    case 2:
                        totalFeedback = _b.sent();
                        return [2 /*return*/, {
                                statusCode: httpStatusCode_config_1.HttpStatusCode.OK,
                                message: "Get feedback success",
                                data: {
                                    feedbackList: feedbacks.rows,
                                    pageNumber: page,
                                    feedbackPerPage: limit,
                                    totalPage: Math.ceil(totalFeedback / limit),
                                    totalFeedback: Number(totalFeedback),
                                },
                            }];
                }
            });
        });
    };
    FeedbackService.prototype.countFeedbackCountByProductId = function (product_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("SELECT count(*) AS feedback_number FROM feedbacks WHERE product_id = $1", [product_id])];
                    case 1:
                        results = _b.sent();
                        if (results.rowCount) {
                            return [2 /*return*/, (_a = results.rows[0]) === null || _a === void 0 ? void 0 : _a.feedback_number];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FeedbackService.prototype.checkCustomerBoughtProuduct = function (product_id, customer_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, index_db_1.query)("select customer_id from orders\n            join orderlines using(order_id)\n            where product_id = $1 and customer_id = $2 and status = 'done'", [product_id, customer_id])];
                    case 1:
                        results = _a.sent();
                        if (!results.rows.length)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return FeedbackService;
}());
exports.feedbackService = new FeedbackService();
