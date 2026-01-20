import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/* ---------------- AUTH ---------------- */

export async function loginUser(email: string, password: string) {
	const res = await fetch(`${API_BASE_URL}/auth/login`, {
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

/* ---------------- AXIOS INSTANCE ---------------- */

export const api = axios.create({
	baseURL: API_BASE_URL,
});

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("token");

			if (token) {
				// Axios v1+ guarantees headers object
				config.headers.Authorization = `Bearer ${token}`;
			}
		}

		return config;
	},
	(error) => Promise.reject(error),
);

/* ---------------- HOTELS ---------------- */

export async function fetchHotels() {
	const res = await fetch(`${API_BASE_URL}/hotels`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed to fetch hotels");
	}

	return res.json();
}

export async function fetchHotelById(id: string) {
	const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Hotel not found");
	}

	return res.json();
}

/* ---------------- ROOMS ---------------- */

export async function fetchRoomById(id: string) {
	const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Room not found");
	}

	return res.json();
}

export async function fetchRoomsByHotel(hotelId: string) {
	const res = await fetch(`${API_BASE_URL}/rooms?hotel=${hotelId}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed to fetch rooms");
	}

	return res.json();
}

/* ---------------- BOOKINGS ---------------- */

export async function createReservation(
	token: string,
	payload: Record<string, unknown>,
) {
	const res = await fetch(`${API_BASE_URL}/reservations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Booking failed");
	}

	return res.json();
}
