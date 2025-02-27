import express from "express";
import {
  checkAuth,
  newestNumber,
  requestTicket,
  setAuth,
  totalTickets,
  // setAuth,
  userTicket,
} from "../controller/ticket.js";
import {
  protectRoute,
  protectTicketRoute,
  protectUserTicketRoute,
} from "../middleware/protectRoute.middleware.js";
const router = express.Router();

// router.get("/", requestTicket);

router.get("/check", protectTicketRoute, checkAuth);
router.get("/user", protectUserTicketRoute, userTicket);
router.get("/setAuth/:departmentId", setAuth);
router.get("/newestNumber/:windowId", newestNumber);
router.get("/all-tickets", totalTickets);

router.post("/add", protectRoute, requestTicket);

export default router;
