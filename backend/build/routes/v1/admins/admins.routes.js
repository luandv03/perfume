"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var adminRoutes = (0, express_1.Router)();
var auth_middleware_1 = require("../../../middlewares/auth.middleware");
var authorization_middleware_1 = require("../../../middlewares/authorization.middleware");
var admin_controller_1 = require("../../../controllers/admins/admin.controller");
var adminController = new admin_controller_1.AdminController();
// get all admins accounts
adminRoutes.get("/admin/account/view", auth_middleware_1.authMiddleware, authorization_middleware_1.authorizeMiddleware, adminController.getAdmins);
// register account
adminRoutes.post("/admin/account/register", auth_middleware_1.authMiddleware, authorization_middleware_1.authorizeMiddleware, adminController.register);
// get profile
adminRoutes.get("/admin/account/get_profile", auth_middleware_1.authMiddleware, adminController.getProfile);
//login account
adminRoutes.post("/admin/account/login", adminController.login);
//refresh token account
adminRoutes.get("/admin/account/refresh_token", adminController.refreshToken);
//logout
adminRoutes.post("/admin/account/logout", auth_middleware_1.authMiddleware, adminController.logout);
exports.default = adminRoutes;
