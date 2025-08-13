import express from 'express';
import { authenticateAccessToken, verifyUserIsActive } from '../../../../auth/middleware/auth.middleware.js';
import listController from '../controller/list.controller.js';

const router = express.Router();

// GET /list
router.get('/list', authenticateAccessToken, verifyUserIsActive, listController.getMyPendingApplies);

export default router;