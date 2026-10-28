import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

type RequestError = {
	code?: unknown;
	status?: unknown;
	type?: unknown;
};

export const errorHandler: ErrorRequestHandler = (
	error: unknown,
	_req,
	res,
	_next,
) => {
	if (error instanceof mongoose.Error.CastError) {
		return res.status(400).json({ message: "Invalid identifier" });
	}

	if (error instanceof mongoose.Error.ValidationError) {
		return res.status(400).json({ message: "Invalid request data" });
	}

	if (error && typeof error === "object") {
		const requestError = error as RequestError;
		if (requestError.code === 11000) {
			return res.status(409).json({ message: "Resource already exists" });
		}
		if (
			requestError.status === 400 ||
			requestError.status === "400" ||
			requestError.type === "entity.parse.failed"
		) {
			return res.status(400).json({ message: "Invalid request body" });
		}
		if (requestError.status === 413 || requestError.status === "413") {
			return res.status(413).json({ message: "Request body is too large" });
		}
	}

	console.error("Unhandled API error:", error);
	return res.status(500).json({ message: "Internal server error" });
};
