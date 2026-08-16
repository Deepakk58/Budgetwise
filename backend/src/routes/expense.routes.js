import { Router } from "express";

import {
    getExpenses,
    addExpense,
    editExpense,
    deleteExpense
} from "../controllers/expense.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getExpenses);
router.post("/", addExpense);
router.patch("/:id", editExpense);
router.delete("/:id", deleteExpense);

export default router;
