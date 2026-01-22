"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import type React from "react";

type Props = {
	children: React.ReactNode;
};

export function PayPalProvider({ children }: Props) {
	return (
		<PayPalScriptProvider
			options={{
				clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
			}}
		>
			{children}
		</PayPalScriptProvider>
	);
}
