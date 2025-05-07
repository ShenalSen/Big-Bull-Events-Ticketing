const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const router = express.Router();

// Initialize default admin if not exists
const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({});
    if (!adminExists) {
      const defaultAdmin = new Admin({
        username: process.env.ADMIN_INITIAL_USERNAME,
        password: process.env.ADMIN_INITIAL_PASSWORD
      });
      await defaultAdmin.save();
      console.log("Default admin account created");
    }
  } catch (error) {
    console.error("Error initializing default admin:", error);
  }
};

// Call this when the server starts
initializeDefaultAdmin();

// Add this after initializeDefaultAdmin();
router.get("/check", async (req, res) => {
  try {
    const admin = await Admin.findOne({});
    res.json({
      exists: !!admin,
      username: admin ? admin.username : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin || username !== process.env.ADMIN_INITIAL_USERNAME) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

module.exports = router;