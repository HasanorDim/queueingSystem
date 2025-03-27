import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

//This is called helper functions
export function getReceiverSocketId(usersId) {
  return userSocketMap[usersId];
}

//Used to store online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //   io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("breakTimeStatus", (status) => {
    io.emit("updateBreakTime", status); // Broadcast to all clients
  });

  socket.on("statusUpdated", (status) => {
    io.emit("updateStatus", status);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: ", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
