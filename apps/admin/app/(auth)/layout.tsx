export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-dvh flex items-center justify-center bg-muted/30 p-6">
			{children}
		</div>
	);
}
