import type { Request, Response } from "express";
import { Hotel } from "../models/Hotel";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { countOverlappingReservations } from "../services/availability.service";

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

		/* 2️⃣ Load hotel */
		const hotel = await Hotel.findById(room.hotelId);
		if (!hotel) {
			return res.status(404).json({ message: "Hotel not found" });
		}

		/* 3️⃣ Availability check */
		const booked = await countOverlappingReservations(
			room._id.toString(),
			new Date(checkIn),
			new Date(checkOut),
		);

		const available = room.totalRooms - booked;

		if (available < roomsBooked) {
			return res.status(409).json({
				message: "Not enough rooms available",
			});
		}

		/* 4️⃣ Price calculation */
		const nights =
			(new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
			(1000 * 60 * 60 * 24);

		if (nights <= 0) {
			return res.status(400).json({ message: "Invalid dates" });
		}

		const totalPrice = nights * room.pricePerNight * roomsBooked;

		/* 5️⃣ Create reservation */
		const reservation = await Reservation.create({
			userId,

			hotelId: hotel._id,
			hotelName: hotel.name,

			roomId: room._id,
			roomName: room.name,
			roomType: room.type,

			roomsBooked,
			checkIn,
			checkOut,
			nights,

			pricePerNight: room.pricePerNight,
			totalPrice,

			status: "PENDING",
			paymentStatus: "UNPAID",
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
			.sort({ createdAt: -1 })
			.lean();

		return res.json(reservations);
	} catch (error) {
		console.error("Get reservations error:", error);
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

		const reservation = await Reservation.findByIdAndUpdate(id, updates, {
			new: true,
		});

		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		return res.json(reservation);
	} catch (error) {
		console.error("Update reservation error:", error);
		return res.status(500).json({ message: "Failed to update reservation" });
	}
};
