import express from "express";
import dotenv from "dotenv";
import { allUsers } from "../controller/user.controller.js";
dotenv.config();
const router = express.Router();

router.get("/all-users", allUsers);

export default router;
