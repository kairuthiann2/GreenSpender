const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const users = "SELECT * FROM users WHERE email = ?;";

    // Check if the user already exists
    db.query(users, [req.body.email], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      if (data.length > 0) {
        // If user exists, send a 409 Conflict response and stop further execution
        return res.status(409).json("User already exists");
      }

      // Only proceed with registration if no user was found
      // Encrypt the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      // Store new user in the users table
      const newUser =
        "INSERT INTO users (`email`, `username`, `password`) VALUES (?)";
      const values = [req.body.email, req.body.username, hashedPassword];

      db.query(newUser, [values], (err, data) => {
        if (err) {
          console.log("Error Inserting new User:", err);
          return res.status(500).json({ error: "Error inserting user" });
        }

        // Create session after successful registration
        req.session.userId = data.insertId;
        return res.status(200).json("User created successfully");
      });
    });
  } catch (error) {
    console.log("Catch block error:", error);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
