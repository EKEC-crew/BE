import express from 'express';
import sortController from '../controller/sort.controller.js';

const router = express.Router();

router.get('/latest', sortController.getLatestCrews);
router.get('/popular', sortController.getPopularCrews);
router.get('/member/asc', sortController.getMemberAscCrews);
router.get('/member/desc', sortController.getMemberDescCrews);

export default router;