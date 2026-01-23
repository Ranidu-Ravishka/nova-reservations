export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-dvh flex items-center justify-center luxury-app p-8">
			<div className="absolute inset-0 opacity-20" />
			<div className="relative z-10 w-full max-w-md space-y-6">
				<div className="text-center space-y-2">
					<p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
						Nova Hotels
					</p>
					<h1 className="text-3xl font-display font-semibold luxury-gradient-text">
						Executive Console
					</h1>
					<p className="text-sm text-muted-foreground">
						A world-class command center for luxury hospitality.
					</p>
				</div>
				{children}
			</div>
		</div>
	);
}
