import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

/* ---------- EXTENDED REQUEST ---------- */
export interface AuthRequest extends Request {
	user?: {
		id: string;
		role: string;
	};
}

/* ---------- AUTH MIDDLEWARE ---------- */
export function requireAuth(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error("JWT_SECRET not set");
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

		// Type guard to ensure decoded has required properties
		if (
			typeof decoded !== "string" &&
			decoded &&
			"id" in decoded &&
			"role" in decoded
		) {
			req.user = {
				id: decoded.id as string,
				role: decoded.role as string,
			};
			next();
		} else {
			return res.status(401).json({ message: "Invalid token payload" });
		}
	} catch {
		return res.status(401).json({ message: "Invalid token" });
	}
}
