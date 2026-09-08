const bookingService = require("../services/booking.service");

async function createBooking(req, res) {
  try {
    const { farmerId, slotId } = req.body;

    if (!farmerId || !slotId) {
      return res.status(400).json({
        error: "farmerId and slotId are required"
      });
    }

    const booking = await bookingService.createBooking(farmerId, slotId);

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);

    if (error.code === "SLOT_FULL") {
      return res.status(409).json({
        error: "Slot is no longer available"
      });
    }

    if (error.code === "ALREADY_BOOKED") {
      return res.status(409).json({
        error: "Farmer already has a booking for this slot"
      });
    }

    res.status(500).json({ error: "Failed to create booking" });
  }
}

async function cancelBooking(req, res) {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
}

async function getBooking(req, res) {
  try {
    const booking = await bookingService.getBooking(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
}

module.exports = {
  createBooking,
  cancelBooking,
  getBooking
};
