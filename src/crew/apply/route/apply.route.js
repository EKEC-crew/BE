import express from 'express';
import applyController from '../controller/apply.controller.js';
import applicantsRoutes from '../applicants/route/applicants.route.js';
import { authenticateAccessToken, verifyUserIsActive } from '../../../auth/middleware/auth.middleware.js';
import { checkCrewLeaderPermission } from '../middleware/crew.middleware.js';

const router = express.Router();

// 지원자 목록 관련 라우트 (크루장 권한 필요)
router.use('/', applicantsRoutes);

// 크루 지원하기 (로그인 필요)
router.post('/:crewId/apply',
    authenticateAccessToken,
    verifyUserIsActive,
    applyController.applyToCrew
);

// 크루 모집 폼 조회 (로그인 필요)
router.get('/:crewId/apply',
    authenticateAccessToken,
    verifyUserIsActive,
    applyController.getCrewApplicationForm
);

// 특정 지원서 조회 (크루장만 가능)
router.get('/:crewId/apply/:applyId',
    authenticateAccessToken,
    verifyUserIsActive,
    checkCrewLeaderPermission,
    applyController.getCrewApplicationById
);

// 지원서 승인/거절 (크루장만 가능)
router.patch('/:crewId/apply/:applyId',
    authenticateAccessToken,
    verifyUserIsActive,
    checkCrewLeaderPermission,
    applyController.updateApplicationStatus
);

export default router;