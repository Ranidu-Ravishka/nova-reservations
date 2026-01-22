"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	// ✅ Read redirect safely
	const redirect = searchParams.get("redirect") || "/";

	// ✅ OPTIONAL: auto-redirect if already logged in
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			router.replace(redirect);
		}
	}, [redirect, router]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await api.post("/auth/login", form);

			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.user));

			// ✅ redirect AFTER successful login
			router.push(redirect);
		} catch (err: unknown) {
			if (err && typeof err === "object" && "response" in err) {
				// @ts-expect-error axios error
				setError(err.response?.data?.message || "Login failed");
			} else {
				setError("Login failed");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen pt-24 flex items-center justify-center bg-charcoal">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-black">
				<h1 className="text-3xl font-serif font-semibold text-center mb-2">
					Welcome Back
				</h1>

				<p className="text-center text-gray-500 mb-8">
					Sign in to your account
				</p>

				{error && (
					<p className="mb-4 text-sm text-red-600 text-center">
						{error}
					</p>
				)}

				<form onSubmit={submit} className="space-y-5">
					<div>
						<Label>Email</Label>
						<Input
							type="email"
							required
							placeholder="you@email.com"
							value={form.email}
							onChange={(e) =>
								setForm({ ...form, email: e.target.value })
							}
						/>
					</div>

					<div>
						<Label>Password</Label>
						<Input
							type="password"
							required
							placeholder="••••••••"
							value={form.password}
							onChange={(e) =>
								setForm({ ...form, password: e.target.value })
							}
						/>
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="w-full bg-gold text-charcoal rounded-full py-6"
					>
						{loading ? "Logging in..." : "Login"}
					</Button>
				</form>

				<p className="mt-6 text-center text-sm text-gray-600">
					Don’t have an account?{" "}
					<Link
						href={`/register?redirect=${encodeURIComponent(
							redirect,
						)}`}
						className="text-gold font-medium hover:underline"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
