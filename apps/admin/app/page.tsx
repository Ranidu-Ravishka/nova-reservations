"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("http://localhost:4000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Login failed");
			}

			if (data.role !== "ADMIN") {
				throw new Error("Access denied. Admins only.");
			}

			// ✅ Save token
			localStorage.setItem("admin_token", data.token);

			// ✅ Redirect to dashboard
			router.push("/dashboard");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Something went wrong");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={handleLogin}
				className="w-full max-w-sm space-y-4 p-6 border rounded-lg shadow"
			>
				<h1 className="text-2xl font-bold text-center">Admin Login</h1>

				{error && <p className="text-red-600 text-sm text-center">{error}</p>}

				<input
					type="email"
					placeholder="Email"
					value={email}
					required
					onChange={(e) => setEmail(e.target.value)}
					className="w-full border p-2 rounded"
				/>

				<input
					type="password"
					placeholder="Password"
					value={password}
					required
					onChange={(e) => setPassword(e.target.value)}
					className="w-full border p-2 rounded"
				/>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50"
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
}
