import { Router } from "express";
const adminRoutes: Router = Router();

import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeMiddleware } from "../../../middlewares/authorization.middleware";
import { AdminController } from "../../../controllers/admins/admin.controller";
const adminController: AdminController = new AdminController();

// get all admins accounts
adminRoutes.get(
    "/admin/account/view",
    authMiddleware,
    authorizeMiddleware,
    adminController.getAdmins
);

// register account
adminRoutes.post(
    "/admin/account/register",
    authMiddleware,
    authorizeMiddleware,
    adminController.register
);

//login account
adminRoutes.post("/admin/account/login", adminController.login);

//refresh token account
adminRoutes.get("/admin/account/refresh_token", adminController.refreshToken);

//logout
adminRoutes.post(
    "/admin/account/logout",
    authMiddleware,
    adminController.logout
);

export default adminRoutes;
