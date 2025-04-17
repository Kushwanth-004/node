const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Token is not valid");
    }
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = decodeToken;
    // console.log(_id);
    const user = await User.findById({ _id });
    if (!user) {
      res.send("error user not found");
    }
    req.user = user;
    next();

    // const { emailId, password } = data;
    // if (!emailId) {
    //   throw new Error("enter the email id");
    // }
    // const userData = await User.findOne(emailId);
    // const isValidUser = await bcrypt.compare(password, userData.password);
    // if (!isValidUser) {
    //   throw new Error("password is wrong");
    // }
    //res.send("ok");
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports = {
  userAuth,
};
