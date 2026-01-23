import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware";

export function requireAdmin(
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) {
	if (req.user?.role !== "ADMIN") {
		return res.status(403).json({ message: "Admins only" });
	}
	next();
}
