import express from 'express';

const router = express.Router();

router.get('/lastest', (req, res) => res.send('Hello UMC!'));
export default router;