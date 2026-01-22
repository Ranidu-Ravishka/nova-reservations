function normalizeBaseUrl(value: string) {
	return value.replace(/\/+$/, "");
}

const envBaseUrl =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	process.env.API_BASE_URL ||
	process.env.API_URL ||
	"";

// Next server-side `fetch()` (Node/undici) requires an absolute URL.
// Use a sensible dev fallback so pages don't crash when the env var is missing.
const devFallback =
	process.env.NODE_ENV === "development" ? "http://127.0.0.1:4000" : "";

// Client-side code (browser) also needs a working absolute URL in dev,
// otherwise axios will call the Next.js app origin (e.g. http://localhost:3000/api/...)
// and registration/login will fail.
const clientBaseUrl = normalizeBaseUrl(envBaseUrl || devFallback);
const serverBaseUrl = normalizeBaseUrl(envBaseUrl || devFallback);

export const API_BASE_URL =
	typeof window === "undefined" ? serverBaseUrl : clientBaseUrl;
