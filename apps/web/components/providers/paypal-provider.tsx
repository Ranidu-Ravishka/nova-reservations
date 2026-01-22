"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import type React from "react";
import { useEffect } from "react";

type Props = {
	children: React.ReactNode;
};

export function PayPalProvider({ children }: Props) {
	const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

	useEffect(() => {
		if (!clientId) {
			// Avoid throwing: we just skip PayPal SDK init when not configured.
			console.warn("PayPal disabled: NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set.");
		}
	}, [clientId]);

	if (!clientId) return <>{children}</>;

	return (
		<PayPalScriptProvider
			options={{
				clientId,
			}}
		>
			{children}
		</PayPalScriptProvider>
	);
}
