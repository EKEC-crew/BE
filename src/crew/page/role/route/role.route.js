import express from 'express';
import { authenticateAccessToken, verifyUserIsActive } from '../../../../auth/middleware/auth.middleware.js';
import * as roleController from "../controller/role.controller.js";

const router = express.Router({ mergeParams: true });

router.get('/', authenticateAccessToken, verifyUserIsActive, roleController.getMemberRole); //인증 필요

export default router;