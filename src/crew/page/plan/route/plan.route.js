import express from 'express';
import { createPlan } from "../controller/plan.controller.js";
const router = express.Router();

//page.router.js를 통해 /crew/:crewId/plan으로 호출됨

// 크루 일정 등록
router.post('/', createPlan);

export default router;
