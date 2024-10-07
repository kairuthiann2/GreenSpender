const express = require("express");

// Create an instance of express
const router = express.Router();

// User login route
router.post("/", (req, res) => {
  try {
    // Invalidate JWT token by removing it from the session (server-side)
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      // Invalidated JWT on the client side by clearing it from localStorage
      res.clearCookie("token");
      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
});

module.exports = router;
