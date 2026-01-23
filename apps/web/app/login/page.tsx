"use client";

import { Eye, EyeOff, Loader2, Mail, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const BACKGROUND_IMAGE_URL =
	"https://www.travelplusstyle.com/wp-content/uploads/2024/09/Amanwella1-Sri-Lanka-Main-Swimming-Pool_1369.jpg";

function isValidEmail(value: string) {
	// Practical validation; avoids overly strict RFC rules.
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getLoginErrors(form: { email: string; password: string }) {
	const errors: Partial<Record<keyof typeof form, string>> = {};
	if (!form.email.trim()) errors.email = "Email is required";
	else if (!isValidEmail(form.email))
		errors.email = "Enter a valid email address";

	if (!form.password) errors.password = "Password is required";
	else if (form.password.length < 8)
		errors.password = "Password must be at least 8 characters";

	return errors;
}

function LoginContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [checkingAuth, setCheckingAuth] = useState(true);

	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [touched, setTouched] = useState({
		email: false,
		password: false,
	});

	const redirect = useMemo(() => {
		const raw = searchParams.get("redirect") || "/";
		if (!raw.startsWith("/")) return "/";
		if (raw.startsWith("/login") || raw.startsWith("/register")) return "/";
		return raw;
	}, [searchParams]);
	const fieldErrors = useMemo(() => getLoginErrors(form), [form]);
	const showEmailError = touched.email && !!fieldErrors.email;
	const showPasswordError = touched.password && !!fieldErrors.password;

	// ✅ OPTIONAL: auto-redirect if already logged in (without flicker)
	useEffect(() => {
		try {
			const token = localStorage.getItem("token");
			const storedUser = localStorage.getItem("user");
			if (token && storedUser) {
				const parsed = JSON.parse(storedUser) as {
					email?: string;
					name?: string;
					role?: string;
				} | null;
				if (parsed?.email && parsed?.name && parsed?.role) {
					router.replace(redirect);
					return;
				}
			}
		} catch {
			// ignore parse/storage errors
		}
		try {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		} catch {
			// ignore storage errors
		}
		setCheckingAuth(false);
	}, [redirect, router]);

	useEffect(() => {
		if (!checkingAuth) {
			// Focus the first field for keyboard users.
			emailRef.current?.focus();
		}
	}, [checkingAuth]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setTouched({ email: true, password: true });

		const errors = getLoginErrors(form);
		if (errors.email) {
			emailRef.current?.focus();
			return;
		}
		if (errors.password) {
			passwordRef.current?.focus();
			return;
		}

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

	if (checkingAuth) {
		return (
			<div className="min-h-screen pt-24 flex items-center justify-center bg-charcoal">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden bg-charcoal">
			{/* Background image */}
			<div
				className="absolute inset-0 auth-motion auth-bg"
				style={{
					backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					filter: "saturate(1.05)",
				}}
			/>

			{/* Overlays for readability + modern effect */}
			<div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-black/70" />
			<div
				aria-hidden="true"
				className="absolute -top-40 -left-40 h-144 w-xl rounded-full bg-gold/20 blur-3xl auth-motion auth-float"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-48 -right-48 h-168 w-2xl rounded-full bg-white/10 blur-3xl auth-motion auth-float auth-float--slow auth-float--reverse"
			/>

			<div className="relative w-full px-4">
				<div className="mx-auto w-full max-w-md">
					<div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
						<div className="mb-8 flex flex-col items-center text-center">
							<Link href="/" className="">
								<Image
									src="https://drive.google.com/uc?export=view&id=157D1c8TFTpM1ivRzzrCvkvAiFVpxdiIb"
									alt="NOVA"
									width={80}
									height={80}
									priority
								/>
							</Link>

							<h1 className="mt-5 text-3xl font-serif font-semibold text-white">
								Welcome back
							</h1>
							<p className="mt-2 text-sm text-white/70">
								Sign in to continue your luxury experience.
							</p>
						</div>

						{error && (
							<div
								role="alert"
								className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
							>
								{error}
							</div>
						)}

						<form onSubmit={submit} className="space-y-5" noValidate>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-white/85">
									Email
								</Label>
								<div className="relative">
									<Mail
										aria-hidden="true"
										className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55"
									/>
									<Input
										ref={emailRef}
										id="email"
										type="email"
										autoComplete="email"
										inputMode="email"
										placeholder="you@email.com"
										value={form.email}
										onChange={(e) =>
											setForm({ ...form, email: e.target.value })
										}
										onBlur={() => setTouched((t) => ({ ...t, email: true }))}
										aria-invalid={showEmailError}
										aria-describedby={
											showEmailError ? "email-error" : undefined
										}
										className="h-12 border-white/15 bg-white/10 pl-10 text-white placeholder:text-white/50 shadow-sm focus-visible:ring-gold/40"
									/>
								</div>
								{showEmailError && (
									<p
										id="email-error"
										className="text-sm text-red-200"
										aria-live="polite"
									>
										{fieldErrors.email}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-white/85">
									Password
								</Label>
								<div className="relative">
									<Shield
										aria-hidden="true"
										className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55"
									/>
									<Input
										ref={passwordRef}
										id="password"
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										placeholder="••••••••"
										value={form.password}
										onChange={(e) =>
											setForm({ ...form, password: e.target.value })
										}
										onBlur={() => setTouched((t) => ({ ...t, password: true }))}
										aria-invalid={showPasswordError}
										aria-describedby={
											showPasswordError ? "password-error" : "password-hint"
										}
										className="h-12 border-white/15 bg-white/10 pl-10 pr-11 text-white placeholder:text-white/50 shadow-sm focus-visible:ring-gold/40"
									/>
									<button
										type="button"
										className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
										onClick={() => setShowPassword((v) => !v)}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" aria-hidden="true" />
										) : (
											<Eye className="h-4 w-4" aria-hidden="true" />
										)}
									</button>
								</div>
								<p id="password-hint" className="text-xs text-white/60">
									Use at least 8 characters.
								</p>
								{showPasswordError && (
									<p
										id="password-error"
										className="text-sm text-red-200"
										aria-live="polite"
									>
										{fieldErrors.password}
									</p>
								)}
							</div>

							<Button
								type="submit"
								disabled={loading}
								className="h-12 w-full rounded-2xl bg-gold text-charcoal shadow-lg shadow-black/20 hover:bg-gold/90"
							>
								{loading ? (
									<span className="inline-flex items-center justify-center gap-2">
										<Loader2
											className="h-4 w-4 animate-spin"
											aria-hidden="true"
										/>
										Signing in…
									</span>
								) : (
									"Sign in"
								)}
							</Button>
						</form>

						<div className="mt-6 space-y-3 text-center">
							<p className="text-sm text-white/70">
								Don’t have an account?{" "}
								<Link
									href={`/register?redirect=${encodeURIComponent(redirect)}`}
									className="font-medium text-gold hover:underline"
								>
									Create one
								</Link>
							</p>
							<p className="text-xs text-white/60">
								Need help?{" "}
								<Link href="/contact" className="text-white/80 hover:underline">
									Contact support
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>

			<style>{`
				@media (prefers-reduced-motion: reduce) {
					.auth-motion {
						animation: none !important;
					}
				}
				.auth-bg {
					transform: scale(1.06);
					animation: auth-bg-pan 18s ease-in-out infinite;
					will-change: transform;
				}
				.auth-float {
					animation: auth-float 10s ease-in-out infinite;
					will-change: transform;
				}
				.auth-float--slow {
					animation-duration: 12s;
				}
				.auth-float--reverse {
					animation-direction: reverse;
				}
				@keyframes auth-bg-pan {
					0% {
						transform: scale(1.06) translate3d(0, 0, 0);
					}
					50% {
						transform: scale(1.12) translate3d(-1.5%, -1%, 0);
					}
					100% {
						transform: scale(1.06) translate3d(0, 0, 0);
					}
				}
				@keyframes auth-float {
					0%,
					100% {
						transform: translate3d(0, 0, 0);
					}
					50% {
						transform: translate3d(0, -22px, 0);
					}
				}
			`}</style>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen pt-24 flex items-center justify-center bg-charcoal">
					<div className="text-white">Loading...</div>
				</div>
			}
		>
			<LoginContent />
		</Suspense>
	);
}
