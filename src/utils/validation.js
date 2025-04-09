const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required.");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Please provide a valid email address.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be strong (include uppercase, lowercase, number, symbol, and at least 8 characters)."
    );
  }

  return true;
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];

  const reqBody = req.body;

  const isEditAllowed = Object.keys(reqBody).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("One or more fields are not allowed for editing.");
  }

  if (reqBody.firstName) {
    if (
      typeof reqBody.firstName !== "string" ||
      reqBody.firstName.length < 2 
    ) {
      throw new Error("First name must be at least 2 alphabetic characters.");
    }
  }

  if (reqBody.lastName) {
    if (
      typeof reqBody.lastName !== "string" ||
      reqBody.lastName.trim().length < 2
    ) {
      throw new Error("Last name must be at least 2 alphabetic characters.");
    }
  }

  if (reqBody.age !== undefined) {
    const ageNum = Number(reqBody.age);
    if (isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum < 18) {
      throw new Error("Age must be a 18 and Older");
    }
  }

  if (reqBody.photoUrl) {
    if (!validator.isURL(reqBody.photoUrl)) {
      throw new Error("Photo URL must be a valid URL.");
    }
  }

  if (reqBody.gender) {
    const allowedGenders = ["Male", "Female", "Other"];
    if (!allowedGenders.includes(reqBody.gender)) {
      throw new Error("Gender must be one of: Male, Female, or Other.");
    }
  }

  if (reqBody.about) {
    if (typeof reqBody.about !== "string" || reqBody.about.length > 500) {
      throw new Error("About section must be a string under 500 characters.");
    }
  }

  if (reqBody.skills) {
    if (typeof reqBody.skills !== "string") {
      throw new Error("Skills must be a comma-separated string. Atleast 2");
    }
  }

  return true;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
