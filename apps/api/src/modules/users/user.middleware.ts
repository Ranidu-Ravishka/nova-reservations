import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type UserPayload = Record<string, unknown> & { role?: string };

interface AuthRequest extends Request {
	user?: UserPayload;
}

export const protect = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Not authorized" });
	}

	try {
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

		if (typeof decoded === "object" && decoded !== null) {
			req.user = decoded as UserPayload;
			next();
		} else {
			return res.status(401).json({ message: "Token invalid" });
		}
	} catch {
		return res.status(401).json({ message: "Token invalid" });
	}
};

export const authorize =
	(...roles: string[]) =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user?.role || !roles.includes(String(req.user.role))) {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	};
