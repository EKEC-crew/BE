import express from 'express';
import { authenticateAccessToken, verifyUserIsActive } from '../../../../auth/middleware/auth.middleware.js';
import * as postController from "../controller/post.controller.js";
import multer from 'multer';

const router = express.Router({ mergeParams: true });

const upload = multer({
    storage: multer.memoryStorage()
});

router.get('/list', postController.readPostsByCrew);
router.post('/', authenticateAccessToken, verifyUserIsActive, upload.array('images', 5), postController.createCrewPost); //인증 필요
router.get('/:postId', postController.readCrewPost);
router.put('/:postId', authenticateAccessToken, verifyUserIsActive, upload.array('images', 10), postController.updateCrewPost); //인증 필요
router.delete('/:postId', authenticateAccessToken, verifyUserIsActive, postController.deleteCrewPost); //인증 필요
router.post('/:postId/like', authenticateAccessToken, verifyUserIsActive, postController.toggleCrewPostLike); //인증 필요
router.get('/:postId/comment/list', postController.readCommentsByCrewPost);
router.post('/:postId/comment', authenticateAccessToken, verifyUserIsActive, postController.createCrewPostComment); //인증 필요
router.put('/:postId/comment/:commentId', authenticateAccessToken, verifyUserIsActive, postController.updateCrewPostComment); //인증 필요
router.delete('/:postId/comment/:commentId', authenticateAccessToken, verifyUserIsActive, postController.deleteCrewPostComment); //인증 필요

export default router;