const assert = require("node:assert/strict");
const http = require("node:http");
const { after, before, test } = require("node:test");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../dist/app.js").default;
const { Hotel } = require("../dist/models/Hotel.js");
const { Reservation } = require("../dist/models/Reservation.js");
const { Room } = require("../dist/models/Room.js");
const { Transport } = require("../dist/models/Transport.js");
const { TransportRequest } = require("../dist/models/TransportRequest.js");
const { UserModel } = require("../dist/models/User.js");
const { initSocket } = require("../dist/socket.js");

const jwtSecret = "reservation-workflow-test-secret";
const previousJwtSecret = process.env.JWT_SECRET;
let mongo;
let server;
let io;
let baseUrl;
let customer;
let admin;
let room;

function authorization(user) {
	const token = jwt.sign(
		{ id: user._id.toString(), role: user.role },
		jwtSecret,
	);
	return { Authorization: `Bearer ${token}` };
}

before(async () => {
	process.env.JWT_SECRET = jwtSecret;
	mongo = await MongoMemoryServer.create();
	await mongoose.connect(mongo.getUri());

	customer = await UserModel.create({
		name: "Reservation Customer",
		email: "reservation-customer@example.test",
		password: "test-password",
		role: "CUSTOMER",
	});
	admin = await UserModel.create({
		name: "Reservation Admin",
		email: "reservation-admin@example.test",
		password: "test-password",
		role: "ADMIN",
	});

	const hotel = await Hotel.create({
		name: "Reservation Test Hotel",
		location: "Colombo",
		coordinates: { lat: 6.9271, lng: 79.8612 },
	});
	room = await Room.create({
		name: "Deluxe Room",
		type: "DELUXE",
		hotelId: hotel._id,
		totalRooms: 3,
		capacity: 2,
		pricePerNight: 125,
		isActive: true,
	});
	await Room.create({
		name: "Inactive Suite",
		type: "SUITE",
		hotelId: hotel._id,
		totalRooms: 1,
		capacity: 4,
		pricePerNight: 250,
		isActive: false,
	});

	server = http.createServer(app);
	io = initSocket(server);
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
	if (io) {
		await new Promise((resolve) => io.close(resolve));
	}
	await mongoose.disconnect();
	if (mongo) await mongo.stop();
	if (previousJwtSecret === undefined) {
		delete process.env.JWT_SECRET;
	} else {
		process.env.JWT_SECRET = previousJwtSecret;
	}
});

test("customer reservations persist and authorized admins can view and manage them", async () => {
	const checkIn = new Date();
	checkIn.setUTCHours(0, 0, 0, 0);
	const checkOut = new Date(checkIn);
	checkOut.setUTCDate(checkOut.getUTCDate() + 2);

	const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: customer.email,
			password: "test-password",
		}),
	});
	assert.equal(loginResponse.status, 200);
	assert.equal((await loginResponse.json()).user.name, customer.name);

	const createResponse = await fetch(`${baseUrl}/api/reservations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...authorization(customer),
		},
		body: JSON.stringify({
			roomTypeId: room._id.toString(),
			checkIn: checkIn.toISOString().slice(0, 10),
			checkOut: checkOut.toISOString().slice(0, 10),
			roomsBooked: 1,
		}),
	});
	assert.equal(createResponse.status, 201);

	const created = await createResponse.json();
	assert.equal(created.status, "PENDING");
	assert.equal(created.paymentStatus, "UNPAID");
	assert.equal(created.totalPrice, 250);

	const persisted = await Reservation.findById(created._id).lean();
	assert.ok(persisted);
	assert.equal(persisted.userId.toString(), customer._id.toString());

	const customerListResponse = await fetch(`${baseUrl}/api/reservations/me`, {
		headers: authorization(customer),
	});
	assert.equal(customerListResponse.status, 200);
	const customerReservations = await customerListResponse.json();
	assert.equal(customerReservations.length, 1);
	assert.equal(customerReservations[0]._id, created._id);

	const unauthorizedListResponse = await fetch(`${baseUrl}/api/reservations`, {
		headers: authorization(customer),
	});
	assert.equal(unauthorizedListResponse.status, 403);

	const adminListResponse = await fetch(`${baseUrl}/api/reservations`, {
		headers: authorization(admin),
	});
	assert.equal(adminListResponse.status, 200);
	const adminReservations = await adminListResponse.json();
	assert.equal(adminReservations.length, 1);
	assert.equal(adminReservations[0]._id, created._id);
	assert.equal(adminReservations[0].userId.email, customer.email);

	const publicRoomsResponse = await fetch(`${baseUrl}/api/rooms`);
	assert.equal(publicRoomsResponse.status, 200);
	assert.equal((await publicRoomsResponse.json()).length, 1);

	const unauthorizedAdminRoomsResponse = await fetch(
		`${baseUrl}/api/rooms/admin`,
		{ headers: authorization(customer) },
	);
	assert.equal(unauthorizedAdminRoomsResponse.status, 403);

	const adminRoomsResponse = await fetch(`${baseUrl}/api/rooms/admin`, {
		headers: authorization(admin),
	});
	assert.equal(adminRoomsResponse.status, 200);
	const adminRooms = await adminRoomsResponse.json();
	assert.equal(adminRooms.length, 2);
	assert.equal(
		adminRooms.find((entry) => entry.name === "Inactive Suite").isActive,
		false,
	);

	const deactivateRoomResponse = await fetch(
		`${baseUrl}/api/rooms/${room._id}`,
		{
			method: "DELETE",
			headers: authorization(admin),
		},
	);
	assert.equal(deactivateRoomResponse.status, 200);
	const reactivateRoomResponse = await fetch(
		`${baseUrl}/api/rooms/${room._id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...authorization(admin),
			},
			body: JSON.stringify({ isActive: true }),
		},
	);
	assert.equal(reactivateRoomResponse.status, 200);

	const transport = await Transport.create({
		type: "Sedan",
		price: 30,
		route: "Airport transfer",
		capacity: 3,
	});
	await TransportRequest.create({
		transportId: transport._id,
		name: "Transfer Customer",
		email: "transfer-customer@example.test",
		phone: "123456789",
	});
	const unauthorizedTransportRequestsResponse = await fetch(
		`${baseUrl}/api/transport-requests`,
		{ headers: authorization(customer) },
	);
	assert.equal(unauthorizedTransportRequestsResponse.status, 403);
	const transportRequestsResponse = await fetch(
		`${baseUrl}/api/transport-requests`,
		{ headers: authorization(admin) },
	);
	assert.equal(transportRequestsResponse.status, 200);
	const transportRequests = await transportRequestsResponse.json();
	assert.equal(transportRequests.length, 1);
	assert.equal(transportRequests[0].transportId.route, "Airport transfer");

	const dashboardResponse = await fetch(`${baseUrl}/api/admin/dashboard`, {
		headers: authorization(admin),
	});
	assert.equal(dashboardResponse.status, 200);
	assert.deepEqual(await dashboardResponse.json(), {
		stats: { users: 2, rooms: 2, reservations: 1 },
		totalHotels: 1,
		availableRooms: 2,
		activeReservations: 1,
		monthlyRevenue: 0,
	});

	const unpaidConfirmationResponse = await fetch(
		`${baseUrl}/api/reservations/${created._id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...authorization(admin),
			},
			body: JSON.stringify({ status: "CONFIRMED" }),
		},
	);
	assert.equal(unpaidConfirmationResponse.status, 409);

	const cancelResponse = await fetch(
		`${baseUrl}/api/reservations/${created._id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...authorization(admin),
			},
			body: JSON.stringify({ status: "CANCELLED" }),
		},
	);
	assert.equal(cancelResponse.status, 200);
	assert.equal((await cancelResponse.json()).status, "CANCELLED");
	assert.equal(
		(await Reservation.findById(created._id).lean()).status,
		"CANCELLED",
	);
});
