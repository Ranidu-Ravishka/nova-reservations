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
	throw new Error("Missing MONGO_URI");
}
if (!process.env.JWT_SECRET) {
	console.error("❌ Missing JWT_SECRET");
	throw new Error("Missing JWT_SECRET");
}

const PORT = Number(process.env.PORT) || 4000;

async function startServer(mongoUri: string) {
	try {
		await mongoose.connect(mongoUri);
		console.log("✅ MongoDB connected");
		server.listen(PORT, () => {
			console.log(`🚀 API running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error);
		process.exit(1);
	}
}

void startServer(MONGO_URI);

/* ---------- GRACEFUL SHUTDOWN ---------- */
let isShuttingDown = false;

async function shutdown(signal: string) {
	if (isShuttingDown) return;
	isShuttingDown = true;
	console.log(`🛑 Received ${signal}. Shutting down...`);

	try {
		await new Promise<void>((resolve) => {
			server.close(() => resolve());
		});
		await mongoose.connection.close(false);
		console.log("✅ Shutdown complete");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error during shutdown", error);
		process.exit(1);
	}
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
	console.error("❌ Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
	console.error("❌ Uncaught exception:", error);
	shutdown("uncaughtException");
});
