import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export default function EmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="rounded-lg border bg-background p-8 text-center">
			<h2 className="text-base font-semibold">{title}</h2>
			{description ? (
				<p className="mt-1 text-sm text-muted-foreground">{description}</p>
			) : null}
			{action ? <div className="mt-4 flex justify-center">{action}</div> : null}
		</div>
	);
}

export function RetryButton({ onClick }: { onClick: () => void }) {
	return (
		<Button type="button" variant="outline" onClick={onClick}>
			Try again
		</Button>
	);
}
