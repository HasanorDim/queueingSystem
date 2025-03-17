import dotenv from "dotenv";
import { io } from "../lib/socket.js";
dotenv.config();

export const broadcastTableWindowUpdate = (data) => {
  io.emit("tableWindowUpdated", data);
};
