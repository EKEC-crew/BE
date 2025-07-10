import express from 'express';
import {verifyToken} from "../../../../middleware/authMiddleware.js";
import {readPostsByCrew, createCrewPost, readCrewPost, updateCrewPost, deleteCrewPost, toggleCrewPostLike, readCommentsByCrewPost, createCrewPostComment, updateCrewPostComment, deleteCrewPostComment} from "../controller/post.controller.js";

const router = express.Router();

router.get('/list', readPostsByCrew);
router.post('/', verifyToken, createCrewPost);
router.get('/{postId}', readCrewPost);
router.put('/{postId}', verifyToken, updateCrewPost);
router.delete('/{postId}', verifyToken, deleteCrewPost);
router.post('/{postId}/like', verifyToken, toggleCrewPostLike);
router.get('/{postId}/comment/list', readCommentsByCrewPost);
router.post('/{postId}/comment', createCrewPostComment);
router.put('/{postId}/comment/{commentId}', updateCrewPostComment);
router.delete('/{postId}/comment/{commentId}', deleteCrewPostComment);

export default router;