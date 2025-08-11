import express from "express";
import {
  handleAdvancedSearch,
  handleDefaultSearch,
  handleGetByCategory,
} from "../controller/search.controller.js";
const router = express.Router();
router.get("/name", handleDefaultSearch); // 크루명으로 검색
router.get("/detail", handleAdvancedSearch); // 크루 찾아보기 (고급 검색)
router.get("/category", handleGetByCategory); // 카테고리로 검색
export default router;
