import { Router } from "express";
const routerV1: any = Router();

import adminRoutes from "./admins/admins.routes";
import categoryRoutes from "./categories/categories.routes";
import orderRoutes from "./orders/order.routes";
import productRoutes from "./products/products.routes";
import userRoutes from "./users/user.routes";
import uploadRoutes from "./uploadFileToCloud/uploadFileToCloud.routes";
import cartRoutes from "./carts/cart.routes";
import feedbackRoutes from "./feedbacks/feedback.routes";
import paymentRoutes from "./payments/payment.routes";
import mailerRoutes from "./mailers/mailer.routes";

routerV1.use("/v1", adminRoutes);
routerV1.use("/v1", categoryRoutes);
routerV1.use("/v1", orderRoutes);
routerV1.use("/v1", productRoutes);
routerV1.use("/v1", userRoutes);
routerV1.use("/v1", uploadRoutes);
routerV1.use("/v1", cartRoutes);
routerV1.use("/v1", feedbackRoutes);
routerV1.use("/v1", mailerRoutes);
routerV1.use("/v1", paymentRoutes);

// routerV1.use("/v1", paymentRoutes);

export default routerV1;
