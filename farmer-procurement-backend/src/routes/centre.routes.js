const express = require("express");
const { getCentres } = require("../controllers/centre.controller");

const router = express.Router();

router.get("/", getCentres);

module.exports = router;
