import express from 'express';
import * as planController from "../controller/plan.controller.js";

// crew.route.js 에서 '/:crewId/plan' 으로 mount되므로, 반드시 mergeParams: true
const router = express.Router({ mergeParams: true });

// 크루 일정 등록
router.post('/', planController.createPlan);

// 크루 일정 리스트 조회 (더 구체적인 경로를 먼저 배치)
router.get('/list', planController.getPlanList);

// 크루 일정 조회
router.get('/:planId', planController.getPlanById);

// 크루 일정 수정
router.put('/:planId', planController.updatePlan);
    
// 크루 일정 삭제
router.delete('/:planId', planController.deletePlan);

// 크루 일정 댓글 등록
router.post("/:planId/comments", planController.createPlanComment);

// 크루 일정 댓글 리스트 조회 (더 구체적인 경로를 먼저 배치)
router.get("/:planId/comments/list", planController.getPlanCommentList);

// 크루 일정 댓글 조회
router.get("/:planId/comments/:commentId", planController.getPlanCommentById);

// 크루 일정 댓글 수정
router.patch("/:planId/comments/:commentId", planController.updatePlanComment);

// 크루 일정 댓글 삭제
router.delete("/:planId/comments/:commentId", planController.deletePlanComment);


export default router;