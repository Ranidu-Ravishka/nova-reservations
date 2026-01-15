"use client";

import {
	Bed,
	Calendar,
	Car,
	ConciergeBell,
	CreditCard,
	Hotel,
	LayoutDashboard,
	Star,
	UserCog,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // You'll need to create this utility

const links = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/hotels", label: "Hotels", icon: Hotel },
	{ href: "/rooms", label: "Rooms", icon: Bed },
	{ href: "/reservations", label: "Reservations", icon: Calendar },
	{ href: "/transport-bookings", label: "Transport Bookings", icon: Car },
	{ href: "/users", label: "Users", icon: Users },
	{ href: "/reviews", label: "Reviews", icon: Star },
	{ href: "/payments", label: "Payments", icon: CreditCard },
	{ href: "/staff", label: "Staff", icon: UserCog },
	{ href: "/amenities", label: "Amenities", icon: ConciergeBell },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="w-64 min-h-screen bg-white border-r border-neutral-200 flex flex-col shadow-xl overflow-x-hidden mr-24">
			<div className="translate-x-2.5 min-h-screen flex flex-col justify-between">
				{/* Header */}
				<div className="border-b border-white/10">
					<div className="flex items-center gap-3">
						<div className="relative w-16 h-16 overflow-hidden flex items-center justify-center">
							<Image
								src="/nova-white.png"
								alt="Nova Logo"
								height={500}
								width={500}
								className="object-contain invert"
								priority
							/>
						</div>
						<div>
							<p className="text-xs text-gray-400">Admin Dashboard</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4 overflow-y-auto">
					<div className="space-y-1">
						{links.map(({ href, label, icon: Icon }) => {
							const isActive =
								pathname === href ||
								(href !== "/" && pathname?.startsWith(href));

							return (
								<Link
									key={href}
									href={href}
									className={cn(
										"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
										isActive
											? "bg-white/10 text-white font-medium"
											: "text-gray-300 hover:bg-white/5 hover:text-white",
									)}
								>
									<Icon
										size={18}
										className={cn(
											isActive ? "text-[#D7C08A]" : "text-gray-400",
										)}
									/>
									<span>{label}</span>
									{isActive && (
										<div className="ml-auto w-1 h-4 bg-[#D7C08A] rounded-full" />
									)}
								</Link>
							);
						})}
					</div>
				</nav>

				{/* Footer - User Profile */}
				<div className="-translate-y-2.5">
					<div className="flex items-center gap-3 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
						<div className="relative w-8 h-8 rounded-full bg-linear-to-br from-[#D7C08A] to-amber-700 overflow-hidden">
							{/* You can replace this with an actual user avatar */}
							<div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
								A
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">Admin User</p>
							<p className="text-xs text-gray-400 truncate">admin@nova.com</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
