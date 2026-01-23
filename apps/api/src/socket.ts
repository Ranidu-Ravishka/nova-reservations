import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let io: Server;

const DEFAULT_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

function getAllowedOrigins(): string[] {
	const raw =
		process.env.SOCKET_CORS_ORIGINS ||
		process.env.CLIENT_ORIGIN ||
		process.env.NEXT_PUBLIC_APP_URL ||
		"";

	const parsed = raw
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	return parsed.length > 0 ? parsed : DEFAULT_ORIGINS;
}

/* ---------- INIT SOCKET ---------- */
export function initSocket(server: HttpServer) {
	io = new Server(server, {
		cors: {
			origin: getAllowedOrigins(),
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("🔌 Client connected:", socket.id);

		socket.on("disconnect", () => {
			console.log("❌ Client disconnected:", socket.id);
		});
	});

	return io;
}

/* ---------- GET IO INSTANCE ---------- */
export function getIO(): Server {
	if (!io) {
		throw new Error("Socket.io not initialized");
	}
	return io;
}
