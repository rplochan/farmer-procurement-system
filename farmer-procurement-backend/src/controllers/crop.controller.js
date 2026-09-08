const pool = require("../config/db");

async function getCrops(req, res) {
  try {
    const result = await pool.query(
      "SELECT crop_id, crop_name, season FROM crops ORDER BY crop_name"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch crops" });
  }
}

module.exports = { getCrops };
