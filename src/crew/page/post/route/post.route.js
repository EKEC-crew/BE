import express from 'express';
import { verifyToken } from "../../../../middleware/authMiddleware.js";
import * as postController from "../controller/post.controller.js";

const router = express.Router({ mergeParams: true });

router.get('/list', postController.readPostsByCrew);
router.post('/', verifyToken, postController.createCrewPost);
router.get('/:postId', postController.readCrewPost);
router.put('/:postId', verifyToken, postController.updateCrewPost);
router.delete('/:postId', verifyToken, postController.deleteCrewPost);
router.post('/:postId/like', verifyToken, postController.toggleCrewPostLike);
router.get('/:postId/comment/list', postController.readCommentsByCrewPost);
router.post('/:postId/comment', postController.createCrewPostComment);
router.put('/:postId/comment/:commentId', postController.updateCrewPostComment);
router.delete('/:postId/comment/:commentId', postController.deleteCrewPostComment);

export default router;