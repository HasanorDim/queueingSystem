import express from "express";
import {
  login,
  signup,
  logout,
  checkAuth,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Req: ", req.user);
  return res.status(200).json(req.user);
});
router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth);

// router.post()

export default router;
