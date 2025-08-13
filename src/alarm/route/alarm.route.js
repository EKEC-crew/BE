import express from "express";
import {
  handleGetAlarms,
  handleReadAlarm,
} from "../controller/alarm.controller.js";
import {
  authenticateAccessToken,
  verifyUserIsActive,
} from "../../auth/middleware/auth.middleware.js";
import { eventEmitter } from "../../index.js";
const router = express.Router({ mergeParams: true });
router.get(
  "/list",
  authenticateAccessToken,
  verifyUserIsActive,
  handleGetAlarms,
);
router.patch(
  "/:alarmId",
  authenticateAccessToken,
  verifyUserIsActive,
  handleReadAlarm,
);
export default router;
