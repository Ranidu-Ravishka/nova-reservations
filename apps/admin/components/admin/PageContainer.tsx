import type { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto w-full max-w-7xl px-6 py-8 space-y-8">
			{children}
		</div>
	);
}
