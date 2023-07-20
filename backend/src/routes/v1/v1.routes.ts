import { Router } from "express";
const routerV1: any = Router();

import adminRoutes from "./admins/admins.routes";
import categoryRoutes from "./categories/categories.routes";
import orderRoutes from "./orders/order.routes";
import productRoutes from "./products/products.routes";
import userRoutes from "./users/user.routes";

routerV1.use("/v1", adminRoutes);
routerV1.use("/v1", categoryRoutes);
routerV1.use("/v1", orderRoutes);
routerV1.use("/v1", productRoutes);
routerV1.use("/v1", userRoutes);

export default routerV1;
