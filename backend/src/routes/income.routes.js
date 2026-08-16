import { Router } from "express";

import {
    getIncomes,
    getRecentIncomes,
    getTotalIncome,
    addIncome,
    editIncome,
    deleteIncome,
    getMonthlyIncomeData
} from "../controllers/income.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getIncomes);
router.get("/recent", getRecentIncomes);
router.get("/total", getTotalIncome);
router.get("/monthly", getMonthlyIncomeData);
router.post("/", addIncome);
router.patch("/:id", editIncome);
router.delete("/:id", deleteIncome);

export default router;
