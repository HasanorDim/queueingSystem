import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route Path
import { app, server } from "./lib/socket.js";
import authroute from "./routes/auth.routes.js";
import generateQR from "./routes/generate.route.js";
import department from "./routes/department.js";
import ticket from "./routes/ticket.js";
import users from "./routes/user.js";
import window from "./routes/window.js";
import "./functions/scheduling.timer.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
app.use(express.json());
// app.use(express.static(""));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authroute);
app.use("/api/qr", generateQR);
app.use("/api/department", department);
app.use("/api/ticket", ticket);
app.use("/api/user", users);
app.use("/api/window", window);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (res, req) => {
    res.sendFile(path.join(__dirname, "../frontend", "dis", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`This Server is running on http://localhost:${PORT}`);
});
