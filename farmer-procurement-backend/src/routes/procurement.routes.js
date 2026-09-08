const express = require("express");
const {
  getStatus,
  updateStatus
} = require("../controllers/procurement.controller");

const router = express.Router();

router.get("/:bookingId", getStatus);
router.patch("/:bookingId/status", updateStatus);

module.exports = router;
