const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Add CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; worker-src blob: ; connect-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

app.use(cors());
app.use(express.json());

// Add default route handler
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Event Ticket API" });
});

// Routes
app.use("/api/auth", require("./routes/admin"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/users", require("./routes/users"));

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Backend server is running on http://localhost:${process.env.PORT}`);
});