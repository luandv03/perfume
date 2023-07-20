import { Router } from "express";
import { UserController } from "../../../controllers/users/user.controller";
import { userAuthMiddleware } from "../../../middlewares/user-auth.middleware";

const userRoutes: Router = Router();
const userController: UserController = new UserController();

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
export default userRoutes;
