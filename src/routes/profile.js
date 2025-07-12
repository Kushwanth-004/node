const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const isEditApplicable = validateEditProfileData(req);
    if (!isEditApplicable) {
      throw new Error(" Invalid data & edit request");
    }

    const loggedInUser = req.user;

    // console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // console.log(loggedInUser);
    const data = await loggedInUser.save();
    res.json({
      data: data,
      message: "saved Successfully",
    });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new Error("Enter the both password");
    }
    if (currentPassword === newPassword) {
      throw new Error("current password and newpassword should not be same");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("new password is not strong >> ::");
    }
    const activeUserData = req.user;
    console.log(activeUserData);
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      activeUserData.password
    );

    if (isPasswordValid) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      activeUserData.password = hashPassword;
      await activeUserData.save();
      res.send("password updated successfully");
    } else {
      throw new Error("password is not valid , please check current password");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
