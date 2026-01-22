import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import roomRoutes from "./routes/room.routes";
import reservationRoutes from "./routes/reservation.routes";
import availabilityRoutes from "./routes/availability.routes";

// ---------- EXPRESS APP ----------
const app = express();
app.use(express.json());
app.use(
  require("cors")({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  })
);

// ---------- ROUTES ----------
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/availability", availabilityRoutes);

// ---------- HTTP SERVER ----------
const server = http.createServer(app);

// ---------- SOCKET.IO ----------
export let io: Server;
io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ---------- MONGODB ----------
const MONGO_URI = process.env.MONGO_URI!;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// ---------- START SERVER ----------
const PORT = Number(process.env.PORT) || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on http://127.0.0.1:${PORT}`);
});
