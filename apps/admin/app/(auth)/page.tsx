import { Suspense } from "react";

import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
	return (
		<Suspense
			fallback={
				<div className="w-full max-w-md rounded-2xl luxury-panel p-8 text-center text-sm text-muted-foreground">
					Loading…
				</div>
			}
		>
			<AdminLoginClient />
		</Suspense>
	);
}
