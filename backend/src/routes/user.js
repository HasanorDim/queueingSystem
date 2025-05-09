import express from "express";
import dotenv from "dotenv";
import {
  allUsers,
  allUsersCount,
  getBreakTime,
  getCutOff,
  setBreakTime,
  setCutOff,
} from "../controller/user.controller.js";
dotenv.config();
const router = express.Router();

router.get("/all-users", allUsers);
router.get("/all-users-count", allUsersCount);
router.get("/getBreakTime", getBreakTime);
router.get("/setBreakTime", setBreakTime);
router.get("/setCutOff", setCutOff);
router.get("/getCutOff", getCutOff);

export default router;
