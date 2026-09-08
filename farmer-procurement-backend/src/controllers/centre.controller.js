const pool = require("../config/db");

async function getCentres(req, res) {
  try {
    const result = await pool.query(
      `SELECT centre_id, centre_name, location, capacity
       FROM procurement_centres
       ORDER BY centre_name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch centres" });
  }
}

module.exports = { getCentres };
