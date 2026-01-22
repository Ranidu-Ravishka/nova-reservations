import type { Request, Response } from "express";
import { Room } from "../models/Room";
import { countOverlappingReservations } from "../services/availability.service";

export const checkAvailability = async (
  req: Request,
  res: Response,
) => {
  const { roomTypeId, checkIn, checkOut } = req.body as {
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
  };

  if (!roomTypeId || !checkIn || !checkOut) {
    return res.status(400).json({ message: "Missing booking data" });
  }

  const room = await Room.findById(roomTypeId);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const booked = await countOverlappingReservations(
    room._id.toString(),
    new Date(checkIn),
    new Date(checkOut),
  );

  res.json({
    availableRooms: room.totalRooms - booked,
  });
};
