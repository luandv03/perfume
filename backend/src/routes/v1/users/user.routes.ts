import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";

import { UserController } from "../../../controllers/users/user.controller";
import { userAuthMiddleware } from "../../../middlewares/user-auth.middleware";

import { ConfigService } from "../../../configs/configService.config";
import { authMiddleware } from "../../../middlewares/auth.middleware";
const configService = new ConfigService();

const userRoutes: Router = Router();
const userController: UserController = new UserController();

/// 1.system account
// register
userRoutes.post("/auth/customer/register", userController.register);

//login
userRoutes.post("/auth/customer/login", userController.login);

//refresh token user
userRoutes.get("/auth/customer/refresh_token", userController.refreshToken);

//get profile
userRoutes.get(
    "/auth/customer/profile",
    userAuthMiddleware,
    userController.getProfile
);

//logout
userRoutes.post(
    "/auth/customer/logout",
    userAuthMiddleware,
    userController.logout
);

//2. google login
passport.use(
    new GoogleStrategy(
        {
            clientID: configService.getGoogleClientId(),
            clientSecret: configService.getGoogleClientSecret(),
            callbackURL: `${configService.getServerDomain()}/api/v1/auth/google/callback`,
        },
        function (accessToken, refreshToken, profile, done) {
            // profile trong done chính là thông tin sẽ được lưu lại trong hàm serializeUser
            // kiểm tra email này đã tồn tại trong hệ thống chưa, nếu rồi thì lấy ra customer_id theo google của nó
            const { id, displayName } = profile;
            const email = profile.emails && profile.emails[0].value;

            return done(null, { id, displayName, email });
        }
    )
);

//3. facebook login
passport.use(
    new FacebookStrategy(
        {
            clientID: configService.getFacebookClientId(),
            clientSecret: configService.getFacebookClientSecret(),
            callbackURL: `${configService.getServerDomain()}/api/v1/auth/facebook/callback`,
            profileFields: ["id", "emails", "displayName"],
        },
        function (accessToken, refreshToken, profile, done) {
            // profile trong done chính là thông tin sẽ được lưu lại trong hàm serializeUser
            // kiểm tra email này đã tồn tại trong hệ thống chưa, nếu rồi thì lấy ra customer_id theo google của nó
            const { id, displayName } = profile;
            const email = profile.emails && profile.emails[0].value;

            return done(null, { id, displayName, email });
        }
    )
);

passport.serializeUser(function (user, done) {
    //user lấy từ cái profile ở trên
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    // done(null, obj);
});

// google login route
userRoutes.get(
    "/auth/google/login",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Sau khi login google success
userRoutes.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/google/login-failure",
    }),
    userController.loginWithGoolge
);

// facebok login route
userRoutes.get("/auth/facebook/login", passport.authenticate("facebook"));

// Sau khi login facebook success
userRoutes.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/facebook/login-failure",
    }),
    userController.loginWithFacebook
);

// get customers: role admin
// ?type=all&page=...&limit=...
// all: both customers who bougth and no buy
// yes: customers who bougth
// no: customers who no buy
userRoutes.get("/customer/view", userController.getCustomers);

// get customer by id: role admin
userRoutes.get("/customer/detail/:customer_id", userController.getCustomerById);

//update profile
userRoutes.patch(
    "/customer/profile/update",
    userAuthMiddleware,
    userController.updateProfile
);

//send otp to email
userRoutes.post(
    "/customer/forgot_password/otp/send",
    userController.sendOtpToEmail
);

//confirm otp and reset password
userRoutes.post(
    "/customer/forgot_password/otp/confirm",
    userController.confirmOtpAndSendNewPassword
);

// reset new password
userRoutes.patch(
    "/customer/password/reset",
    userAuthMiddleware,
    userController.resetPassword
);

// get recently customer
userRoutes.get(
    "/customer/recently/view",
    authMiddleware,
    userController.getRecentlyCustomer
);

export default userRoutes;
