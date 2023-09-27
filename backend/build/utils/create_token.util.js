"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createToken(data, secret_key, expiresIn) {
    var access_token = jsonwebtoken_1.default.sign(data, secret_key, expiresIn);
    return access_token;
}
exports.createToken = createToken;
