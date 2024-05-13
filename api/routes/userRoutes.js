const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

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
    const accessToken = jwt.sign({ userId: user._id }, "secret_key", {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user._id }, "refresh_secret_key", {
      expiresIn: "7d",
    });

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

    console.log(updatedUser);
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

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, "refresh_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, "secret_key", {
      expiresIn: "15m",
    });
    res.json({ accessToken });
  });
});

router.get(
  "/profile",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
