import express from "express";
import searchRoutes from "../search/search/route/search.route.js";
import sortRoutes from "../search/sort/route/sort.route.js";
import creationRoutes from "../creation/route/creation.route.js";
import listRoutes from "../list/route/list.route.js";

import noticeRouter from "../page/notice/route/notice.route.js";

const router = express.Router({ mergeParams: true });
router.use('/search', searchRoutes);
router.use('/sort', sortRoutes);
router.use('/create', creationRoutes);
router.use('/list', listRoutes);
router.use('/', pageRoutes);

export default router;
