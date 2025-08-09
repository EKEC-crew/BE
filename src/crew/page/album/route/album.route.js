import express from "express";
import { authenticateAccessToken, verifyUserIsActive } from '../../../../auth/middleware/auth.middleware.js';
import * as albumController from "../controller/album.controller.js";
import multer from "multer";

const router = express.Router({ mergeParams: true });

const upload = multer({
    storage: multer.memoryStorage(),
});

router.get("/", albumController.readAlbumImages);
router.post("/", authenticateAccessToken, verifyUserIsActive, upload.single("image"), albumController.createAlbumImage);

export default router;
