const express = require("express");
const {
  createFarmer,
  getFarmer
} = require("../controllers/farmer.controller");

const router = express.Router();

router.post("/", createFarmer);
router.get("/:id", getFarmer);

module.exports = router;
