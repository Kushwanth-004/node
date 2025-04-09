const { mongoose } = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vkushwanth2004:VsMBDFEVoexAdVbD@cluster0.g1wp7kb.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
