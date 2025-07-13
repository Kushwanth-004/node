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

const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const User = require("../models/user");


// profileRouter.put(
//   "/profile/photo",
//   userAuth, // ← ADD THIS
//   upload.single("photo"),
//   async (req, res) => {
//     try {
//       const userId = req.user._id;
//       const imageUrl = req.file.path;

//       await User.findByIdAndUpdate(userId, { photoUrl: imageUrl });

//       res.json({ message: "Photo uploaded", imageUrl });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Photo upload failed" });
//     }
//   }
// );
// const express = require("express");
// const profileRouter = express.Router();
// const multer = require("multer");
// const bcrypt = require("bcrypt");
// const validator = require("validator");
// const { userAuth } = require("../middlewares/Auth");
// const { validateEditProfileData } = require("../utils/validation");
// const { storage } = require("../config/cloudinary");
// const User = require("../models/user");

// const upload = multer({ storage });

// ✅ COMBINED PROFILE UPDATE: FIELDS + PHOTO UPLOAD
profileRouter.patch(
  "/profile/update",
  userAuth,
  upload.single("photo"), // optional image file
  async (req, res) => {
    try {
      const user = req.user;

      // Optional image file
      if (req.file) {
        user.photoUrl = req.file.path; // Cloudinary URL
      }

      // Validating basic info (optional)
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



// profileRouter.patch("/profile/update", userAuth, async (req, res) => {
//   try {
//     const isEditApplicable = validateEditProfileData(req);
//     if (!isEditApplicable) {
//       throw new Error(" Invalid data & edit request");
//     }

//     const loggedInUser = req.user;

//     // console.log(loggedInUser);
//     Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
//     // console.log(loggedInUser);
//     const data = await loggedInUser.save();
//     res.json({
//       data: data,
//       message: "saved Successfully",
//     });
//   } catch (err) {
//     res.status(400).json({ Error: err.message });
//   }
// });

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
