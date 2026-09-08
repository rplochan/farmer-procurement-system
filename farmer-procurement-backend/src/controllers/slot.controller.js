const slotService = require("../services/slot.service");

async function getAvailableSlots(req, res) {
  try {
    const { centreId, cropId, date } = req.query;

    if (!centreId || !cropId || !date) {
      return res.status(400).json({
        error: "centreId, cropId and date are required"
      });
    }

    const slots = await slotService.getAvailableSlots(
      centreId,
      cropId,
      date
    );

    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
}

module.exports = { getAvailableSlots };
