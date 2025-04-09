const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true, // Ensures email is unique
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email validation
    },
    password: {
      type: String,
      // required: true,
      minLength: 8,
      // maxLength: 60,
      // match:
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, // Password validation
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("enter a valid string");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
