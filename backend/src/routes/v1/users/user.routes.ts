import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { UserController } from "../../../controllers/users/user.controller";
import { userAuthMiddleware } from "../../../middlewares/user-auth.middleware";

import { ConfigService } from "../../../configs/configService.config";
const configService = new ConfigService();

const userRoutes: Router = Router();
const userController: UserController = new UserController();

/// system account
//login
userRoutes.post("/auth/customer/login", userController.login);

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

// google login
passport.use(
    new GoogleStrategy(
        {
            clientID: configService.getGoogleClientId(),
            clientSecret: configService.getGoogleClientSecret(),
            callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
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

export default userRoutes;
