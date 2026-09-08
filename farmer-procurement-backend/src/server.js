require("dotenv").config();

const express = require("express");
const cors = require("cors");

const farmerRoutes = require("./routes/farmer.routes");
const cropRoutes = require("./routes/crop.routes");
const centreRoutes = require("./routes/centre.routes");
const slotRoutes = require("./routes/slot.routes");
const bookingRoutes = require("./routes/booking.routes");
const procurementRoutes = require("./routes/procurement.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/farmers", farmerRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/centres", centreRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/procurement", procurementRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
