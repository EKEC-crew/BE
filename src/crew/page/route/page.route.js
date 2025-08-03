import express from "express";


import albumRoutes from '../album/route/album.route.js'
import postRoutes from '../post/route/post.route.js'
import noticeRoutes from '../notice/route/notice.route.js'
import planRoutes from '../plan/route/plan.route.js'
import memberRoutes from '../member/route/member.route.js'

const router = express.Router({ mergeParams: true });

router.use("/:crewId/album", albumRoutes);
router.use("/:crewId/post", postRoutes);
router.use("/:crewId/notice", noticeRoutes);
router.use("/:crewId/plan", planRoutes);
router.use("/:crewId/member", memberRoutes);
export default router;
