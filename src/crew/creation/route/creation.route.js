import express from 'express';
import {handleCreateCrew} from "../controller/creation.controller.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
});


router.post('/', upload.single('bannerImage'), handleCreateCrew);
export default router;