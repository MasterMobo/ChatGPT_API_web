const express = require("express");
const router = express.Router();

const { getResponse } = require("../controllers/chat");

router.post("/", getResponse);

module.exports = router;
