"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var env = process.env;
exports.SECRET_KEY = env.SECRET_KEY;
