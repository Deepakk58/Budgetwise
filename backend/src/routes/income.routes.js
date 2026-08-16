import { Router } from "express";

import {
    getIncomes,
    addIncome,
    editIncome,
    deleteIncome
} from "../controllers/income.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getIncomes);
router.post("/", addIncome);
router.patch("/:id", editIncome);
router.delete("/:id", deleteIncome);

export default router;
