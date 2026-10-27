const assert = require("node:assert/strict");
const http = require("node:http");
const { after, before, test } = require("node:test");
const jwt = require("jsonwebtoken");
const app = require("../dist/app.js").default;

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

test("health check reports a disconnected database as unhealthy", async () => {
	const response = await fetch(`${baseUrl}/api/health`);
	assert.equal(response.status, 503);
	assert.deepEqual(await response.json(), {
		status: "unhealthy",
		database: "disconnected",
	});
});
