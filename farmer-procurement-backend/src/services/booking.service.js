const pool = require("../config/db");
const generateToken = require("../utils/generateToken");
const { sendWhatsApp } = require("./notification.service");

async function createBooking(farmerId, slotId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the slot row so concurrent requests cannot
    // both consume the same final available slot.
    const slotResult = await client.query(
      `SELECT slot_id, available_capacity
       FROM slots
       WHERE slot_id = $1
       FOR UPDATE`,
      [slotId]
    );

    if (slotResult.rows.length === 0) {
      const error = new Error("Slot not found");
      error.code = "SLOT_NOT_FOUND";
      throw error;
    }

    const slot = slotResult.rows[0];

    if (slot.available_capacity <= 0) {
      const error = new Error("Slot full");
      error.code = "SLOT_FULL";
      throw error;
    }

    const existingBooking = await client.query(
      `SELECT booking_id
       FROM bookings
       WHERE farmer_id = $1
         AND slot_id = $2
         AND status = 'CONFIRMED'`,
      [farmerId, slotId]
    );

    if (existingBooking.rows.length > 0) {
      const error = new Error("Already booked");
      error.code = "ALREADY_BOOKED";
      throw error;
    }

    const bookingResult = await client.query(
      `INSERT INTO bookings
        (farmer_id, slot_id, status, token_number)
       VALUES ($1, $2, 'CONFIRMED', $3)
       RETURNING booking_id, farmer_id, slot_id, status,
                 token_number, created_at`,
      [farmerId, slotId, generateToken()]
    );

    await client.query(
      `UPDATE slots
       SET available_capacity = available_capacity - 1
       WHERE slot_id = $1`,
      [slotId]
    );

    await client.query("COMMIT");

const booking = bookingResult.rows[0];

try {
  const notificationResult = await pool.query(
    `SELECT
       f.mobile,
       f.name,
       s.date,
       s.start_time,
       s.end_time,
       pc.centre_name,
       c.crop_name
     FROM bookings b
     JOIN farmers f ON f.farmer_id = b.farmer_id
     JOIN slots s ON s.slot_id = b.slot_id
     JOIN procurement_centres pc ON pc.centre_id = s.centre_id
     JOIN crops c ON c.crop_id = s.crop_id
     WHERE b.booking_id = $1`,
    [booking.booking_id]
  );

  if (notificationResult.rows.length > 0) {
    const farmer = notificationResult.rows[0];

    const message = `
✅ Booking Confirmed!

Hello ${farmer.name},

Your procurement slot has been successfully booked.

🎫 Token: ${booking.token_number}
🌾 Crop: ${farmer.crop_name}
📅 Date: ${farmer.date}
⏰ Time: ${farmer.start_time} - ${farmer.end_time}
🏢 Centre: ${farmer.centre_name}

Please arrive at the centre during your scheduled slot.

Thank you,
Farmer Procurement System
`;

    await sendWhatsApp(farmer.mobile, message);
  }
} catch (notificationError) {
  // Booking is already successful, so don't fail the booking
  // just because WhatsApp delivery failed.
  console.error(
    "Booking notification failed:",
    notificationError.message
  );
}

return booking;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function cancelBooking(bookingId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingResult = await client.query(
      `SELECT booking_id, slot_id, status
       FROM bookings
       WHERE booking_id = $1
       FOR UPDATE`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const booking = bookingResult.rows[0];

    if (booking.status !== "CONFIRMED") {
      await client.query("ROLLBACK");
      return booking;
    }

    await client.query(
      `UPDATE bookings
       SET status = 'CANCELLED'
       WHERE booking_id = $1`,
      [bookingId]
    );

    await client.query(
      `UPDATE slots
       SET available_capacity = available_capacity + 1
       WHERE slot_id = $1`,
      [booking.slot_id]
    );

    await client.query("COMMIT");

    return {
      bookingId: booking.booking_id,
      status: "CANCELLED"
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getBooking(bookingId) {
  const result = await pool.query(
    `SELECT
       b.booking_id,
       b.farmer_id,
       b.slot_id,
       b.status,
       b.token_number,
       b.created_at,
       s.date,
       s.start_time,
       s.end_time,
       pc.centre_name,
       c.crop_name
     FROM bookings b
     JOIN slots s ON s.slot_id = b.slot_id
     JOIN procurement_centres pc ON pc.centre_id = s.centre_id
     JOIN crops c ON c.crop_id = s.crop_id
     WHERE b.booking_id = $1`,
    [bookingId]
  );

  return result.rows[0];
}

module.exports = {
  createBooking,
  cancelBooking,
  getBooking
};
