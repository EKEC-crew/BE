import express from 'express';
import { getApplicants } from '../controller/applicants.controller.js';

const router = express.Router();

router.get('/:crewId/apply/applicants', getApplicants);

export default router;