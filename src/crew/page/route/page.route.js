import express from 'express';

import albumRoutes from '../album/route/album.route.js'
import postRoutes from '../post/route/post.route.js'
import noticeRoutes from '../notice/route/notice.route.js'
import planRoutes from '../plan/route/plan.route.js'

const router = express.Router();

router.use('/:crewId/album', albumRoutes);
router.use('/:crewId/post', postRoutes);
router.use('/:crewId/notice', noticeRoutes);
router.use('/:crewId/plan', planRoutes);
export default router;