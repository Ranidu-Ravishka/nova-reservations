import type { Request, Response } from "express";
import paypal from "paypal-rest-sdk";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { countOverlappingReservations } from "../services/availability.service";
import { getIO } from "../socket";

/* ---------------- PAYPAL CONFIG ---------------- */

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID as string,
  client_secret: process.env.PAYPAL_CLIENT_SECRET as string,
});

/* ---------------- CREATE PAYPAL PAYMENT ---------------- */

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ message: "Reservation ID required" });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ message: "Reservation is not payable" });
    }

    const paymentJson = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `http://localhost:3000/payment/success?reservation=${reservation._id}`,
        cancel_url: `http://localhost:3000/payment/cancel`,
      },
      transactions: [
        {
          amount: {
            total: reservation.totalPrice.toFixed(2),
            currency: "USD",
          },
          description: "Nova Hotel Reservation",
        },
      ],
    };

    paypal.payment.create(paymentJson, async (error: unknown, payment: any) => {
      if (error) {
        console.error("PayPal create error:", error);
        return res.status(500).json({ message: "PayPal payment failed" });
      }

      const approval = payment?.links?.find(
        (link: any) => link.rel === "approval_url",
      );

      if (!approval) {
        return res.status(500).json({ message: "Approval URL not found" });
      }

      // ✅ SAVE PAYPAL PAYMENT ID
      reservation.paymentId = payment.id;
      await reservation.save();

      return res.json({ approvalUrl: approval.href });
    });
  } catch (err) {
    console.error("Create payment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- EXECUTE PAYPAL PAYMENT ---------------- */

export const executePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, PayerID, reservationId } = req.body;

    if (!paymentId || !PayerID || !reservationId) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    paypal.payment.execute(
      paymentId,
      { payer_id: PayerID },
      async (error: unknown) => {
        if (error) {
          console.error("PayPal execute error:", error);
          return res.status(500).json({ message: "Payment execution failed" });
        }

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
          return res.status(404).json({ message: "Reservation not found" });
        }

        if (reservation.status !== "PENDING") {
          return res.status(400).json({ message: "Invalid reservation state" });
        }

        const room = await Room.findById(reservation.roomId);
        if (!room) {
          return res.status(404).json({ message: "Room not found" });
        }

        // 🔒 RECHECK AVAILABILITY
        const booked = await countOverlappingReservations(
          room._id.toString(),
          reservation.checkIn,
          reservation.checkOut,
        );

        const remaining = room.totalRooms - booked;

        if (remaining < reservation.roomsBooked) {
          return res.status(409).json({
            message: "Rooms sold out during payment processing",
          });
        }

        // ✅ CONFIRM
        reservation.status = "CONFIRMED";
        reservation.paymentStatus = "PAID";
        reservation.paymentId = paymentId;
        await reservation.save();

        // 🔌 SOCKET EVENT
        const io = getIO();
        io.emit("availability:update", {
          roomId: room._id.toString(),
          remaining: remaining - reservation.roomsBooked,
        });

        return res.json({
          message: "Payment successful. Reservation confirmed.",
        });
      },
    );
  } catch (err) {
    console.error("Execute payment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- ADMIN: GET PAYMENTS ---------------- */

export const getPayments = async (_req: Request, res: Response) => {
  const payments = await Reservation.find({ status: "CONFIRMED" })
    .populate("roomId")
    .populate("userId")
    .sort({ createdAt: -1 });

  res.json(payments);
};
