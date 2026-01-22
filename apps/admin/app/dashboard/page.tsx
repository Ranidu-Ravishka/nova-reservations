"use client";

import {
	Bed,
	Building2,
	CalendarDays,
	DollarSign,
	TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

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
	const router = useRouter();
	const [stats, setStats] = useState<Stats | null>(null);

	/* -------------------------
     AUTH GUARD + FETCH
  -------------------------- */
	useEffect(() => {
		const token = localStorage.getItem("admin_token");

		if (!token) {
			router.replace("/");
			return;
		}

		api
			.get("/admin/dashboard")
			.then((res) => setStats(res.data as Stats))
			.catch(() => {
				localStorage.removeItem("admin_token");
				router.replace("/");
			});
	}, [router]);

	/* -------------------------
     BUILD DASHBOARD CARDS
  -------------------------- */
	const statCards: StatCard[] = stats
		? [
				{
					title: "Total Hotels",
					value: stats.totalHotels,
					icon: <Building2 className="h-5 w-5" />,
					color: "text-blue-600",
					bgColor: "bg-blue-50",
				},
				{
					title: "Available Rooms",
					value: stats.availableRooms,
					icon: <Bed className="h-5 w-5" />,
					color: "text-emerald-600",
					bgColor: "bg-emerald-50",
				},
				{
					title: "Active Reservations",
					value: stats.activeReservations,
					icon: <CalendarDays className="h-5 w-5" />,
					color: "text-violet-600",
					bgColor: "bg-violet-50",
				},
				{
					title: "Monthly Revenue",
					value: `$${stats.monthlyRevenue}`,
					icon: <DollarSign className="h-5 w-5" />,
					color: "text-amber-600",
					bgColor: "bg-amber-50",
				},
			]
		: [];

	/* -------------------------
     LOADING STATE
  -------------------------- */
	if (!stats) {
		return (
			<div className="p-10 text-gray-600 text-lg">Loading dashboard...</div>
		);
	}

	/* -------------------------
     RENDER
  -------------------------- */
	return (
		<div className="space-y-8 mx-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-gray-600 mt-1">
						Overview of your hotel management system
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="bg-white">
						Last 30 days
					</Badge>
					<Badge className="bg-blue-600 hover:bg-blue-700">Real-time</Badge>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				{statCards.map((stat) => (
					<Card
						key={stat.title}
						className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
					>
						<CardContent className="p-6">
							<div className="flex justify-between items-start mb-4">
								<div className={`p-3 rounded-lg ${stat.bgColor}`}>
									<div className={stat.color}>{stat.icon}</div>
								</div>
							</div>

							<div className="space-y-2">
								<p className="text-sm font-medium text-gray-600">
									{stat.title}
								</p>
								<p className="text-2xl md:text-3xl font-bold text-gray-900">
									{stat.value}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Extra Panels */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-lg">Performance Metrics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Metric label="Occupancy Rate" value="78%" />
						<Metric label="Average Daily Rate" value="$189" />
						<Metric label="Guest Satisfaction" value="4.8 / 5" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
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
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

/* -------------------------
   SMALL COMPONENTS
-------------------------- */

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between py-3 border-b last:border-b-0">
			<span className="text-gray-600">{label}</span>
			<div className="flex items-center gap-2">
				<span className="font-semibold">{value}</span>
				<TrendingUp className="h-4 w-4 text-emerald-600" />
			</div>
		</div>
	);
}

function QuickAction({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<button
			type="button"
			className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
		>
			<div className="font-medium text-gray-900">{title}</div>
			<div className="text-sm text-gray-600">{subtitle}</div>
		</button>
	);
}
