import express from "express";
import {
  addWindow,
  deleteWindow,
  editWindow,
  getTableWindow,
  getTicketInQueueWindow,
  getWindow,
} from "../controller/window.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
const router = express.Router();

router.get("/:windowId", getWindow);
router.get("/table/:windowId", getTableWindow);
router.get("/inqueue-number/:windowId", getTicketInQueueWindow);

router.post("/add", protectRoute, addWindow);
router.delete("/delete/:windowId", deleteWindow);
router.put("/edit", editWindow);

export default router;
