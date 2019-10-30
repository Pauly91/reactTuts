const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
// @route: POST api/users
// @desc: Register user
// @access: Public

// The 2nd parameter is checks/rule more like the authenitcation done by the
// express middle ware
// The validation of the actual data that we get is not inside the 3rd parameter

// The validattionresult function checks the request for the rule or checks specified
// in the second parameter.

router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please add a valid email-id").isEmail(),
    check(
      "password",
      "Please add a password with 6 or more characters"
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      // This is the server side code which checks if the given email id
      // exist or not.
      // So take the schema of the mongoose and query for the email
      // and thus find out if it exist.
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();
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
