import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../notice.comment.controller.js";

const router = express.Router({ mergeParams: true });

// 공지 댓글 목록 조회
router.get("/", getComments);

// 공지 댓글 작성
router.post("/", createComment);

// 공지 댓글 수정
router.put("/:commentId", updateComment);

// 공지 댓글 삭제
router.delete("/:commentId", deleteComment);

export default router;
