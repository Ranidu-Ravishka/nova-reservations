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

export default function Sidebar({
	mobile = false,
	onNavigate,
}: {
	mobile?: boolean;
	onNavigate?: () => void;
}) {
	return <SidebarInner mobile={mobile} onNavigate={onNavigate} />;
}

function SidebarInner({
	mobile,
	onNavigate,
}: {
	mobile: boolean;
	onNavigate?: () => void;
}) {
	const pathname = usePathname();

	return (
		<aside
			className={cn(
				"w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
				mobile ? "h-full" : "hidden md:flex md:h-dvh",
			)}
		>
			<div className="flex h-full w-full flex-col">
				{/* Header */}
				<div className="border-b border-sidebar-border px-5 py-5">
					<div className="flex items-center gap-5">
						<div className="relative h-6 w-20 overflow-hidden  bg-sidebar-accent">
							<Image
								src="/nova-white.png"
								alt="Nova"
								height={80}
								width={80}
								className="object-contain p-1.5"
								priority
							/>
						</div>
						<div className="min-w-0">
							<p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
								Nova Hotels
							</p>
							<p className="text-sm font-semibold leading-tight font-display">
								Grand Operations
							</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto p-4">
					<div className="space-y-1">
						{links.map(({ href, label, icon: Icon }) => {
							const isActive =
								pathname === href ||
								(href !== "/" && pathname?.startsWith(href));

							return (
								<Link
									key={href}
									href={href}
									onClick={() => onNavigate?.()}
									className={cn(
										"group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all",
										isActive
											? "bg-sidebar-accent text-sidebar-foreground shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
											: "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
									)}
								>
									<Icon
										size={18}
										className={cn(
											"text-muted-foreground group-hover:text-foreground",
											isActive && "text-primary",
										)}
									/>
									<span className="truncate">{label}</span>
									{isActive ? (
										<div className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(245,210,122,0.7)]" />
									) : null}
								</Link>
							);
						})}
					</div>
				</nav>

				{/* Footer */}
				<div className="border-t border-sidebar-border px-5 py-4">
					<p className="text-xs text-muted-foreground">
						Signed in as
						<span className="ml-1 text-foreground">Executive Admin</span>
					</p>
				</div>
			</div>
		</aside>
	);
}
