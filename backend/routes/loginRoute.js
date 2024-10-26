const bcrypt = require("bcrypt");
const express = require("express");
const db = require("../db");
const { generateToken } = require("../userAuth/auth");

// Create an instance of express
const router = express.Router();

// User login route
router.post("/", (req, res) => {
  try {
    // Check if Email exists
    const users = "SELECT * FROM users WHERE email = ?";
    db.query(users, [req.body.email], (err, data) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json("Internal server error"); // Handling SQL ERRORS
      }

      if (data.length === 0) return res.status(404).json("User not found");

      // If email exist validate the password
      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );

      if (!isPasswordValid)
        return res.status(400).json("Invalid email or password");

      req.session.userId = data[0].id; // Store user ID in session
      const token = generateToken(data[0]);
      console.log(token);
      res.status(200).json({ token });
    });
  } catch (error) {
    res.status(500).json("Internal server error");
    console.log(error);
  }
});

module.exports = router;
