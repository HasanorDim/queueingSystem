import express from "express";
import { generateQR } from "../controller/generate.qr.js";

const router = express.Router();

router.get("/:departmentId", generateQR);

export default router;
