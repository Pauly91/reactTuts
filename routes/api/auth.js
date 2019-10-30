const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route: Get api/users
// @desc: Test route
// @access: Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route: Post api/auth
// @desc: authenticate user.
// @access: Public

/*
Notes:
- This is the user login.
*/

router.post(
  "/",
  [
    check("email", "Please add a valid email-id").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Get the user based on the email.
      let user = await User.findOne({ email });

      // Return error if invalid credentials.
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid credentials" }] });
      }

      const payLoad = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payLoad,
        config.get("jwtSecret"),
        {
          expiresIn: 36000
        },
        // The call back function sends the token to the user.
        (err, token) => {
          if (err) {
            throw err;
          }
          // This is the token that the user uses for validation and logging
          // in.
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }

    // See if the user exist - If yes send an error.
    // Get users gravatar
    // Encrypt the password with
    // Return JSON webtoken.
  }
);

module.exports = router;

/*
- The auth that is passed to the get request does the auhorization, i.e protects that route from invalid users.
- After the authentication is done using the token, we can use this token to identify ourselves in the page and request for data.
*/
