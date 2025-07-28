// server.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

import express from "express";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Gerekirse localhost:5173 gibi sınırlandırılabilir
  },
});

// 🧠 Socket bağlantıları
io.on("connection", (socket) => {
  console.log("Yeni bağlantı:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("scoreUpdated", ({ roomId, data }) => {
    socket.to(roomId).emit("scoreUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("DB error:", err));
