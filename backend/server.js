require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const db = require("./db");
const YAML = require("yamljs");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./docs/swaggerv1.yaml");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middlewares/credentials");
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const expenseRoute = require("./routes/expenseRoute");
const metricsRoute = require("./routes/metricsRoute");
const logOutRoute = require("./routes/logOutRoute");

// Rate limiting and slow down
const rateLimiter = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Create an instance of express
const app = express();

// Express Rate Limiting Middlewares for login, register and logout routes
const loginLogoutAndRegisterLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 5, // 5 Requests for each API per window
  message: "Too many attempts. please try again after 10 minutes."
});

// Express Slow Down Middleware for general API routes (expenses and impact metrics);
const generalApiSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  delayAfter: 10, // After 10 requests per window, slow down
  delayMs: () => 500, // 500ms delay per request after 10 requests 
});

// Middlewares
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Serve static files form public directory
app.use(express.static(path.join(__dirname, "../frontend")));

// API documentation Route (Swagger)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route to handle the root path
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../frontend/pages/index.html");
  console.log(`Serving file: ${filePath}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred while serving the root page ");
    }
  });
});

// Define a dynamic route for serving the HTML files
app.get("/:page", (req, res) => {
  const page = req.params.page;
  const pageWithoutExtension = page.split(".").slice(0, -1).join(".");

  const filePath = path.join(
    __dirname,
    `../frontend/pages/${pageWithoutExtension}.html`
  );
  console.log(`Attempting to serve the file: ${filePath}`);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("Page not found");
    }
  });
});

// Use the route
app.use("/api/v1/register", loginLogoutAndRegisterLimiter, registerRoute); // Rate limiting 
app.use("/api/v1/login", loginLogoutAndRegisterLimiter, loginRoute); // Rate limiting
app.use("/api/v1/logout", loginLogoutAndRegisterLimiter, logOutRoute); // Rate limiting

app.use("/api/v1/expenses", generalApiSpeedLimiter, expenseRoute); // Slow down
app.use("/api/v1/impact-metrics", generalApiSpeedLimiter, metricsRoute); // Slow down


// Start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
