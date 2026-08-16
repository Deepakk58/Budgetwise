import { Router } from "express";

import {
    addGroupExpense,
    deleteGroupExpense
} from "../controllers/groupExpense.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/:groupId", addGroupExpense);
router.delete("/:groupId/:expenseId", deleteGroupExpense);

export default router;