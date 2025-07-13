const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const chatRouter = require("./routes/chatRouter");
const initialiseSocket = require("./utils/socket");

dotenv.config();
const app = express();

const corsOptions = {
  origin: "https://devtinder-web-p880.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const { createServer } = require("http");
const server = createServer(app);
initialiseSocket(server);

const connectDB = require("./config/database");
const PORT = process.env.PORT || 8888;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server running on :${PORT}`);
  });
});
