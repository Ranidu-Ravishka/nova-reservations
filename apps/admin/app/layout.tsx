import "./globals.css";

import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-display",
	display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${playfair.variable} min-h-dvh bg-background text-foreground antialiased`}
				suppressHydrationWarning
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
