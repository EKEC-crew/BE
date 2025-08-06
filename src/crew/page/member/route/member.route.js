import express from "express";
import * as memberController from "../controller/member.controller.js";
import { authenticateAccessToken } from '../../../../auth/middleware/auth.middleware.js';
const router = express.Router({ mergeParams: true });

router.get('/', authenticateAccessToken, memberController.readMembersByCrew); //인증 필요
router.put('/:memberId/role', authenticateAccessToken, memberController.changeRoleCrewMember); //인증 필요
router.delete('/:memberId/kick', authenticateAccessToken, memberController.kickCrewMember); //인증 필요

export default router;
