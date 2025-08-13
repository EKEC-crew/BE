import express from 'express';
import * as planController from "../controller/plan.controller.js";
import { authenticateAccessToken, verifyUserIsActive } from "../../../../auth/middleware/auth.middleware.js";

// crew.route.js 에서 '/:crewId/plan' 으로 mount되므로, 반드시 mergeParams: true
const router = express.Router({ mergeParams: true });

/**
 * POST 요청으로 들어온 / 경로에 대해,
JWT 토큰을 검증하고 (authenticateAccessToken)
유저 계정이 활성화되었는지 확인하고 (verifyUserIsActive)
최종적으로 planController.createPlan()을 실행합니다.
 */
// 크루 일정 등록
router.post('/', authenticateAccessToken, verifyUserIsActive, planController.createPlan);

// 크루 일정 리스트 조회 (더 구체적인 경로를 먼저 배치)
router.get('/list', authenticateAccessToken, verifyUserIsActive, planController.getPlanList);

// 다가오는 일정 리스트 조회 (정적 라우트를 동적 라우트보다 먼저 배치)
router.get("/upcoming", authenticateAccessToken, verifyUserIsActive, planController.getUpcomingPlans);

// 크루 일정 조회
router.get('/:planId', authenticateAccessToken, verifyUserIsActive, planController.getPlanById);

// 크루 일정 수정
router.put('/:planId', authenticateAccessToken, verifyUserIsActive, planController.updatePlan);
    
// 크루 일정 삭제
router.delete('/:planId', authenticateAccessToken, verifyUserIsActive, planController.deletePlan);

// 크루 일정 댓글 등록
router.post("/:planId/comments", authenticateAccessToken, verifyUserIsActive, planController.createPlanComment);

// 크루 일정 댓글 리스트 조회 (더 구체적인 경로를 먼저 배치)
router.get("/:planId/comments/list", authenticateAccessToken, verifyUserIsActive, planController.getPlanCommentList);

// 크루 일정 댓글 조회
router.get("/:planId/comments/:commentId", authenticateAccessToken, verifyUserIsActive, planController.getPlanCommentById);

// 크루 일정 댓글 수정
router.patch("/:planId/comments/:commentId", authenticateAccessToken, verifyUserIsActive, planController.updatePlanComment);

// 크루 일정 댓글 삭제
router.delete("/:planId/comments/:commentId", authenticateAccessToken, verifyUserIsActive, planController.deletePlanComment);

// 크루 일정 좋아요 추가
router.post("/:planId/like", authenticateAccessToken, verifyUserIsActive, planController.likePlan);

// 크루 일정 좋아요 취소
router.delete("/:planId/like", authenticateAccessToken, verifyUserIsActive, planController.unlikePlan);

// 크루 일정 신청
router.post("/:planId/apply", authenticateAccessToken, verifyUserIsActive, planController.applyToPlan);

export default router;