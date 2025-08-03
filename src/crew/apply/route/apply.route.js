import express from 'express';
import applyController from '../controller/apply.controller.js';

const router = express.Router();

router.post('/:crewId/apply', applyController.applyToCrew);
router.get('/:crewId/apply/:applyId', applyController.getCrewApplicationById);
router.patch('/:crewId/apply/:applyId', applyController.updateApplicationStatus);

export default router;