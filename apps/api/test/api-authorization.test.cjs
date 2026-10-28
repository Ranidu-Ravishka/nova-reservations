const assert = require("node:assert/strict");
const http = require("node:http");
const { after, before, test } = require("node:test");
const jwt = require("jsonwebtoken");
const app = require("../dist/app.js").default;
const { Reservation } = require("../dist/models/Reservation.js");
const {
	getPayPalBaseUrl,
	isLegacyPaymentApproved,
	isPayPalOrderCaptured,
} = require("../dist/services/paypal.service.js");

const jwtSecret = "api-authorization-test-secret";
let server;
let baseUrl;

before(async () => {
	process.env.JWT_SECRET = jwtSecret;
	server = http.createServer(app);
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
	await new Promise((resolve, reject) => {
		server.close((error) => (error ? reject(error) : resolve()));
	});
	delete process.env.JWT_SECRET;
});

function authorization(role) {
	const token = jwt.sign({ id: "000000000000000000000001", role }, jwtSecret);
	return { Authorization: `Bearer ${token}` };
}

test("user and staff data require authentication", async () => {
	for (const path of ["/api/users", "/api/staff"]) {
		const response = await fetch(`${baseUrl}${path}`);
		assert.equal(
			response.status,
			401,
			`${path} should reject anonymous access`,
		);
	}
});

test("amenity mutations require an administrator", async () => {
	const anonymousResponse = await fetch(`${baseUrl}/api/amenities`, {
		method: "POST",
	});
	assert.equal(anonymousResponse.status, 401);

	const customerResponse = await fetch(`${baseUrl}/api/amenities`, {
		method: "POST",
		headers: authorization("CUSTOMER"),
	});
	assert.equal(customerResponse.status, 403);
});

test("user and staff management require an administrator", async () => {
	for (const path of ["/api/users", "/api/staff"]) {
		const response = await fetch(`${baseUrl}${path}`, {
			headers: authorization("CUSTOMER"),
		});
		assert.equal(response.status, 403, `${path} should reject customer access`);
	}
});

test("admin and staff mutation routes reject anonymous requests", async () => {
	const requests = [
		["POST", "/api/hotels"],
		["PUT", "/api/hotels/507f1f77bcf86cd799439011"],
		["DELETE", "/api/hotels/507f1f77bcf86cd799439011"],
		["POST", "/api/rooms"],
		["GET", "/api/rooms/admin"],
		["PUT", "/api/rooms/507f1f77bcf86cd799439011"],
		["DELETE", "/api/rooms/507f1f77bcf86cd799439011"],
		["POST", "/api/transports"],
		["PUT", "/api/transports/507f1f77bcf86cd799439011"],
		["DELETE", "/api/transports/507f1f77bcf86cd799439011"],
		["GET", "/api/transport-requests"],
		["GET", "/api/admin/dashboard"],
		["GET", "/api/payments"],
		["POST", "/api/reservations"],
		["GET", "/api/reservations/me"],
	];

	for (const [method, path] of requests) {
		const response = await fetch(`${baseUrl}${path}`, { method });
		assert.equal(response.status, 401, `${method} ${path} should require auth`);
	}
});

test("health check reports a disconnected database as unhealthy", async () => {
	const response = await fetch(`${baseUrl}/api/health`);
	assert.equal(response.status, 503);
	assert.deepEqual(await response.json(), {
		status: "unhealthy",
		database: "disconnected",
	});
});

test("invalid availability and reservation dates are rejected before database access", async () => {
	const availabilityResponse = await fetch(
		`${baseUrl}/api/availability/check`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				roomTypeId: "507f1f77bcf86cd799439011",
				checkIn: "not-a-date",
				checkOut: "2026-10-29",
			}),
		},
	);
	assert.equal(availabilityResponse.status, 400);

	const reservationResponse = await fetch(`${baseUrl}/api/reservations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...authorization("CUSTOMER"),
		},
		body: JSON.stringify({
			roomTypeId: "507f1f77bcf86cd799439011",
			checkIn: "2026-10-30",
			checkOut: "2026-10-29",
			roomsBooked: 1,
		}),
	});
	assert.equal(reservationResponse.status, 400);
});

test("reservation updates reject fields outside the status contract", async () => {
	const response = await fetch(
		`${baseUrl}/api/reservations/507f1f77bcf86cd799439011`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...authorization("ADMIN"),
			},
			body: JSON.stringify({ status: "CONFIRMED", totalPrice: 1 }),
		},
	);
	assert.equal(response.status, 400);
});

test("admins cannot manually confirm an unpaid reservation", async () => {
	const findById = Reservation.findById;
	Reservation.findById = async () => ({
		status: "PENDING",
		paymentStatus: "UNPAID",
	});

	try {
		const response = await fetch(
			`${baseUrl}/api/reservations/507f1f77bcf86cd799439011`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...authorization("ADMIN"),
				},
				body: JSON.stringify({ status: "CONFIRMED" }),
			},
		);
		assert.equal(response.status, 409);
	} finally {
		Reservation.findById = findById;
	}
});

test("review and transport request endpoints reject invalid input before database access", async () => {
	const reviewResponse = await fetch(`${baseUrl}/api/reviews`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...authorization("CUSTOMER"),
		},
		body: JSON.stringify({
			hotelId: "507f1f77bcf86cd799439011",
			rating: 6,
			userId: "507f191e810c19729de860ea",
		}),
	});
	assert.equal(reviewResponse.status, 400);

	const transportResponse = await fetch(`${baseUrl}/api/transport-requests`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			transportId: "invalid-id",
			name: "Guest",
			email: "guest@example.com",
			phone: "123456789",
		}),
	});
	assert.equal(transportResponse.status, 400);
});

test("malformed JSON and invalid Mongo identifiers receive client errors", async () => {
	const malformedJsonResponse = await fetch(
		`${baseUrl}/api/availability/check`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{",
		},
	);
	assert.equal(malformedJsonResponse.status, 400);

	const invalidIdentifierResponse = await fetch(
		`${baseUrl}/api/hotels/not-a-mongo-id`,
	);
	assert.equal(invalidIdentifierResponse.status, 400);
	assert.deepEqual(await invalidIdentifierResponse.json(), {
		message: "Invalid identifier",
	});
});

test("login rejects non-string credentials without querying users", async () => {
	const response = await fetch(`${baseUrl}/api/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: { $ne: null }, password: "password" }),
	});
	assert.equal(response.status, 400);
});

test("authentication rejects null JSON and malformed JWT claims", async () => {
	for (const path of ["/api/auth/login", "/api/auth/register"]) {
		const response = await fetch(`${baseUrl}${path}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "null",
		});
		assert.equal(response.status, 400);
	}

	const invalidToken = jwt.sign(
		{ id: { $ne: null }, role: "ADMIN" },
		jwtSecret,
	);
	const response = await fetch(`${baseUrl}/api/users`, {
		headers: { Authorization: `Bearer ${invalidToken}` },
	});
	assert.equal(response.status, 401);
});

test("payment capture responses must be completed and match the reservation amount", () => {
	assert.equal(
		isLegacyPaymentApproved(
			{
				state: "approved",
				transactions: [{ amount: { total: "125.00", currency: "USD" } }],
			},
			125,
		),
		true,
	);
	assert.equal(
		isLegacyPaymentApproved(
			{
				state: "approved",
				transactions: [{ amount: { total: "1.00", currency: "USD" } }],
			},
			125,
		),
		false,
	);
	assert.equal(
		isPayPalOrderCaptured(
			{
				status: "COMPLETED",
				purchase_units: [
					{
						payments: {
							captures: [
								{
									status: "COMPLETED",
									amount: { value: "125.00", currency_code: "USD" },
								},
							],
						},
					},
				],
			},
			125,
		),
		true,
	);
	assert.equal(
		isPayPalOrderCaptured(
			{
				status: "COMPLETED",
				purchase_units: [
					{
						payments: {
							captures: [
								{
									status: "COMPLETED",
									amount: { value: "1.00", currency_code: "USD" },
								},
							],
						},
					},
				],
			},
			125,
		),
		false,
	);
	assert.equal(
		isPayPalOrderCaptured(
			{
				status: "COMPLETED",
				purchase_units: [
					{
						payments: {
							captures: [
								{
									status: "COMPLETED",
									amount: { value: "60.00", currency_code: "USD" },
								},
								{
									status: "COMPLETED",
									amount: { value: "65.00", currency_code: "USD" },
								},
							],
						},
					},
				],
			},
			125,
		),
		true,
	);
	assert.equal(getPayPalBaseUrl(undefined), "https://api-m.sandbox.paypal.com");
	assert.equal(getPayPalBaseUrl("LIVE"), "https://api-m.paypal.com");
	assert.equal(
		getPayPalBaseUrl("sandbox", "https://paypal.test/"),
		"https://paypal.test",
	);
});

test("admin create endpoints enforce required database fields", async () => {
	const adminHeaders = {
		"Content-Type": "application/json",
		...authorization("ADMIN"),
	};
	const requests = [
		["/api/amenities", {}],
		["/api/staff", {}],
		["/api/transports", {}],
	];

	for (const [path, body] of requests) {
		const response = await fetch(`${baseUrl}${path}`, {
			method: "POST",
			headers: adminHeaders,
			body: JSON.stringify(body),
		});
		assert.equal(
			response.status,
			400,
			`${path} should enforce required fields`,
		);
	}
});

test("payment endpoints reject malformed identifiers before database access", async () => {
	const requests = [
		["/api/payments/create-order", { reservationId: "invalid-id" }],
		[
			"/api/payments/execute",
			{ reservationId: "invalid-id", paymentId: "p", PayerID: "p" },
		],
		[
			"/api/payments/capture-order",
			{ reservationId: "invalid-id", orderId: "p" },
		],
	];

	for (const [path, body] of requests) {
		const response = await fetch(`${baseUrl}${path}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...authorization("CUSTOMER"),
			},
			body: JSON.stringify(body),
		});
		assert.equal(response.status, 400, `${path} should reject invalid IDs`);
	}
});
