const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const chatRouter = require("../src/routes/chatRouter");
const initialiseSocket = require("./utils/socket");

dotenv.config();
const app = express();

const corsOptions = {
  origin: "https://devtinder-web-p880.onrender.com", // Your frontend Render URL
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// === Middleware ===
app.use(express.json());
app.use(cookieParser());

// === CORS Configuration ===

// === Routes ===
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// === HTTP Server + Socket.IO ===
const { createServer } = require("http");
const server = createServer(app);
initialiseSocket(server);

// === Connect to MongoDB & Start Server ===
const PORT = process.env.PORT || 8888;
connectDB()
  .then(() => {
    console.log(" Database connected");
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to connect to database:", err.message);
  });
