"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
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

			// Save token
			localStorage.setItem("user_token", data.token);

			// Redirect to home
			router.push("/");
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Login failed");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md bg-white p-8 rounded-xl shadow"
			>
				<h1 className="text-2xl font-bold mb-6">Login</h1>

				{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

				<div className="mb-4">
					<label htmlFor="email" className="block text-sm mb-1">
						Email
					</label>
					<input
						id="email"
						type="email"
						className="w-full border rounded px-3 py-2"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="password" className="block text-sm mb-1">
						Password
					</label>
					<input
						id="password"
						type="password"
						className="w-full border rounded px-3 py-2"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
}
