import { Router } from "express";
const routerV1: any = Router();

import adminRoutes from "./admins/admins.routes";
import categoryRoutes from "./categories/categories.routes";
import orderRoutes from "./orders/order.routes";

routerV1.use("/v1", adminRoutes);
routerV1.use("/v1", categoryRoutes);
routerV1.use("/v1", orderRoutes);

export default routerV1;
