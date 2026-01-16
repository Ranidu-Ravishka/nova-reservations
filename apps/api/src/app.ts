import cors from "cors";
import express from "express";
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
import adminRoutes from "./routes/admin.routes";


const app = express();

app.use(cors());
app.use(express.json());
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


app.get("/", (_, res) => {
	res.send("Nova Reservations API running 🚀");
});

export default app;
