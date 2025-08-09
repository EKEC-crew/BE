import express from "express";
import { authenticateAccessToken, verifyUserIsActive } from '../../../../auth/middleware/auth.middleware.js';
import * as infoController from "../controller/info.controller.js";

const router = express.Router({ mergeParams: true });

router.get('/', infoController.readCrewInfo);
router.put('/introduce', authenticateAccessToken, verifyUserIsActive, infoController.updateCrewIntroduce); //인증 필요

export default router;