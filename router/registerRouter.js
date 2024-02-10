const express = require("express");
const register = require("../modules/registerModule");

const router = express.Router();

router.post("/signup", register.signup);
router.post("/signin", register.signin);


module.exports = router;
