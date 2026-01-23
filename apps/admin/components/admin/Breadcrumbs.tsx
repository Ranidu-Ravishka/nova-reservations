"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
	dashboard: "Dashboard",
	hotels: "Hotels",
	rooms: "Rooms",
	reservations: "Reservations",
	"transport-bookings": "Transport",
	users: "Users",
	payments: "Payments",
	staff: "Staff",
	amenities: "Amenities",
};

export default function Breadcrumbs() {
	const pathname = usePathname() ?? "/";
	const parts = pathname.split("/").filter(Boolean);

	if (parts.length === 0) return null;

	return (
		<nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
			<ol className="flex items-center gap-2">
				<li>
					<Link href="/dashboard" className="hover:text-foreground">
						Home
					</Link>
				</li>
				{parts.map((part, index) => {
					const href = `/${parts.slice(0, index + 1).join("/")}`;
					const label = LABELS[part] ?? part.replace(/-/g, " ");
					const isLast = index === parts.length - 1;

					return (
						<li key={href} className="flex items-center gap-2">
							<span className="text-muted-foreground/60">/</span>
							{isLast ? (
								<span className="text-foreground font-medium">{label}</span>
							) : (
								<Link href={href} className="hover:text-foreground">
									{label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
