import express from "express";
import * as memberController from "../controller/member.controller.js";
import { authenticateAccessToken, verifyUserIsActive } from '../../../../auth/middleware/auth.middleware.js';
const router = express.Router({ mergeParams: true });

router.get('/', authenticateAccessToken, verifyUserIsActive, memberController.readMembersByCrew); //인증 필요
router.put('/:memberId/role', authenticateAccessToken, verifyUserIsActive, memberController.changeRoleCrewMember); //인증 필요
router.delete('/:memberId/kick', authenticateAccessToken, verifyUserIsActive, memberController.kickCrewMember); //인증 필요
router.post('/', memberController.addCrewMember);

export default router;
