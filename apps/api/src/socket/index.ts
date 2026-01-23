import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
	io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("🔌 Socket connected:", socket.id);

		socket.on("disconnect", () => {
			console.log("❌ Socket disconnected:", socket.id);
		});
	});

	return io;
};

export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized");
	}
	return io;
};
