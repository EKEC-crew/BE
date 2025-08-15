import express from 'express';
import { authenticateAccessToken, verifyUserIsActive } from '../../../../auth/middleware/auth.middleware.js';
import joinedController from '../controller/joined.controller.js';

const router = express.Router();

// GET /joined
router.get('/joined', authenticateAccessToken, verifyUserIsActive, joinedController.getMyJoined);

export default router;