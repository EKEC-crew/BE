import express from 'express';
import { verifyToken } from "../../../../middleware/authMiddleware.js";
import * as albumController from "../controller/album.controller.js";
import multer from 'multer';

const router = express.Router({ mergeParams: true });

const upload = multer({
    storage: multer.memoryStorage()
});

router.get('/', albumController.readAlbumImages);
router.post('/', upload.single('image'), albumController.createAlbumImage);

export default router;