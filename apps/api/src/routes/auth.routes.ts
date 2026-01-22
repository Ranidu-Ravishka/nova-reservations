import bcrypt from "bcryptjs";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Create token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Respond
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
