import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware";

export const authorize =
	(...allowedRoles: string[]) =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				message: "Access denied: insufficient permissions",
			});
		}
		next();
	};
