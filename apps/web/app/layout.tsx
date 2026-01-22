import "./globals.css";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import { PayPalProvider } from "../components/providers/paypal-provider";
import { ThemeProvider } from "../components/providers/theme-provider";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<PayPalProvider>
						<Header />
						<main className="pt-20">{children}</main>
						<Footer />
					</PayPalProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
