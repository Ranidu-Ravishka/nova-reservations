import type { RequestHandler } from "express";
import { Room } from "../models/Room";

/* CREATE */
export const createRoom: RequestHandler = async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json(room);
};

/* GET ALL (FILTERABLE) */
export const getRooms: RequestHandler = async (req, res) => {
  const { hotelId, type, capacity } = req.query;

  const query: Record<string, unknown> = {
    isActive: true,
  };

  if (hotelId) query.hotelId = hotelId;
  if (type) query.type = type;
  if (capacity) query.capacity = { $gte: Number(capacity) };

  const rooms = await Room.find(query).populate("hotelId");
  res.json(rooms);
};

/* GET ONE */
export const getRoomById: RequestHandler = async (req, res) => {
  const room = await Room.findById(req.params.id).populate("hotelId");
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};

/* UPDATE */
export const updateRoom: RequestHandler = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room);
};

/* SOFT DELETE */
export const deleteRoom: RequestHandler = async (req, res) => {
  await Room.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "Room deactivated" });
};
