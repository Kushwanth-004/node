const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/Auth");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const chatRouter = require("../src/routes/chatRouter");

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Use this cors middleware globally
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options("*", cors(corsOptions));

const initialiseSocket = require("./utils/socket");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const { createServer } = require("node:http");
const server = createServer(app);
initialiseSocket(server);
connectDB()
  .then(() => {
    console.log("Database connection established.......");
    server.listen(process.env.PORT, () => {
      console.log("Server created succesfully on port 8888");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!!");
  });
