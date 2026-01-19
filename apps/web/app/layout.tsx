import "./globals.css";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import { ThemeProvider } from "../components/providers/theme-provider";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					<main className="pt-20">{children}</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
