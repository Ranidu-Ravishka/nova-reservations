import axios, { type InternalAxiosRequestConfig } from "axios";

/* ---------------- BASE URL ---------------- */

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ---------------- AXIOS INSTANCE ---------------- */

export const api = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	withCredentials: true, // required if you use cookies or sessions
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("admin_token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;

		if (typeof window !== "undefined" && (status === 401 || status === 403)) {
			try {
				localStorage.removeItem("admin_token");
			} catch {
				// ignore
			}

			// redirect to admin login
			window.location.assign("/");
		}

		return Promise.reject(error);
	},
);
