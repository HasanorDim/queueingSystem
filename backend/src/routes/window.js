import express from "express";
import { getTableWindow, getWindow } from "../controller/window.controller.js";
const router = express.Router();

router.get("/:windowId", getWindow);
router.get("/table/:windowId", getTableWindow);

export default router;
