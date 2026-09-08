const pool = require("../config/db");

async function getStatus(bookingId) {
  const result = await pool.query(
    `SELECT
       record_id,
       booking_id,
       arrival_time,
       weight,
       quality_status,
       procurement_status,
       payment_status
     FROM procurement_records
     WHERE booking_id = $1`,
    [bookingId]
  );

  return result.rows[0];
}

async function updateStatus(bookingId, data) {
  const {
    arrivalTime,
    weight,
    qualityStatus,
    procurementStatus,
    paymentStatus
  } = data;

  const result = await pool.query(
    `INSERT INTO procurement_records
      (booking_id, arrival_time, weight, quality_status,
       procurement_status, payment_status)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (booking_id)
     DO UPDATE SET
       arrival_time = COALESCE(EXCLUDED.arrival_time,
                               procurement_records.arrival_time),
       weight = COALESCE(EXCLUDED.weight,
                         procurement_records.weight),
       quality_status = COALESCE(EXCLUDED.quality_status,
                                 procurement_records.quality_status),
       procurement_status = COALESCE(EXCLUDED.procurement_status,
                                     procurement_records.procurement_status),
       payment_status = COALESCE(EXCLUDED.payment_status,
                                 procurement_records.payment_status)
     RETURNING *`,
    [
      bookingId,
      arrivalTime || null,
      weight || null,
      qualityStatus || null,
      procurementStatus || null,
      paymentStatus || null
    ]
  );

  return result.rows[0];
}

module.exports = { getStatus, updateStatus };
