import express from 'express';
import { verifyToken } from "../../../../middleware/authMiddleware.js";
import * as postController from "../controller/post.controller.js";
import multer from 'multer';

const router = express.Router({ mergeParams: true });

const upload = multer({
    storage: multer.memoryStorage()
});

router.get('/list', postController.readPostsByCrew);
router.post('/', upload.array('images', 10), postController.createCrewPost); //인증 필요
router.get('/:postId', postController.readCrewPost);
router.put('/:postId', upload.array('images', 10), postController.updateCrewPost); //인증 필요
router.delete('/:postId', postController.deleteCrewPost); //인증 필요
router.post('/:postId/like', postController.toggleCrewPostLike); //인증 필요
router.get('/:postId/comment/list', postController.readCommentsByCrewPost);
router.post('/:postId/comment', postController.createCrewPostComment); //인증 필요
router.put('/:postId/comment/:commentId', postController.updateCrewPostComment); //인증 필요
router.delete('/:postId/comment/:commentId', postController.deleteCrewPostComment); //인증 필요

export default router;