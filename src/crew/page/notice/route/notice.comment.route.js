import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../notice.comment.controller.js";
import {
  authenticateAccessToken,
  verifyUserIsActive,
} from "../../../../auth/middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// 공지 댓글 목록 조회
router.get("/", authenticateAccessToken, verifyUserIsActive, getComments);

// 공지 댓글 작성
router.post("/", authenticateAccessToken, verifyUserIsActive, createComment);

// 공지 댓글 수정
router.put(
  "/:commentId",
  authenticateAccessToken,
  verifyUserIsActive,
  updateComment
);

// 공지 댓글 삭제
router.delete(
  "/:commentId",
  authenticateAccessToken,
  verifyUserIsActive,
  deleteComment
);

export default router;
