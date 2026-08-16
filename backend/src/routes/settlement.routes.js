import { Router } from "express";

import {
    getSettlementSuggestions,
    createSettlement,
    getSettlementHistory
} from "../controllers/settlement.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/:groupId/suggestions", getSettlementSuggestions);
router.get("/:groupId/history", getSettlementHistory);
router.post("/:groupId", createSettlement);

export default router;