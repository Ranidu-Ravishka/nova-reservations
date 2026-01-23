import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let io: Server;

/* ---------- INIT SOCKET ---------- */
export function initSocket(server: HttpServer) {
	io = new Server(server, {
		cors: {
			origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
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
