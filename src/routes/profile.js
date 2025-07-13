const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const { userAuth } = require("../middlewares/Auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");

const upload = multer({ storage });

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
profileRouter.post(
  "/profile/update",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Unauthorized. User not authenticated." });
      }

      const user = req.user;

      // Debug logs
      console.log("Authenticated user:", user._id);
      if (req.file) {
        console.log(" File uploaded to Cloudinary:", req.file.path);
        user.photoUrl = req.file.path;
      } else {
        console.log("No photo uploaded");
      }

      // Validate body input (must not throw)
      const isValid = validateEditProfileData(req);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid profile update data" });
      }

      // Update only allowed fields
      const allowedFields = [
        "firstName",
        "lastName",
        "about",
        "skills",
        "gender",
        "age",
      ];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      // Save updated user
      const updatedUser = await user.save();

      // Respond with updated user
      res.status(200).json({
        message: " Profile updated successfully",
        data: updatedUser,
      });
    } catch (err) {
      console.error(" Error in /profile/update:", err.stack || err);
      res.status(500).json({
        error: "Internal Server Error",
        details: err.message,
      });
    }
  }
);

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new Error("Enter both passwords");
    }
    if (currentPassword === newPassword) {
      throw new Error("New password must be different from current password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password is not strong enough");
    }

    const user = req.user;
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Incorrect current password");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
