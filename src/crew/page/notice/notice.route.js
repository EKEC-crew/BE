import express from "express";
import {
  getNotices,
  createNotice,
  getNoticeDetails,
  updateNotice,
  deleteNotice,
} from "./notice.controller.js";

// 상위 라우터의 파라미터(crewId)를 사용하기 위해 mergeParams를 true로 설정
const router = express.Router({ mergeParams: true });

//////////////

// 특정 크루 공지리스트 조회
router.get("/", getNotices);

// 특정 크루 공지 작성
router.post("/", createNotice);

// 특정 크루 공지 상세조회
router.get("/:noticeId", getNoticeDetails);

// 특정 크루 공지 수정
router.put("/:noticeId", updateNotice);

// 특정 크루 공지 삭제
router.delete("/:noticeId", deleteNotice);

export default router;
