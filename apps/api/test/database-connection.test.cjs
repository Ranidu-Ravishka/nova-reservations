const assert = require("node:assert/strict");
const { test } = require("node:test");
const { formatMongoConnectionFailure } = require("../dist/config/db.js");

test("MongoDB startup diagnostics identify DNS lookup failures without logging the URI", () => {
	const uri = "mongodb+srv://user:secret@cluster.example.mongodb.net/database";
	const message = formatMongoConnectionFailure(
		new Error(
			`querySrv ENOTFOUND _mongodb._tcp.cluster.example.mongodb.net ${uri}`,
		),
	);

	assert.match(message, /DNS/);
	assert.doesNotMatch(message, /secret|mongodb\+srv:\/\//);
});

test("MongoDB startup diagnostics distinguish authentication failures", () => {
	assert.match(
		formatMongoConnectionFailure(
			Object.assign(new Error("Authentication failed"), { code: 18 }),
		),
		/authentication/i,
	);
});

test("MongoDB startup diagnostics distinguish network timeouts", () => {
	assert.match(
		formatMongoConnectionFailure(
			Object.assign(new Error("Connection timed out"), { code: "ETIMEDOUT" }),
		),
		/network timeout/i,
	);
});

test("MongoDB startup diagnostics distinguish malformed connection configuration", () => {
	assert.match(
		formatMongoConnectionFailure(
			Object.assign(new Error("Invalid connection string"), {
				name: "MongoParseError",
			}),
		),
		/configuration/i,
	);
});

test("MongoDB startup diagnostics identify a missing connection variable", () => {
	assert.match(
		formatMongoConnectionFailure(
			new Error("MONGO_URI environment variable is not set"),
		),
		/configuration/i,
	);
});
