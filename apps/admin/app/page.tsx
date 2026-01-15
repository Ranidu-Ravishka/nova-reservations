import {
	Bed,
	Building2,
	CalendarDays,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCard {
	title: string;
	value: number | string;
	change?: number;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
}

export default function Dashboard() {
	const stats: StatCard[] = [
		{
			title: "Total Hotels",
			value: 128,
			change: 12,
			icon: <Building2 className="h-5 w-5" />,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			title: "Available Rooms",
			value: 512,
			change: -3,
			icon: <Bed className="h-5 w-5" />,
			color: "text-emerald-600",
			bgColor: "bg-emerald-50",
		},
		{
			title: "Active Reservations",
			value: 342,
			change: 24,
			icon: <CalendarDays className="h-5 w-5" />,
			color: "text-violet-600",
			bgColor: "bg-violet-50",
		},
		{
			title: "Monthly Revenue",
			value: "$24,580",
			change: 18,
			icon: <DollarSign className="h-5 w-5" />,
			color: "text-amber-600",
			bgColor: "bg-amber-50",
		},
	];

	const formatChange = (change?: number) => {
		if (!change) return null;
		const isPositive = change > 0;
		return (
			<div className="flex items-center gap-1 mt-2">
				{isPositive ? (
					<TrendingUp className="h-4 w-4 text-emerald-600" />
				) : (
					<TrendingDown className="h-4 w-4 text-red-600" />
				)}
				<span
					className={`text-sm font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}
				>
					{isPositive ? "+" : ""}
					{change}%
				</span>
				<span className="text-sm text-gray-500">from last month</span>
			</div>
		);
	};

	return (
		<div className="space-y-8">
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
				{stats.map((stat) => (
					<Card
						key={stat.title}
						className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
					>
						<CardContent className="p-6">
							<div className="flex justify-between items-start mb-4">
								<div className={`p-3 rounded-lg ${stat.bgColor}`}>
									<div className={stat.color}>{stat.icon}</div>
								</div>
								{stat.change && (
									<div
										className={`text-sm font-medium ${stat.change > 0 ? "text-emerald-600" : "text-red-600"}`}
									>
										{stat.change > 0 ? "+" : ""}
										{stat.change}%
									</div>
								)}
							</div>

							<div className="space-y-2">
								<p className="text-sm font-medium text-gray-600">
									{stat.title}
								</p>
								<p className="text-2xl md:text-3xl font-bold text-gray-900">
									{stat.value}
								</p>
							</div>

							{formatChange(stat.change)}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Additional Metrics */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-lg">Performance Metrics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between py-3 border-b">
								<span className="text-gray-600">Occupancy Rate</span>
								<div className="flex items-center gap-2">
									<span className="font-semibold">78%</span>
									<TrendingUp className="h-4 w-4 text-emerald-600" />
								</div>
							</div>
							<div className="flex items-center justify-between py-3 border-b">
								<span className="text-gray-600">Average Daily Rate</span>
								<div className="flex items-center gap-2">
									<span className="font-semibold">$189</span>
									<TrendingUp className="h-4 w-4 text-emerald-600" />
								</div>
							</div>
							<div className="flex items-center justify-between py-3">
								<span className="text-gray-600">Guest Satisfaction</span>
								<div className="flex items-center gap-2">
									<span className="font-semibold">4.8/5</span>
									<TrendingUp className="h-4 w-4 text-emerald-600" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<button
								type="button"
								className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
							>
								<div className="font-medium text-gray-900">Check-in Today</div>
								<div className="text-sm text-gray-600">
									12 arrivals scheduled
								</div>
							</button>
							<button
								type="button"
								className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
							>
								<div className="font-medium text-gray-900">Check-out Today</div>
								<div className="text-sm text-gray-600">
									8 departures scheduled
								</div>
							</button>
							<button
								type="button"
								className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
							>
								<div className="font-medium text-gray-900">
									Pending Requests
								</div>
								<div className="text-sm text-gray-600">5 requests awaiting</div>
							</button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
