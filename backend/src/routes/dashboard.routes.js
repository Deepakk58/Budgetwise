import { Router } from "express";

import {
    getDashboard,
    getChartData
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.get("/", getDashboard);
router.get("/charts", getChartData);

export default router;
