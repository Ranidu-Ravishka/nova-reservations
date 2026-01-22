import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";

/* ---------------- AXIOS INSTANCE ---------------- */

export const api = axios.create({
	baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Standardize auth failure handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;
		if (typeof window !== "undefined" && (status === 401 || status === 403)) {
			try {
				localStorage.removeItem("token");
			} catch {
				// ignore storage errors (e.g., disabled storage, security restrictions)
			}
		}
		return Promise.reject(error);
	},
);

/* ---------------- AUTH ---------------- */

export async function loginUser(email: string, password: string) {
	const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Login failed");
	}

	return res.json();
}

/* ---------------- HOTELS ---------------- */

export async function fetchHotels() {
	try {
		const res = await fetch(`${API_BASE_URL}/api/hotels`, {
			cache: "no-store",
		});

		if (!res.ok) {
			return [];
		}

		return res.json();
	} catch {
		return [];
	}
}

export async function fetchHotelById(id: string) {
	if (!id || id === "undefined") return null;
	try {
		const res = await fetch(
			`${API_BASE_URL}/api/hotels/${encodeURIComponent(id)}`,
			{
				cache: "no-store",
			},
		);

		if (!res.ok) {
			return null;
		}

		return res.json();
	} catch {
		return null;
	}
}

/* ---------------- ROOMS ---------------- */

export async function fetchRoomById(id: string) {
	if (!id || id === "undefined") return null;
	try {
		const res = await fetch(
			`${API_BASE_URL}/api/rooms/${encodeURIComponent(id)}`,
			{
				cache: "no-store",
			},
		);

		if (!res.ok) {
			return null; // ✅ DO NOT THROW
		}

		return res.json();
	} catch {
		return null;
	}
}

export async function fetchRoomsByHotel(hotelId: string) {
	if (!hotelId || hotelId === "undefined") return [];
	try {
		const res = await fetch(
			`${API_BASE_URL}/api/rooms?hotelId=${encodeURIComponent(hotelId)}`,
			{
				cache: "no-store",
			},
		);

		if (!res.ok) {
			return [];
		}

		return res.json();
	} catch {
		return [];
	}
}

/* ---------------- RESERVATIONS ---------------- */

export async function createReservation(payload: {
	roomTypeId: string;
	checkIn: string;
	checkOut: string;
	adults: number;
	roomsBooked: number;
}) {
	const res = await api.post("/reservations", payload);
	return res.data;
}

export async function fetchReservationById(id: string) {
	if (!id || id === "undefined") return null;
	try {
		const res = await fetch(
			`${API_BASE_URL}/api/reservations/${encodeURIComponent(id)}`,
			{
				cache: "no-store",
			},
		);

		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

export async function checkRoomAvailability(payload: {
	roomTypeId: string;
	checkIn: string;
	checkOut: string;
}) {
	const res = await api.post("/availability/check", payload);
	return res.data;
}

/* ---------------- TRANSPORT ---------------- */

export type TransportService = {
	_id: string;
	type: string;
	price: number;
	route: string;
	capacity: number;
	createdAt?: string;
	updatedAt?: string;
};

export async function fetchTransports(): Promise<TransportService[]> {
	try {
		const res = await fetch(`${API_BASE_URL}/api/transports`, {
			cache: "no-store",
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

export type CreateTransportRequestPayload = {
	transportId: string;
	name: string;
	email: string;
	phone: string;
	pickupLocation?: string;
	dropoffLocation?: string;
	pickupDate?: string;
	passengers?: number;
	notes?: string;
};

export type TransportRequest = {
	_id: string;
	transportId: string;
	name: string;
	email: string;
	phone: string;
	pickupLocation?: string;
	dropoffLocation?: string;
	pickupDate?: string;
	passengers?: number;
	notes?: string;
	status?: "PENDING" | "CONFIRMED" | "CANCELLED";
	createdAt?: string;
	updatedAt?: string;
};

export async function createTransportRequest(
	payload: CreateTransportRequestPayload,
) {
	const res = await api.post<TransportRequest>("/transport-requests", payload);
	return res.data;
}
