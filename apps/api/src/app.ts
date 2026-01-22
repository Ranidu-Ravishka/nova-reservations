import cors from "cors";
import express from "express";

import adminRoutes from "./routes/admin.routes";
import amenityRoutes from "./routes/amenity.routes";
import authRoutes from "./routes/auth.routes";
import availabilityRoutes from "./routes/availability.routes";
import hotelRoutes from "./routes/hotel.routes";
import paymentRoutes from "./routes/payment.routes";
import reservationRoutes from "./routes/reservation.routes";
import reviewRoutes from "./routes/review.routes";
import roomRoutes from "./routes/room.routes";
import staffRoutes from "./routes/staff.routes";
import transportRoutes from "./routes/transport.routes";
import userRoutes from "./routes/user.routes";



const app = express();

/* ---------------- CORS ---------------- */

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",     // admin
  "http://127.0.0.1:3001",    // admin
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }),
);

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/transports", transportRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/admin", adminRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (_, res) => {
  res.send("Nova Reservations API running 🚀");
});

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

/* ---------------- TEST ROUTES ---------------- */

app.get("/api/payments-test", (_, res) => {
  res.send("Payments route works");
});

export default app;
