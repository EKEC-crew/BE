import express from 'express';
import crewRoutes from '../crew/route/crew.route.js';
import authRoutes from '../auth/route/auth.route.js';
import alarmRoutes from '../alarm/route/alarm.route.js';
import imageRoutes from '../image/route/image.route.js';
const router = express.Router();
router.use('/crew', crewRoutes);
router.use('/auth', authRoutes);
router.use('/alarm', alarmRoutes);
router.use('/image', imageRoutes)
export default router;