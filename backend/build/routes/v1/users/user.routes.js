"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var passport_google_oauth20_1 = require("passport-google-oauth20");
var passport_facebook_1 = require("passport-facebook");
var user_controller_1 = require("../../../controllers/users/user.controller");
var user_auth_middleware_1 = require("../../../middlewares/user-auth.middleware");
var configService_config_1 = require("../../../configs/configService.config");
var configService = new configService_config_1.ConfigService();
var userRoutes = (0, express_1.Router)();
var userController = new user_controller_1.UserController();
/// 1.system account
// register
userRoutes.post("/auth/customer/register", userController.register);
//login
userRoutes.post("/auth/customer/login", userController.login);
//refresh token user
userRoutes.get("/auth/customer/refresh_token", userController.refreshToken);
//get profile
userRoutes.get("/auth/customer/profile", user_auth_middleware_1.userAuthMiddleware, userController.getProfile);
//logout
userRoutes.post("/auth/customer/logout", user_auth_middleware_1.userAuthMiddleware, userController.logout);
//2. google login
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: configService.getGoogleClientId(),
    clientSecret: configService.getGoogleClientSecret(),
    callbackURL: "".concat(configService.getClientDomain(), "/api/v1/auth/google/callback"),
}, function (accessToken, refreshToken, profile, done) {
    // profile trong done chính là thông tin sẽ được lưu lại trong hàm serializeUser
    // kiểm tra email này đã tồn tại trong hệ thống chưa, nếu rồi thì lấy ra customer_id theo google của nó
    var id = profile.id, displayName = profile.displayName;
    var email = profile.emails && profile.emails[0].value;
    return done(null, { id: id, displayName: displayName, email: email });
}));
//3. facebook login
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: configService.getFacebookClientId(),
    clientSecret: configService.getFacebookClientSecret(),
    callbackURL: "".concat(configService.getClientDomain(), "/api/v1/auth/facebook/callback"),
    profileFields: ["id", "emails", "displayName"],
}, function (accessToken, refreshToken, profile, done) {
    // profile trong done chính là thông tin sẽ được lưu lại trong hàm serializeUser
    // kiểm tra email này đã tồn tại trong hệ thống chưa, nếu rồi thì lấy ra customer_id theo google của nó
    var id = profile.id, displayName = profile.displayName;
    var email = profile.emails && profile.emails[0].value;
    return done(null, { id: id, displayName: displayName, email: email });
}));
passport_1.default.serializeUser(function (user, done) {
    //user lấy từ cái profile ở trên
    done(null, user);
});
passport_1.default.deserializeUser(function (obj, done) {
    // done(null, obj);
});
// google login route
userRoutes.get("/auth/google/login", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Sau khi login google success
userRoutes.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/google/login-failure",
}), userController.loginWithGoolge);
// facebok login route
userRoutes.get("/auth/facebook/login", passport_1.default.authenticate("facebook"));
// Sau khi login facebook success
userRoutes.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", {
    failureRedirect: "/facebook/login-failure",
}), userController.loginWithFacebook);
// get customers: role admin
// ?type=all&page=...&limit=...
// all: both customers who bougth and no buy
// yes: customers who bougth
// no: customers who no buy
userRoutes.get("/customer/view", userController.getCustomers);
// get customer by id: role admin
userRoutes.get("/customer/detail/:customer_id", userController.getCustomerById);
//update profile
userRoutes.patch("/customer/profile/update", user_auth_middleware_1.userAuthMiddleware, userController.updateProfile);
//send otp to email
userRoutes.post("/customer/forgot_password/otp/send", userController.sendOtpToEmail);
//confirm otp and reset password
userRoutes.post("/customer/forgot_password/otp/confirm", userController.confirmOtpAndSendNewPassword);
// reset new password
userRoutes.patch("/customer/password/reset", user_auth_middleware_1.userAuthMiddleware, userController.resetPassword);
exports.default = userRoutes;
