import { Router } from "express";

import {
    getExpenses,
    getRecentExpenses,
    getTotalExpense,
    addExpense,
    editExpense,
    deleteExpense,
    getExpenseData
} from "../controllers/expense.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getExpenses);
router.get("/recent", getRecentExpenses);
router.get("/total", getTotalExpense);
router.get("/charts", getExpenseData);

router.post("/", addExpense);

router.patch("/:id", editExpense);

router.delete("/:id", deleteExpense);

export default router;
