"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await api.post("/auth/login", form);

			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.user));

			router.push("/"); // redirect to home
		} catch (err: any) {
			setError(err.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-cream">
			<form
				onSubmit={submit}
				className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
			>
				<h1 className="text-3xl font-serif mb-6 text-center">Login</h1>

				{error && <p className="text-red-500 mb-4">{error}</p>}

				<div className="space-y-4">
					<div>
						<Label>Email</Label>
						<Input
							type="email"
							required
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
						/>
					</div>

					<div>
						<Label>Password</Label>
						<Input
							type="password"
							required
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
						/>
					</div>

					<Button className="w-full" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</Button>
				</div>
			</form>
		</div>
	);
}
