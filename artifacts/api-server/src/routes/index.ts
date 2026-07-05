import { Router, type IRouter } from "express";
import healthRouter from "./health";
import complaintsRouter from "./complaints/index.js";
import dashboardRouter from "./dashboard/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(complaintsRouter);
router.use(dashboardRouter);

export default router;
