import bcrypt from "bcryptjs";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Roles } from "../constants/roles";
import { UserModel } from "../models/User"; // adjust path if needed

const router = Router();

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body as {
			name?: string;
			email?: string;
			password?: string;
		};

		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ message: "Name, email and password are required" });
		}

		if (typeof password !== "string" || password.length < 8) {
			return res
				.status(400)
				.json({ message: "Password must be at least 8 characters" });
		}

		const normalizedEmail = String(email).trim().toLowerCase();
		const existing = await UserModel.findOne({ email: normalizedEmail });
		if (existing) {
			return res.status(409).json({ message: "Email is already registered" });
		}

		const user = await UserModel.create({
			name: String(name).trim(),
			email: normalizedEmail,
			password,
			role: Roles.CUSTOMER,
		});

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			console.error("Missing JWT_SECRET environment variable");
			return res.status(500).json({ message: "Server misconfiguration" });
		}

		const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
			expiresIn: "1d",
		});

		return res.status(201).json({
			token,
			role: user.role,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err: unknown) {
		// Mongo duplicate key error (unique email)
		if (err && typeof err === "object") {
			const mongoCode = (err as { code?: unknown }).code;
			if (mongoCode === 11000 || mongoCode === "11000") {
				return res.status(409).json({ message: "Email is already registered" });
			}
		}
		console.error("Register error:", err);
		return res.status(500).json({ message: "Server error" });
	}
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
	try {
		const { name, email, password } = req.body as {
			name?: string;
			email?: string;
			password?: string;
		};

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password required" });
		}

		// `password` is excluded by default in the schema, so we must explicitly select it
		const user = await UserModel.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		if (!user.password) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			console.error("Missing JWT_SECRET environment variable");
			return res.status(500).json({ message: "Server misconfiguration" });
		}

		const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
			expiresIn: "1d",
		});

		res.json({
			token,
			role: user.role,
			user: {
				id: user._id,
				email: user.email,
			},
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
