import type { ReactNode } from "react";

export default function PageHeader({
	title,
	description,
	actions,
}: {
	title: string;
	description?: string;
	actions?: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div className="space-y-2">
				<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
					Hotel Operations
				</p>
				<h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
					{title}
				</h1>
				{description ? (
					<p className="text-sm text-muted-foreground max-w-2xl">
						{description}
					</p>
				) : null}
			</div>
			{actions ? <div className="shrink-0 pt-1">{actions}</div> : null}
		</div>
	);
}
