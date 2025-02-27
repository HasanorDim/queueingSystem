import express from "express";
import {
  addDepartment,
  allDepartment,
  deleteDepartment,
  // editCounterDepartment,
  editDepartment,
  getDepartment,
  getWindow,
} from "../controller/department.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Hello, from the test route!" });
});
router.get("/service-window/:departmentId", getWindow);
router.get("/all", allDepartment);
router.get("/:departmentId", getDepartment);

router.post("/add", addDepartment);
router.put("/edit", editDepartment);

router.delete("/delete/:departmentId", deleteDepartment);

// Counter
// router.put("/edit-counter/:departmentId", editCounterDepartment);

export default router;
