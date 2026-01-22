import { Suspense } from "react";

import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
	return (
		<Suspense
			fallback={
				<div className="w-full max-w-sm rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
					Loading…
				</div>
			}
		>
			<AdminLoginClient />
		</Suspense>
	);
}
