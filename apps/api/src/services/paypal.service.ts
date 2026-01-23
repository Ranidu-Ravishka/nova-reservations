import axios from "axios";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing required environment variable: ${name}`);
	return value;
}

const PAYPAL_BASE = requireEnv("PAYPAL_BASE_URL");
const CLIENT_ID = requireEnv("PAYPAL_CLIENT_ID");
const CLIENT_SECRET = requireEnv("PAYPAL_CLIENT_SECRET");

/* ---------- ACCESS TOKEN ---------- */
async function getAccessToken() {
	const res = await axios.post(
		`${PAYPAL_BASE}/v1/oauth2/token`,
		"grant_type=client_credentials",
		{
			auth: {
				username: CLIENT_ID,
				password: CLIENT_SECRET,
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

	const res = await axios.post(
		`${PAYPAL_BASE}/v2/checkout/orders`,
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

	const res = await axios.post(
		`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return res.data;
}
