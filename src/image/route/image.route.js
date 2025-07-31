import express from "express";
import { handleGetImage } from "../controller/image.controller.js";

const router = express.Router({ mergeParams: true });
router.get("/", handleGetImage);

export default router;
