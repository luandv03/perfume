import { Router } from "express";
const router: any = Router();

import routerV1 from "./v1/v1.routes";

router.use("/api", routerV1);

export default router;
