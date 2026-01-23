import "dotenv/config";
import http from "node:http";
import mongoose from "mongoose";
import app from "./app";
import { initSocket } from "./socket";

/* ---------- HTTP SERVER ---------- */
const server = http.createServer(app);

/* ---------- SOCKET.IO ---------- */
initSocket(server);

/* ---------- MONGODB ---------- */
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
	console.error("❌ Missing MONGO_URI");
	process.exit(1);
}

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("✅ MongoDB connected"))
	.catch((err) => {
		console.error("❌ MongoDB connection failed:", err);
		process.exit(1);
	});

/* ---------- START SERVER ---------- */
const PORT = Number(process.env.PORT) || 4000;
server.listen(PORT, () => {
	console.log(`🚀 API running on http://localhost:${PORT}`);
});
