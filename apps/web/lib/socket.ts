"use client";

import { io, type Socket } from "socket.io-client";

/* ---------------- TYPES ---------------- */
export interface AvailabilityUpdatePayload {
  roomId: string;
  remaining: number;
}

/* ---------------- SOCKET URL ---------------- */
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/* ---------------- SINGLETON SOCKET INSTANCE ---------------- */
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,      // connect immediately
  transports: ["websocket"], // use WebSocket only
});
