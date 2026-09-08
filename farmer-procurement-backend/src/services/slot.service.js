const pool = require("../config/db");

async function getAvailableSlots(centreId, cropId, date) {
  const result = await pool.query(
    `SELECT
       slot_id,
       centre_id,
       crop_id,
       date,
       start_time,
       end_time,
       capacity,
       available_capacity
     FROM slots
     WHERE centre_id = $1
       AND crop_id = $2
       AND date = $3
       AND available_capacity > 0
     ORDER BY start_time`,
    [centreId, cropId, date]
  );

  return result.rows;
}

module.exports = { getAvailableSlots };
