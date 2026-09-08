const farmerService = require("../services/farmer.service");

async function createFarmer(req, res) {
  try {
    const farmer = await farmerService.createFarmer(req.body);
    res.status(201).json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create farmer" });
  }
}

async function getFarmer(req, res) {
  try {
    const farmer = await farmerService.getFarmer(req.params.id);

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch farmer" });
  }
}

module.exports = { createFarmer, getFarmer };
