"use client";

import {
	Bed,
	Building2,
	CalendarDays,
	DollarSign,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

/* ---------------- TYPES ---------------- */

interface Stats {
	totalHotels: number;
	availableRooms: number;
	activeReservations: number;
	monthlyRevenue: number;
}

interface StatCard {
	title: string;
	value: number | string;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
}

/* ---------------- COMPONENT ---------------- */

export default function Dashboard() {
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/* -------------------------
     FETCH
  -------------------------- */
	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		api
			.get("/admin/dashboard")
			.then((res) => {
				if (cancelled) return;
				setStats(res.data as Stats);
			})
			.catch((e) => {
				if (cancelled) return;
				setError(getErrorMessage(e, "Failed to load dashboard"));
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	/* -------------------------
     BUILD DASHBOARD CARDS
  -------------------------- */
	const statCards: StatCard[] = stats
		? [
				{
					title: "Total Hotels",
					value: stats.totalHotels,
					icon: <Building2 className="h-5 w-5" />,
					color: "text-amber-200",
					bgColor: "bg-white/5",
				},
				{
					title: "Available Rooms",
					value: stats.availableRooms,
					icon: <Bed className="h-5 w-5" />,
					color: "text-emerald-300",
					bgColor: "bg-white/5",
				},
				{
					title: "Active Reservations",
					value: stats.activeReservations,
					icon: <CalendarDays className="h-5 w-5" />,
					color: "text-sky-300",
					bgColor: "bg-white/5",
				},
				{
					title: "Monthly Revenue",
					value: `$${stats.monthlyRevenue}`,
					icon: <DollarSign className="h-5 w-5" />,
					color: "text-amber-300",
					bgColor: "bg-white/5",
				},
			]
		: [];

	const isReady = !loading && !!stats;

	const retry = () => {
		setLoading(true);
		setError(null);
		api
			.get("/admin/dashboard")
			.then((res) => setStats(res.data as Stats))
			.catch((e) => setError(getErrorMessage(e, "Failed to load dashboard")))
			.finally(() => setLoading(false));
	};

	return (
		<PageContainer>
			<PageHeader
				title="Dashboard"
				description="Overview of your hotel management system"
				actions={
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className="border-primary/30 bg-primary/10 text-primary"
						>
							Last 30 days
						</Badge>
						<Badge className="bg-primary text-primary-foreground">
							Real-time
						</Badge>
					</div>
				}
			/>

			{error ? (
				<EmptyState
					title="Couldn’t load dashboard"
					description={error}
					action={<RetryButton onClick={retry} />}
				/>
			) : null}

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				{loading
					? ["a", "b", "c", "d"].map((k) => (
							<Card key={k} className="luxury-card border-0">
								<CardContent className="p-6 space-y-4">
									<Skeleton className="h-12 w-12 rounded-lg" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-8 w-28" />
									</div>
								</CardContent>
							</Card>
						))
					: statCards.map((stat) => (
							<Card
								key={stat.title}
								className="luxury-card border-0 transition-all duration-200 hover:-translate-y-1"
							>
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className={`p-3 rounded-xl ${stat.bgColor}`}>
											<div className={stat.color}>{stat.icon}</div>
										</div>
									</div>

									<div className="space-y-2">
										<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
											{stat.title}
										</p>
										<p className="text-3xl md:text-4xl font-display font-semibold">
											{stat.value}
										</p>
									</div>
								</CardContent>
							</Card>
						))}
			</div>

			{/* Extra Panels */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2 luxury-card">
					<CardHeader>
						<CardTitle className="text-lg">Performance Metrics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{isReady ? (
							<>
								<Metric label="Occupancy Rate" value="78%" />
								<Metric label="Average Daily Rate" value="$189" />
								<Metric label="Guest Satisfaction" value="4.8 / 5" />
							</>
						) : (
							<div className="space-y-3">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="luxury-card">
					<CardHeader>
						<CardTitle className="text-lg">Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{isReady ? (
							<>
								<QuickAction
									title="Check-in Today"
									subtitle="12 arrivals scheduled"
								/>
								<QuickAction
									title="Check-out Today"
									subtitle="8 departures scheduled"
								/>
								<QuickAction
									title="Pending Requests"
									subtitle="5 requests awaiting"
								/>
							</>
						) : (
							<div className="space-y-3">
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</PageContainer>
	);
}

/* -------------------------
   SMALL COMPONENTS
-------------------------- */

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
			<span className="text-sm text-muted-foreground">{label}</span>
			<div className="flex items-center gap-2">
				<span className="font-display text-lg">{value}</span>
				<TrendingUp className="h-4 w-4 text-primary" />
			</div>
		</div>
	);
}

function QuickAction({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<button
			type="button"
			className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
		>
			<div className="font-medium text-foreground">{title}</div>
			<div className="text-sm text-muted-foreground">{subtitle}</div>
		</button>
	);
}
