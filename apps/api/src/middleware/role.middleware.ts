import type { NextFunction, Response } from "express";
import type { Role } from "../constants/roles";
import type { AuthRequest } from "./auth.middleware";

// Authorize by role; compares case-insensitively to avoid string mismatches
export const authorize =
	(...allowedRoles: Role[]) =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		const userRole = req.user?.role?.toUpperCase();
		const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

		if (!userRole || !normalizedAllowed.includes(userRole)) {
			return res.status(403).json({
				message: "Access denied: insufficient permissions",
			});
		}
		next();
	};
