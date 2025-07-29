import express from 'express';
import { handlePopularCrewList, handleLatestCrewList } from "../controller/list.controller.js";


const router = express.Router();


router.get("/popular", handlePopularCrewList);
router.get("/latest", handleLatestCrewList);

export default router;