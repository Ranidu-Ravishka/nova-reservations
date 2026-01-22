import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
	id: string;
	role: string;
}

export interface AuthRequest extends Request {
	user?: JwtPayload;
}

export const authenticate = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return res.status(500).json({ message: "Server misconfiguration" });
		}
		const decoded = jwt.verify(token, secret) as JwtPayload;
		req.user = decoded;
		next();
	} catch {
		return res.status(403).json({ message: "Invalid token" });
	}
};

// Backwards-compatible aliases (some routes still import these older names)
export const requireAuth = authenticate;
export const UserModel = authenticate;
