const express = require("express");
const { getAvailableSlots } = require("../controllers/slot.controller");

const router = express.Router();

router.get("/", getAvailableSlots);

module.exports = router;
