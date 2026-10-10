const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

// Protected test route
router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route.",
    userId: req.userId,
  });
});

module.exports = router;