const path = require("path");
const express = require("express");
const cors = require("cors");
const invoiceRoutes = require("./routes/invoiceRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.use("/api", invoiceRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Autonex Billing System Backend Running...");
});

// Authentication routes
app.use("/api/auth", authRoutes);

module.exports = app;