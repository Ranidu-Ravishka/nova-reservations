import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
	id: string;
	role: string;
}

export const protect = (
	req: Request & { user?: JwtPayload },
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Not authorized" });
	}

	try {
		const token = authHeader.split(" ")[1];
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return res.status(500).json({ message: "Server misconfiguration" });
		}
		const decoded = jwt.verify(token, secret) as JwtPayload;

		req.user = decoded;
		next();
	} catch {
		return res.status(401).json({ message: "Token invalid" });
	}
};

export const adminOnly = (
	req: Request & { user?: JwtPayload },
	res: Response,
	next: NextFunction,
) => {
	if (req.user?.role !== "ADMIN") {
		return res.status(403).json({ message: "Admins only" });
	}
	next();
};
