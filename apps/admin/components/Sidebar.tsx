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
				"w-64 shrink-0 border-r bg-background",
				mobile ? "h-full" : "hidden md:flex md:h-dvh",
			)}
		>
			<div className="flex h-full w-full flex-col">
				{/* Header */}
				<div className="border-b px-4 py-3">
					<div className="flex items-center gap-3">
						<div className="relative h-9 w-9 overflow-hidden rounded bg-muted">
							<Image
								src="/nova-white.png"
								alt="Nova"
								height={36}
								width={36}
								className="object-contain p-1 invert"
								priority
							/>
						</div>
						<div className="min-w-0">
							<p className="text-sm font-semibold leading-tight">Nova Admin</p>
							<p className="text-xs text-muted-foreground truncate">
								Operations dashboard
							</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto p-3">
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
										"group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
										isActive
											? "bg-muted text-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									<Icon
										size={18}
										className={cn(
											"text-muted-foreground group-hover:text-foreground",
											isActive && "text-foreground",
										)}
									/>
									<span className="truncate">{label}</span>
									{isActive ? (
										<div className="ml-auto h-2 w-2 rounded-full bg-primary" />
									) : null}
								</Link>
							);
						})}
					</div>
				</nav>

				{/* Footer */}
				<div className="border-t px-4 py-3">
					<p className="text-xs text-muted-foreground">Signed in as Admin</p>
				</div>
			</div>
		</aside>
	);
}
