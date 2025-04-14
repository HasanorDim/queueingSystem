import express from "express";
import {
  addDepartment,
  allDepartment,
  deleteDepartment,
  // editCounterDepartment,
  editDepartment,
  getDepartment,
  getUserDepartment,
  getWindow,
  helperDepartment,
  setDepartmentUser,
} from "../controller/department.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Hello, from the test route!" });
});
router.get("/all", allDepartment);
router.get("/helper", helperDepartment);
router.get("/deptuser", protectRoute, getUserDepartment);
router.get("/service-window/:departmentId", getWindow);
router.get("/:departmentId", getDepartment);

router.post("/add", addDepartment);
router.put("/edit", editDepartment);
router.post("/set-department-user/:departmentId", setDepartmentUser);

router.delete("/delete/:departmentId", deleteDepartment);

export default router;
