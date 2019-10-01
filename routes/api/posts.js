const express = require("express");
const router = express.Router();

// @route: Get api/users
// @desc: Test route
// @access: Public

// The / is a relative path
router.get("/", (req, res) => res.send("Post route"));

module.exports = router;
