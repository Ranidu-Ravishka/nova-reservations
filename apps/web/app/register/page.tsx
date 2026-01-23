"use client";

import { Eye, EyeOff, Loader2, Mail, Shield, User } from "lucide-react";
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
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getRegisterErrors(form: {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}) {
	const errors: Partial<Record<keyof typeof form, string>> = {};

	if (!form.name.trim()) errors.name = "Full name is required";
	else if (form.name.trim().length < 2)
		errors.name = "Name must be at least 2 characters";

	if (!form.email.trim()) errors.email = "Email is required";
	else if (!isValidEmail(form.email))
		errors.email = "Enter a valid email address";

	if (!form.password) errors.password = "Password is required";
	else if (form.password.length < 8)
		errors.password = "Password must be at least 8 characters";

	if (!form.confirmPassword)
		errors.confirmPassword = "Please confirm your password";
	else if (form.confirmPassword !== form.password)
		errors.confirmPassword = "Passwords do not match";

	return errors;
}

function RegisterContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const nameRef = useRef<HTMLInputElement | null>(null);
	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);
	const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [touched, setTouched] = useState({
		name: false,
		email: false,
		password: false,
		confirmPassword: false,
	});

	const redirect = searchParams.get("redirect") || "/";
	const fieldErrors = useMemo(() => getRegisterErrors(form), [form]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			router.replace(redirect);
		}
	}, [redirect, router]);

	useEffect(() => {
		nameRef.current?.focus();
	}, []);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setTouched({
			name: true,
			email: true,
			password: true,
			confirmPassword: true,
		});

		const errors = getRegisterErrors(form);
		if (errors.name) {
			nameRef.current?.focus();
			return;
		}
		if (errors.email) {
			emailRef.current?.focus();
			return;
		}
		if (errors.password) {
			passwordRef.current?.focus();
			return;
		}
		if (errors.confirmPassword) {
			confirmPasswordRef.current?.focus();
			return;
		}

		setLoading(true);

		try {
			const res = await api.post("/auth/register", {
				name: form.name,
				email: form.email,
				password: form.password,
			});

			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.user));

			router.push(redirect);
		} catch (err: unknown) {
			if (err && typeof err === "object" && "response" in err) {
				// @ts-expect-error axios error
				setError(err.response?.data?.message || "Registration failed");
			} else {
				setError("Registration failed");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden bg-charcoal">
			<div
				className="absolute inset-0 auth-motion auth-bg"
				style={{
					backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					filter: "saturate(1.05)",
				}}
			/>
			<div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-black/70" />
			<div
				aria-hidden="true"
				className="absolute -top-40 -left-40 h-144 w-xl rounded-full bg-gold/20 blur-3xl auth-motion auth-float"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-48 -right-48 h-168 w-xl rounded-full bg-white/10 blur-3xl auth-motion auth-float auth-float--slow auth-float--reverse"
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
								Create your account
							</h1>
							<p className="mt-2 text-sm text-white/70">
								Join NOVA luxury experiences in minutes.
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
								<Label htmlFor="name" className="text-white/85">
									Full name
								</Label>
								<div className="relative">
									<User
										aria-hidden="true"
										className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55"
									/>
									<Input
										ref={nameRef}
										id="name"
										autoComplete="name"
										placeholder="Your name"
										value={form.name}
										onChange={(e) => setForm({ ...form, name: e.target.value })}
										onBlur={() => setTouched((t) => ({ ...t, name: true }))}
										aria-invalid={touched.name && !!fieldErrors.name}
										aria-describedby={
											touched.name && fieldErrors.name
												? "name-error"
												: undefined
										}
										className="h-12 border-white/15 bg-white/10 pl-10 text-white placeholder:text-white/50 shadow-sm focus-visible:ring-gold/40"
									/>
								</div>
								{touched.name && fieldErrors.name && (
									<p
										id="name-error"
										className="text-sm text-red-200"
										aria-live="polite"
									>
										{fieldErrors.name}
									</p>
								)}
							</div>

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
										aria-invalid={touched.email && !!fieldErrors.email}
										aria-describedby={
											touched.email && fieldErrors.email
												? "email-error"
												: undefined
										}
										className="h-12 border-white/15 bg-white/10 pl-10 text-white placeholder:text-white/50 shadow-sm focus-visible:ring-gold/40"
									/>
								</div>
								{touched.email && fieldErrors.email && (
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
										autoComplete="new-password"
										placeholder="••••••••"
										value={form.password}
										onChange={(e) =>
											setForm({ ...form, password: e.target.value })
										}
										onBlur={() => setTouched((t) => ({ ...t, password: true }))}
										aria-invalid={touched.password && !!fieldErrors.password}
										aria-describedby={
											touched.password && fieldErrors.password
												? "password-error"
												: "password-hint"
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
								{touched.password && fieldErrors.password && (
									<p
										id="password-error"
										className="text-sm text-red-200"
										aria-live="polite"
									>
										{fieldErrors.password}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-white/85">
									Confirm password
								</Label>
								<div className="relative">
									<Shield
										aria-hidden="true"
										className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55"
									/>
									<Input
										ref={confirmPasswordRef}
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										autoComplete="new-password"
										placeholder="••••••••"
										value={form.confirmPassword}
										onChange={(e) =>
											setForm({ ...form, confirmPassword: e.target.value })
										}
										onBlur={() =>
											setTouched((t) => ({ ...t, confirmPassword: true }))
										}
										aria-invalid={
											touched.confirmPassword && !!fieldErrors.confirmPassword
										}
										aria-describedby={
											touched.confirmPassword && fieldErrors.confirmPassword
												? "confirm-password-error"
												: undefined
										}
										className="h-12 border-white/15 bg-white/10 pl-10 pr-11 text-white placeholder:text-white/50 shadow-sm focus-visible:ring-gold/40"
									/>
									<button
										type="button"
										className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
										onClick={() => setShowConfirmPassword((v) => !v)}
										aria-label={
											showConfirmPassword
												? "Hide confirm password"
												: "Show confirm password"
										}
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4" aria-hidden="true" />
										) : (
											<Eye className="h-4 w-4" aria-hidden="true" />
										)}
									</button>
								</div>
								{touched.confirmPassword && fieldErrors.confirmPassword && (
									<p
										id="confirm-password-error"
										className="text-sm text-red-200"
										aria-live="polite"
									>
										{fieldErrors.confirmPassword}
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
										Creating account…
									</span>
								) : (
									"Create account"
								)}
							</Button>
						</form>

						<div className="mt-6 space-y-3 text-center">
							<p className="text-sm text-white/70">
								Already have an account?{" "}
								<Link
									href={`/login?redirect=${encodeURIComponent(redirect)}`}
									className="font-medium text-gold hover:underline"
								>
									Sign in
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

export default function RegisterPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen pt-24 flex items-center justify-center bg-charcoal">
					<div className="text-white">Loading...</div>
				</div>
			}
		>
			<RegisterContent />
		</Suspense>
	);
}
