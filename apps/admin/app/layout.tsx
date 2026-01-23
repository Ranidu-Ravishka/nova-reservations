import "./globals.css";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className="min-h-dvh bg-background text-foreground"
				suppressHydrationWarning
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
