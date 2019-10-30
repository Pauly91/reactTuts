const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get token from the header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  // Verify the token.

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is no valid" });
  }
};

/*
- Middle ware function is a function that has access to middle request and
response.
- Next is a call back to run when processing is done.
*/
