import "dotenv/config";
import http from "node:http";
import mongoose from "mongoose";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import app from "./app";

// ---------- HTTP SERVER ----------
const server = http.createServer(app);

// ---------- SOCKET.IO ----------
export const io = new Server(server, {
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

io.on("connection", (socket: Socket) => {
	console.log("🟢 Client connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("🔴 Client disconnected:", socket.id);
	});
});

// ---------- MONGODB ----------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
	console.error("❌ Missing required environment variable: MONGO_URI");
	process.exit(1);
}

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
