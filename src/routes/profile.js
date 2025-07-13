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
      const user = req.user;
      if (req.file) {
        user.photoUrl = req.file.path; // Cloudinary URL
      }

      const isValid = validateEditProfileData(req);
      if (!isValid) {
        throw new Error("Invalid profile update data");
      }

      const allowedFields = ["firstName", "lastName", "about", "skills", "gender", "age"];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      const updatedUser = await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ Error: err.message });
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
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
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
