"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
var v1_routes_1 = __importDefault(require("./v1/v1.routes"));
router.use("/api", v1_routes_1.default);
exports.default = router;
