type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === "object" && value !== null;
}

function asStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.filter((v): v is string => typeof v === "string")
		.map((s) => s.trim())
		.filter(Boolean);
}

function tryExtractGoogleRedirectTarget(url: URL): string | null {
	// Common copy/paste: https://www.google.com/url?...&url=https%3A%2F%2F...
	if (url.hostname !== "www.google.com" || url.pathname !== "/url") return null;
	const target = url.searchParams.get("url");
	if (!target) return null;
	try {
		return decodeURIComponent(target);
	} catch {
		return target;
	}
}

function isAllowedRemoteUrl(url: URL): boolean {
	// Admin-entered image URLs can come from many CDNs.
	// Only enforce a safe protocol here.
	return url.protocol === "https:" || url.protocol === "http:";
}

export function normalizeImageUrl(input: unknown): string | null {
	if (typeof input !== "string") return null;
	const value = input.trim();
	if (!value) return null;

	if (
		value.startsWith("http://") ||
		value.startsWith("https://") ||
		value.startsWith("data:")
	) {
		// For external URLs used in next/image, restrict to configured hosts.
		// Also drop common Google redirect URLs which are not direct image assets.
		if (value.startsWith("data:")) return value;
		try {
			const parsed = new URL(value);
			const redirected = tryExtractGoogleRedirectTarget(parsed);
			if (redirected) {
				const redirectedUrl = new URL(redirected);
				return isAllowedRemoteUrl(redirectedUrl)
					? redirectedUrl.toString()
					: null;
			}
			return isAllowedRemoteUrl(parsed) ? parsed.toString() : null;
		} catch {
			return null;
		}
	}

	if (value.startsWith("//")) {
		try {
			const parsed = new URL(`https:${value}`);
			return isAllowedRemoteUrl(parsed) ? parsed.toString() : null;
		} catch {
			return null;
		}
	}

	if (value.startsWith("/")) {
		return value;
	}

	// Treat as app-relative path (public/ or routed asset)
	return `/${value}`;
}

/**
 * Accepts multiple historic shapes:
 * - string[] (current API model)
 * - { hero?: string; listing?: string; gallery?: string[] }
 * - { shared?: string[]; unique?: string[] }
 */
export function getHotelImageList(images: unknown): string[] {
	// Current API schema: string[]
	if (Array.isArray(images)) {
		return asStringArray(images)
			.map((s) => normalizeImageUrl(s) || "")
			.filter(Boolean);
	}

	if (!isRecord(images)) return [];

	// Older web shape: { hero, listing, gallery }
	const hero = normalizeImageUrl(images.hero);
	const listing = normalizeImageUrl(images.listing);
	const gallery = asStringArray(images.gallery)
		.map((s) => normalizeImageUrl(s) || "")
		.filter(Boolean);

	if (hero || listing || gallery.length) {
		return [hero, listing, ...gallery].filter((v): v is string => Boolean(v));
	}

	// Older detail shape: { shared, unique }
	const shared = asStringArray(images.shared)
		.map((s) => normalizeImageUrl(s) || "")
		.filter(Boolean);
	const unique = asStringArray(images.unique)
		.map((s) => normalizeImageUrl(s) || "")
		.filter(Boolean);
	return [...shared, ...unique];
}

export function getHotelPrimaryImage(images: unknown): string {
	return getHotelImageList(images)[0] || "/placeholder.svg";
}
