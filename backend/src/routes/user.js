import express from "express";
import dotenv from "dotenv";
import { allUsers, allUsersCount } from "../controller/user.controller.js";
dotenv.config();
const router = express.Router();

router.get("/all-users", allUsers);
router.get("/all-users-count", allUsersCount);

export default router;
