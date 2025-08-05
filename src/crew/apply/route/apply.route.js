import express from 'express';
import applyController from '../controller/apply.controller.js';
import applicantsRoutes from '../applicants/route/applicants.route.js';

const router = express.Router();

router.use('/', applicantsRoutes);
router.post('/:crewId/apply', applyController.applyToCrew);
router.get('/:crewId/apply', applyController.getCrewApplicationForm);
router.get('/:crewId/apply/:applyId', applyController.getCrewApplicationById);
router.patch('/:crewId/apply/:applyId', applyController.updateApplicationStatus);

export default router;