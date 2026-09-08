const procurementService = require("../services/procurement.service");

async function getStatus(req, res) {
  try {
    const record = await procurementService.getStatus(req.params.bookingId);

    if (!record) {
      return res.status(404).json({
        error: "Procurement record not found"
      });
    }

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch procurement status" });
  }
}

async function updateStatus(req, res) {
  try {
    const record = await procurementService.updateStatus(
      req.params.bookingId,
      req.body
    );

    if (!record) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update procurement status" });
  }
}

module.exports = { getStatus, updateStatus };
