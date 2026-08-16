import { Router } from "express";

import {
    getBudgets,
    getCategories,
    getCurrentMonthBudgetData,
    setMultipleBudgets
} from "../controllers/budget.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getBudgets);
router.get("/categories", getCategories);
router.get("/current-month", getCurrentMonthBudgetData);
router.put("/multiple", setMultipleBudgets);

export default router;
