import axios from "axios";

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | null {
	return value !== null && typeof value === "object"
		? (value as JsonRecord)
		: null;
}

function getAmount(value: unknown, currencyKey: string): number | null {
	const amount = asRecord(value);
	if (!amount || amount[currencyKey] !== "USD") return null;

	const rawValue = amount[currencyKey === "currency" ? "total" : "value"];
	if (typeof rawValue !== "string" && typeof rawValue !== "number") return null;

	const numericValue = Number(rawValue);
	return Number.isFinite(numericValue) ? numericValue : null;
}

function isAmount(value: unknown, expectedAmount: number, currencyKey: string) {
	const numericValue = getAmount(value, currencyKey);
	return (
		numericValue !== null && numericValue === Number(expectedAmount.toFixed(2))
	);
}

export function isLegacyPaymentApproved(
	paymentValue: unknown,
	expectedAmount: number,
): boolean {
	const payment = asRecord(paymentValue);
	const transactions = payment?.transactions;
	if (
		payment?.state !== "approved" ||
		!Array.isArray(transactions) ||
		transactions.length !== 1
	) {
		return false;
	}

	const transaction = asRecord(transactions[0]);
	return isAmount(transaction?.amount, expectedAmount, "currency");
}

export function isPayPalOrderCaptured(
	orderValue: unknown,
	expectedAmount: number,
): boolean {
	const order = asRecord(orderValue);
	const purchaseUnits = order?.purchase_units;
	if (
		order?.status !== "COMPLETED" ||
		!Array.isArray(purchaseUnits) ||
		purchaseUnits.length === 0
	) {
		return false;
	}

	const completedAmounts: number[] = [];
	for (const purchaseUnitValue of purchaseUnits) {
		const purchaseUnit = asRecord(purchaseUnitValue);
		const payments = asRecord(purchaseUnit?.payments);
		const captures = payments?.captures;
		if (!Array.isArray(captures) || captures.length === 0) return false;
		for (const captureValue of captures) {
			const capture = asRecord(captureValue);
			const amount =
				capture?.status === "COMPLETED"
					? getAmount(capture.amount, "currency_code")
					: null;
			if (amount === null) return false;
			completedAmounts.push(amount);
		}
	}

	return (
		completedAmounts.length > 0 &&
		Number(
			completedAmounts.reduce((total, amount) => total + amount, 0).toFixed(2),
		) === Number(expectedAmount.toFixed(2))
	);
}

export function getPayPalBaseUrl(
	mode: string | undefined,
	configuredBaseUrl?: string,
): string {
	const configured = configuredBaseUrl?.trim().replace(/\/+$/, "");
	if (configured) return configured;
	return mode?.toLowerCase() === "live"
		? "https://api-m.paypal.com"
		: "https://api-m.sandbox.paypal.com";
}

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing required environment variable: ${name}`);
	return value;
}

function getPayPalConfig() {
	const mode = process.env.PAYPAL_MODE?.toLowerCase();
	return {
		baseUrl: getPayPalBaseUrl(mode, process.env.PAYPAL_BASE_URL),
		clientId: requireEnv("PAYPAL_CLIENT_ID"),
		clientSecret: requireEnv("PAYPAL_CLIENT_SECRET"),
	};
}

/* ---------- ACCESS TOKEN ---------- */
async function getAccessToken() {
	const { baseUrl, clientId, clientSecret } = getPayPalConfig();
	const res = await axios.post(
		`${baseUrl}/v1/oauth2/token`,
		"grant_type=client_credentials",
		{
			auth: {
				username: clientId,
				password: clientSecret,
			},
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		},
	);

	return res.data.access_token;
}

/* ---------- CREATE ORDER ---------- */
export async function createPayPalOrder(amount: number) {
	const token = await getAccessToken();
	const { baseUrl } = getPayPalConfig();

	const res = await axios.post(
		`${baseUrl}/v2/checkout/orders`,
		{
			intent: "CAPTURE",
			purchase_units: [
				{
					amount: {
						currency_code: "USD",
						value: amount.toFixed(2),
					},
				},
			],
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		},
	);

	return res.data;
}

/* ---------- CAPTURE ORDER ---------- */
export async function capturePayPalOrder(orderId: string) {
	const token = await getAccessToken();
	const { baseUrl } = getPayPalConfig();

	const res = await axios.post(
		`${baseUrl}/v2/checkout/orders/${orderId}/capture`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return res.data;
}
