const pool = require("../config/db");

async function createFarmer({ name, mobile, district, village, location }) {
  const result = await pool.query(
    `INSERT INTO farmers
      (name, mobile, district, village, location, verification_status)
     VALUES ($1, $2, $3, $4, $5, 'PENDING')
     RETURNING farmer_id, name, mobile, district, village, location, verification_status`,
    [name, mobile, district, village, location]
  );

  return result.rows[0];
}

async function getFarmer(farmerId) {
  const result = await pool.query(
    `SELECT farmer_id, name, mobile, district, village, location,
            verification_status, created_at
     FROM farmers
     WHERE farmer_id = $1`,
    [farmerId]
  );

  return result.rows[0];
}

module.exports = { createFarmer, getFarmer };
