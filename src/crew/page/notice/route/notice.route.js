import express from "express";
import {
  getNotices,
  createNotice,
  getNoticeDetails,
  updateNotice,
  deleteNotice,
  toggleNoticeLike,
} from "../notice.controller.js";
import noticeCommentRouter from "./notice.comment.route.js";

const router = express.Router({ mergeParams: true });

// 기본 공지사항 라우트 (먼저 연결)
router.get("/", getNotices);
router.post("/", createNotice);
router.get("/:noticeId", getNoticeDetails);
router.put("/:noticeId", updateNotice);
router.delete("/:noticeId", deleteNotice);

// 공지 좋아요 토글 라우트
router.post("/:noticeId/like", toggleNoticeLike);

// 공지 댓글 관련 라우트 연결 (특정 경로에만 연결)
router.use("/:noticeId/comment", noticeCommentRouter);

export default router;
