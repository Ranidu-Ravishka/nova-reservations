import "./globals.css";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import { ThemeProvider } from "../components/providers/theme-provider";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

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

	

<PayPalScriptProvider
  options={{
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  }}
>
  {children}
</PayPalScriptProvider>

}
