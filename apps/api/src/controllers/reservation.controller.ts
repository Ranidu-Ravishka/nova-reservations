import type { Request, Response } from "express";
import { Hotel } from "../models/Hotel";
import { Payment } from "../models/Payment";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { countOverlappingReservations } from "../services/availability.service";
import { getIO } from "../socket";

/* ---------------- TYPES ---------------- */

interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		role?: string;
	};
}

/* =====================================================
   CREATE RESERVATION (CUSTOMER)
===================================================== */
export const createReservation = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const userId = req.user.id;
		const { roomTypeId, checkIn, checkOut, roomsBooked } = req.body;

		if (!roomTypeId || !checkIn || !checkOut || !roomsBooked) {
			return res.status(400).json({ message: "Missing booking data" });
		}

		/* 1️⃣ Load room */
		const room = await Room.findById(roomTypeId);
		if (!room || !room.isActive) {
			return res.status(404).json({ message: "Room not found" });
		}

		const requestedRooms = Number(roomsBooked);
		if (!Number.isInteger(requestedRooms) || requestedRooms < 1) {
			return res
				.status(400)
				.json({ message: "roomsBooked must be a positive integer" });
		}

		const checkInDate = new Date(checkIn);
		const checkOutDate = new Date(checkOut);
		if (
			Number.isNaN(checkInDate.getTime()) ||
			Number.isNaN(checkOutDate.getTime())
		) {
			return res.status(400).json({ message: "Invalid dates" });
		}

		/* 2️⃣ Load hotel */
		const hotel = await Hotel.findById(room.hotelId);
		if (!hotel) {
			return res.status(404).json({ message: "Hotel not found" });
		}

		/* 3️⃣ Availability check */
		const booked = await countOverlappingReservations(
			room._id.toString(),
			checkInDate,
			checkOutDate,
		);

		const available = room.totalRooms - booked;

		if (available < requestedRooms) {
			return res.status(409).json({
				message: "Not enough rooms available",
			});
		}

		/* 4️⃣ Price calculation */
		const nights =
			(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

		if (nights <= 0) {
			return res.status(400).json({ message: "Invalid dates" });
		}

		const totalPrice = nights * room.pricePerNight * requestedRooms;

		/* 5️⃣ Create reservation */
		const reservation = await Reservation.create({
			userId,

			hotelId: hotel._id,
			hotelName: hotel.name,

			roomId: room._id,
			roomName: room.name,
			roomType: room.type,

			roomsBooked: requestedRooms,
			checkIn: checkInDate,
			checkOut: checkOutDate,
			nights,

			pricePerNight: room.pricePerNight,
			totalPrice,

			status: "PENDING",
			paymentStatus: "UNPAID",
		});

		const bookedAfterCreate = await countOverlappingReservations(
			room._id.toString(),
			new Date(checkIn),
			new Date(checkOut),
		);

		const io = getIO();
		io.emit("availability:update", {
			roomId: room._id.toString(),
			remaining: room.totalRooms - bookedAfterCreate,
		});

		return res.status(201).json(reservation);
	} catch (error) {
		console.error("Create reservation error:", error);
		return res.status(500).json({ message: "Failed to create reservation" });
	}
};

/* =====================================================
   GET RESERVATIONS (ADMIN / STAFF)
===================================================== */
export const getReservations = async (
	_req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const reservations = await Reservation.find()
			.populate("userId", "name email")
			.sort({ createdAt: -1 })
			.lean();

		return res.json(reservations);
	} catch (error) {
		console.error("Get reservations error:", error);
		return res.status(500).json({ message: "Failed to load reservations" });
	}
};

/* =====================================================
   GET SINGLE RESERVATION (OWNER / ADMIN / STAFF)
===================================================== */
export const getReservationById = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const reservation = await Reservation.findById(req.params.id)
			.populate("userId", "name email")
			.lean();

		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		const role = req.user.role?.toUpperCase();
		const ownerId =
			typeof reservation.userId === "string"
				? reservation.userId
				: reservation.userId?._id?.toString();

		if (ownerId !== req.user.id && !["ADMIN", "STAFF"].includes(role || "")) {
			return res.status(403).json({ message: "Access denied" });
		}

		return res.json(reservation);
	} catch (error) {
		console.error("Get reservation error:", error);
		return res.status(500).json({ message: "Failed to load reservation" });
	}
};

/* =====================================================
   GET MY RESERVATIONS (CUSTOMER)
===================================================== */
export const getMyReservations = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const reservations = await Reservation.find({ userId: req.user.id })
			.sort({ createdAt: -1 })
			.lean();

		return res.json(reservations);
	} catch (error) {
		console.error("Get my reservations error:", error);
		return res.status(500).json({ message: "Failed to load reservations" });
	}
};

/* =====================================================
   UPDATE RESERVATION (ADMIN / STAFF)
===================================================== */
export const updateReservation = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const reservation = await Reservation.findById(id);
		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		const previousStatus = reservation.status;
		Object.assign(reservation, updates);
		await reservation.save();

		if (previousStatus !== reservation.status) {
			const io = getIO();

			if (
				reservation.status === "CANCELLED" &&
				reservation.paymentStatus === "PAID"
			) {
				reservation.paymentStatus = "REFUNDED";
				await reservation.save();
				await Payment.findOneAndUpdate(
					{ reservationId: reservation._id, status: "PAID" },
					{ status: "REFUNDED" },
				);
			}

			const room = await Room.findById(reservation.roomId);
			if (room) {
				const booked = await countOverlappingReservations(
					room._id.toString(),
					reservation.checkIn,
					reservation.checkOut,
				);
				io.emit("availability:update", {
					roomId: room._id.toString(),
					remaining: room.totalRooms - booked,
				});
			}

			io.emit("reservation:status", {
				id: reservation._id.toString(),
				status: reservation.status,
			});
		}

		return res.json(reservation);
	} catch (error) {
		console.error("Update reservation error:", error);
		return res.status(500).json({ message: "Failed to update reservation" });
	}
};

/* =====================================================
   CANCEL RESERVATION (CUSTOMER / ADMIN)
===================================================== */
export const cancelReservation = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const reservation = await Reservation.findById(req.params.id);
		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		const role = req.user.role?.toUpperCase();
		const isOwner = reservation.userId.toString() === req.user.id;
		const isAdmin = ["ADMIN", "STAFF"].includes(role || "");

		if (!isOwner && !isAdmin) {
			return res.status(403).json({ message: "Access denied" });
		}

		if (reservation.status === "CANCELLED") {
			return res.json(reservation);
		}

		const now = new Date();
		if (!isAdmin && reservation.checkIn <= now) {
			return res.status(400).json({ message: "Cannot cancel after check-in" });
		}

		reservation.status = "CANCELLED";
		if (reservation.paymentStatus === "PAID") {
			reservation.paymentStatus = "REFUNDED";
			await Payment.findOneAndUpdate(
				{ reservationId: reservation._id, status: "PAID" },
				{ status: "REFUNDED" },
			);
		}

		await reservation.save();

		const room = await Room.findById(reservation.roomId);
		if (room) {
			const booked = await countOverlappingReservations(
				room._id.toString(),
				reservation.checkIn,
				reservation.checkOut,
			);
			const io = getIO();
			io.emit("availability:update", {
				roomId: room._id.toString(),
				remaining: room.totalRooms - booked,
			});
			io.emit("reservation:status", {
				id: reservation._id.toString(),
				status: reservation.status,
			});
		}

		return res.json(reservation);
	} catch (error) {
		console.error("Cancel reservation error:", error);
		return res.status(500).json({ message: "Failed to cancel reservation" });
	}
};
