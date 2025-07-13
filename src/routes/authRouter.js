const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, password, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 1);
    // console.log(passwordHash);
    const userData = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const data = await userData.save();
    const token = jwt.sign({ _id: data._id }, "kushwanth@", {
      expiresIn: "7h",
    });

    // res.cookie("token", token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ required on Render (HTTPS)
      sameSite: "None", // ✅ required for cross-origin
    });

    res.json({
      message: "user data saved successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email id is not valid");
    }

    const activeUser = await User.findOne({ emailId });

    if (!activeUser) {
      // throw new Error("user is not present in db");
      throw new Error("Invalid Creditionals");
    }
    //Shes@123 for sheswanthkuma@gmail.com

    const isPasswordValid = await bcrypt.compare(password, activeUser.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: activeUser._id }, "kushwanth@", {
        expiresIn: "7h",
      });

      // res.cookie("token", token);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // required on Render (HTTPS)
        sameSite: "None", // required to allow cross-origin cookies
      });

      res.send(activeUser);
    } else {
      throw new Error("password is not correct");
    }
  } catch (err) {
    // res.status(400).send("something went wrong " + err.message);
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successfully");
});

module.exports = authRouter;
