"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var configService_config_1 = require("../configs/configService.config");
var configService = new configService_config_1.ConfigService();
var userAuthMiddleware = function (req, res, next) {
    var access_token_user = req.cookies.access_token_user;
    if (!access_token_user) {
        return res
            .status(401)
            .json({ statusCode: 401, message: "Not access token" });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(access_token_user, configService.getSecretKeyAccessToken());
        if (decoded) {
            res.locals.data = decoded;
        }
        return next();
    }
    catch (err) {
        return res.status(401).send({
            statusCode: 401,
            message: "Invalid Token",
            err: err,
        });
    }
};
exports.userAuthMiddleware = userAuthMiddleware;
