import type { Request, Response } from "express";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { countOverlappingReservations } from "../services/availability.service";
import { io } from "../server";


/* ---------------- EXTENDED REQUEST TYPE ---------------- */

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

/* ---------------- CREATE RESERVATION ---------------- */

export const createReservation = async (
  req: AuthRequest,
  res: Response,
) => {
  const { roomTypeId, checkIn, checkOut, roomsBooked } = req.body as {
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    roomsBooked: number;
  };

  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!roomTypeId || !checkIn || !checkOut || !roomsBooked) {
    return res.status(400).json({ message: "Missing booking data" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    return res.status(400).json({ message: "Invalid date range" });
  }

  const room = await Room.findById(roomTypeId);
  if (!room || !room.isActive) {
    return res.status(404).json({ message: "Room not available" });
  }

  const alreadyBooked = await countOverlappingReservations(
    room._id.toString(),
    checkInDate,
    checkOutDate,
  );

  const remainingRooms = room.totalRooms - alreadyBooked;

  if (roomsBooked > remainingRooms) {
    return res.status(409).json({
      message: "Not enough rooms available",
      remaining: remainingRooms,
    });
  }

  const nights =
    (checkOutDate.getTime() - checkInDate.getTime()) /
    (1000 * 60 * 60 * 24);

  const totalPrice = nights * room.pricePerNight * roomsBooked;

  const reservation = await Reservation.create({
    userId: req.user.id,
    roomId: room._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    roomsBooked,
    totalPrice,
    status: "CONFIRMED",
  });

  io.emit("availability:update", {
  roomId: room._id.toString(),
  remaining: remainingRooms - roomsBooked,
});


  return res.status(201).json({
    reservation,
    remainingAfterBooking: remainingRooms - roomsBooked,
  });
};

/* ---------------- GET USER RESERVATIONS ---------------- */

export const getReservations = async (
  req: AuthRequest,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const reservations = await Reservation.find({
    userId: req.user.id,
  })
    .populate("roomId")
    .sort({ createdAt: -1 });

  return res.json(reservations);
};


