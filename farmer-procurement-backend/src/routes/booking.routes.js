const express = require("express");
const {
  createBooking,
  cancelBooking,
  getBooking
} = require("../controllers/booking.controller");

const router = express.Router();

router.post("/", createBooking);
router.get("/:id", getBooking);
router.delete("/:id", cancelBooking);

module.exports = router;
