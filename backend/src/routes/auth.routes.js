import express from "express";
import {
  login,
  signup,
  logout,
  checkAuth,
  userInfo,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/check", protectRoute, checkAuth);

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);
router.post("/set-info", protectRoute, userInfo);

// router.post()

export default router;
