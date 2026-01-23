import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
	if (!socket) {
		socket = io("http://localhost:4000", {
			withCredentials: true,
		});
	}
	return socket;
};
