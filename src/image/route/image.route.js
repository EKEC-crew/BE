import express from 'express';
import { handleGetImageURL } from '../controller/image.controller.js';

const router = express.Router({ mergeParams: true });
router.get("/", handleGetImageURL);

export default router;