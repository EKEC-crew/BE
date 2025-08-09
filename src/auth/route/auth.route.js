import express from "express";
import {
  handleSignUp,
  handleLogin,
  handleRefresh,
  handleLogout,
  handleProfile,
} from "../controller/auth.controller.js";
import oauthRoutes from "../oauth/route/oauth.route.js";
import { authenticateAccessToken } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});
router.use("/oauth", oauthRoutes);
router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/refresh", handleRefresh);
router.post(
  "/profile",
  authenticateAccessToken,
  upload.single("profileImage"),
  handleProfile,
);
export default router;
