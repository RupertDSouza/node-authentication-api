const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

require("dotenv").config();

router.post("/register", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  const user = new User({ name, email, phoneNumber, password });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate new tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Update or create tokens in the user document
    await User.findOneAndUpdate(
      { _id: user._id },
      { refreshToken, accessToken },
      { new: true, useFindAndModify: false }
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { refreshToken },
      { $unset: { accessToken: 1, refreshToken: 1 } },
      { new: true, useFindAndModify: false }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found or tokens already deleted" });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    user.accessToken = accessToken;
    await user.save();

    res.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

router.get("/profile", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1]; // Assuming bearer token is provided in Authorization header

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
