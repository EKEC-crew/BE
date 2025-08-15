import express from "express";
import { handleCreateCrew } from "../controller/creation.controller.js";
import multer from "multer";
import {
  authenticateAccessToken,
  verifyUserIsActive,
} from "../../../auth/middleware/auth.middleware.js";

// Express 라우터 객체
const router = express.Router();
// 파일 업로드시 메모리에 일시적으로 저장하도록 함
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  authenticateAccessToken,
  verifyUserIsActive,
  upload.single("bannerImage"),
  handleCreateCrew,
); // 로그인 필요

export default router;