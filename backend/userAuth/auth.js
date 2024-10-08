require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
//console.log('Secrete Key:', secretKey);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: "1h",
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // Unauthorized

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      //console.log('Token:', token);
      console.log("JWT Verification Error:", err.message);

      // If the token is Expired or invalid
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
        
      }
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

module.exports = { generateToken, authenticateToken };
