import { Router } from "express";

import {
    getGroups,
    createGroup,
    getGroupDetails,
    joinGroup,
    refreshInvite
} from "../controllers/group.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getGroups);
router.post("/", createGroup);
router.get("/:groupId", getGroupDetails);
router.post("/join/:token", joinGroup);
router.post("/:groupId/refresh-invite", refreshInvite);

export default router;