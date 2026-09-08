const express = require("express");
const { getCrops } = require("../controllers/crop.controller");

const router = express.Router();

router.get("/", getCrops);

module.exports = router;
