import express from 'express';
import applyController from '../controller/apply.controller.js';

const router = express.Router();

router.post('/:crewId/apply', applyController.applyToCrew);

export default router;
