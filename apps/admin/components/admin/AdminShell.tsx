"use client";

import { useState } from "react";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import Topbar from "@/components/admin/Topbar";
import Sidebar from "@/components/Sidebar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function AdminShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	return (
		<AdminAuthGate>
			<div className="min-h-dvh luxury-app text-foreground">
				<div className="hidden md:flex">
					<Sidebar />
					<div className="flex min-w-0 flex-1 flex-col">
						<Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
						<div className="px-6 pt-6">
							<Breadcrumbs />
						</div>
						<main className="min-w-0 flex-1">{children}</main>
					</div>
				</div>

				{/* Mobile layout */}
				<div className="md:hidden">
					<Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
					<div className="px-6 pt-6">
						<Breadcrumbs />
					</div>
					<main className="min-w-0 flex-1">{children}</main>
				</div>

				<Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
					<DialogContent
						className="max-w-[320px] p-0 luxury-panel"
						aria-describedby={undefined}
					>
						<DialogTitle className="sr-only">Navigation</DialogTitle>
						<Sidebar mobile onNavigate={() => setMobileNavOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>
		</AdminAuthGate>
	);
}
