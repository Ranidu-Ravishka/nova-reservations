import "dotenv/config";
import http from "node:http";
import mongoose from "mongoose";
import app from "./app";
import { connectDB, formatMongoConnectionFailure } from "./config/db";
import { initSocket } from "./socket";

/* ---------- HTTP SERVER ---------- */
const server = http.createServer(app);

/* ---------- SOCKET.IO ---------- */
initSocket(server);

/* ---------- MONGODB ---------- */
if (!process.env.JWT_SECRET) {
	console.error("❌ Missing JWT_SECRET");
	throw new Error("Missing JWT_SECRET");
}

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
	try {
		await connectDB();
		console.log("✅ MongoDB connected");
		server.listen(PORT, () => {
			console.log(`🚀 API running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error(`❌ ${formatMongoConnectionFailure(error)}`);
		try {
			await mongoose.disconnect();
		} catch {
			console.error("❌ MongoDB cleanup after failed startup also failed.");
		}
		process.exitCode = 1;
	}
}

void startServer();

/* ---------- GRACEFUL SHUTDOWN ---------- */
let isShuttingDown = false;

async function shutdown(signal: string) {
	if (isShuttingDown) return;
	isShuttingDown = true;
	console.log(`🛑 Received ${signal}. Shutting down...`);

	try {
		if (server.listening) {
			await new Promise<void>((resolve, reject) => {
				server.close((error) => (error ? reject(error) : resolve()));
			});
		}
		await mongoose.connection.close(false);
		console.log("✅ Shutdown complete");
	} catch {
		console.error(
			"❌ Shutdown failed; server/database cleanup may be incomplete.",
		);
		process.exitCode = 1;
	}
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
	console.error(`❌ ${formatMongoConnectionFailure(reason)}`);
	void shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
	console.error(`❌ ${formatMongoConnectionFailure(error)}`);
	shutdown("uncaughtException");
});
