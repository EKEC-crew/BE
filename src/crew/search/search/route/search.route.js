import express from 'express';
import { handleAdvancedSearch, handleDefaultSearch } from '../controller/search.controller.js';
const router = express.Router();
router.get('/name', handleDefaultSearch);
router.get('/detail', handleAdvancedSearch);
export default router;