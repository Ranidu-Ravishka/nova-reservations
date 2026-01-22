import axios, { type InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = axios.create({
	baseURL: API_BASE_URL,
});

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

// Auto-handle auth failures globally
api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;
		if (typeof window !== "undefined" && (status === 401 || status === 403)) {
			try {
				localStorage.removeItem("admin_token");
			} catch {
				// ignore storage access errors (e.g., blocked by browser/privacy settings)
			}
			// Redirect to login
			window.location.assign("/");
		}
		return Promise.reject(error);
	},
);
