import "server-only";

import { headers } from "next/headers";
import type { Hotel } from "@/types/hotel";
import type { Room } from "@/types/room";

async function getRequestOrigin() {
	const h = await headers();
	const protocol = h.get("x-forwarded-proto") ?? "http";
	const host = h.get("x-forwarded-host") ?? h.get("host");

	if (host) return `${protocol}://${host}`;

	// Fallback for non-request contexts (build time, tests, etc.)
	return "http://localhost:3000";
}

async function fetchJson<T>(path: string): Promise<T | null> {
	try {
		const origin = await getRequestOrigin();
		const res = await fetch(`${origin}${path}`, { cache: "no-store" });
		if (!res.ok) return null;
		return (await res.json()) as T;
	} catch {
		return null;
	}
}

export async function fetchRoomByIdServer(id: string): Promise<Room | null> {
	if (!id || id === "undefined") return null;
	return fetchJson<Room>(`/api/rooms/${encodeURIComponent(id)}`);
}

export async function fetchHotelByIdServer(id: string): Promise<Hotel | null> {
	if (!id || id === "undefined") return null;
	return fetchJson<Hotel>(`/api/hotels/${encodeURIComponent(id)}`);
}

export async function fetchRoomsByHotelServer(
	hotelId: string,
): Promise<unknown[]> {
	if (!hotelId || hotelId === "undefined") return [];
	const res = await fetchJson<unknown>(
		`/api/rooms?hotelId=${encodeURIComponent(hotelId)}`,
	);
	return Array.isArray(res) ? res : [];
}
