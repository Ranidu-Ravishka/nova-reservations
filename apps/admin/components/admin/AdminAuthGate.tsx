"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminAuthGate({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// Guard against brief flashes: only render children after token check.
		const token = localStorage.getItem("admin_token");
		if (!token) {
			const next = pathname ? `/?next=${encodeURIComponent(pathname)}` : "/";
			router.replace(next);
			return;
		}
		setReady(true);
	}, [router, pathname]);

	if (!ready) {
		return (
			<div className="min-h-[60vh] w-full grid place-items-center text-muted-foreground">
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span className="text-sm">Checking session…</span>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
