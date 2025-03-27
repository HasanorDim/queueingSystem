import express from "express";
import {
  checkAuth,
  getAllTickets,
  newestNumber,
  nextWindow,
  notPresent,
  requestTicket,
  setAuth,
  ticketStatus,
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
import { checkUserTicket } from "../controller/userTicket.js";
// router.get("/", requestTicket);

router.get("/check", protectTicketRoute, checkAuth);
router.get("/user", protectUserTicketRoute, userTicket);
router.get("/setAuth/:departmentId", setAuth);
router.get("/checkUserTicket", protectRoute, checkUserTicket);
router.get("/newestNumber/:windowId", newestNumber);
router.get("/all-tickets", totalTickets);
router.get("/department-tickets", protectRoute, getAllTickets);

router.post("/add", protectRoute, requestTicket);
router.post("/status", ticketStatus);
router.post("/nextWindowForUser", nextWindow);
router.post("/notPresent", notPresent);

export default router;
