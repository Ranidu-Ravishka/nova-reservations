import mongoose from "mongoose";

type MongoConnectionFailureCategory =
	| "authentication"
	| "dns"
	| "timeout"
	| "network"
	| "configuration"
	| "server-selection"
	| "unknown";

type ErrorDetails = {
	codes: string[];
	names: string[];
	messages: string[];
};

function collectErrorDetails(error: unknown): ErrorDetails {
	const codes: string[] = [];
	const names: string[] = [];
	const messages: string[] = [];
	const pending: unknown[] = [error];
	const visited = new Set<object>();

	while (pending.length > 0) {
		const current = pending.pop();
		if (!current || typeof current !== "object" || visited.has(current)) {
			continue;
		}

		visited.add(current);
		const details = current as Record<string, unknown>;

		if (typeof details.code === "string" || typeof details.code === "number") {
			codes.push(String(details.code));
		}
		if (typeof details.codeName === "string") names.push(details.codeName);
		if (typeof details.name === "string") names.push(details.name);
		if (typeof details.message === "string") messages.push(details.message);
		pending.push(details.cause, details.reason, details.error);

		if (details.servers instanceof Map) {
			for (const server of details.servers.values()) {
				if (server && typeof server === "object") {
					pending.push((server as Record<string, unknown>).error);
				}
			}
		}
	}

	return { codes, names, messages };
}

function classifyMongoConnectionFailure(
	error: unknown,
): MongoConnectionFailureCategory {
	const details = collectErrorDetails(error);
	const codes = new Set(details.codes);
	const names = details.names.join(" ");
	const messages = details.messages.join(" ");

	if (
		codes.has("18") ||
		/authenticationfailed|authentication failed|bad auth/i.test(
			`${names} ${messages}`,
		)
	) {
		return "authentication";
	}
	if (
		["ENOTFOUND", "EAI_AGAIN", "EBADRESP", "ENODATA", "ESERVFAIL"].some(
			(code) => codes.has(code),
		) ||
		/querysrv|querytxt|dns resolution|name or service not known/i.test(messages)
	) {
		return "dns";
	}
	if (
		codes.has("ETIMEDOUT") ||
		/MongoNetworkTimeoutError|server selection timed out|timed out/i.test(
			`${names} ${messages}`,
		)
	) {
		return "timeout";
	}
	if (
		["ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ENETUNREACH", "EPIPE"].some(
			(code) => codes.has(code),
		) ||
		/MongoNetworkError/i.test(names)
	) {
		return "network";
	}
	if (
		/MONGO_URI environment variable is not set|MongoParseError|URI malformed|invalid connection string/i.test(
			`${names} ${messages}`,
		)
	) {
		return "configuration";
	}
	if (/MongoServerSelectionError/i.test(names)) {
		return "server-selection";
	}
	return "unknown";
}

export function formatMongoConnectionFailure(error: unknown): string {
	const category = classifyMongoConnectionFailure(error);

	switch (category) {
		case "authentication":
			return "MongoDB connection failed (authentication). Check the Atlas database username and password.";
		case "dns":
			return "MongoDB connection failed (DNS). Check the Atlas hostname and the DNS resolver; SRV lookup failed.";
		case "timeout":
			return "MongoDB connection failed (network timeout). Check outbound connectivity and Atlas availability.";
		case "network":
			return "MongoDB connection failed (network). Check routing, firewall rules, and the Atlas IP access list.";
		case "configuration":
			return "MongoDB connection failed (configuration). Check that MONGO_URI is a valid MongoDB URI.";
		case "server-selection":
			return "MongoDB connection failed (server selection). Check DNS, network access, and Atlas cluster availability.";
		default:
			return "MongoDB connection failed (unexpected error). Connection details were omitted from this log.";
	}
}

export async function connectDB(uri = process.env.MONGO_URI): Promise<void> {
	if (!uri?.trim()) {
		throw new Error("MONGO_URI environment variable is not set");
	}

	await mongoose.connect(uri);
}
