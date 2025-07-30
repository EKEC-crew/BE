import express from "express";
import * as memberController from "../controller/member.controller.js";

const router = express.Router({ mergeParams: true });

router.get('/', memberController.readMembersByCrew);
router.put('/:memberId/role', memberController.changeRoleCrewMember); //인증 필요
router.delete('/:memberId/kick', memberController.kickCrewMember); //인증 필요

export default router;
