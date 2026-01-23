"use client";

import { io, type Socket } from "socket.io-client";

export interface AvailabilityUpdatePayload {
  roomId: string;
  remaining: number;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/* ---------- SINGLETON SOCKET ---------- */
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,      // ✅ IMPORTANT
  transports: ["websocket"],
});
