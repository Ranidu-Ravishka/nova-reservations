"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/api";
import { Roles } from "@/lib/roles";

const schema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const next = searchParams.get("next") || "/dashboard";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: FormValues) {
		try {
			const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Login failed");
			}

			if (data.role !== Roles.ADMIN) {
				throw new Error("Access denied. Admins only.");
			}

			localStorage.setItem("admin_token", data.token);
			toast.success("Welcome back");
			router.push(next);
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : "Login failed");
		}
	}

	return (
		<Card className="w-full max-w-sm shadow-sm">
			<CardHeader>
				<CardTitle>Admin Login</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							autoComplete="email"
							placeholder="admin@nova.com"
							{...register("email")}
						/>
						{errors.email ? (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						) : null}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							placeholder="••••••••"
							{...register("password")}
						/>
						{errors.password ? (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						) : null}
					</div>

					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in…
							</>
						) : (
							"Sign in"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
