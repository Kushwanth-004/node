const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const chatRouter = require("../src/routes/chatRouter");
const initialiseSocket = require("./utils/socket");

const app = express();

// ✅ Place CORS at the very top (before any middleware or routes)
const corsOptions = {
  origin: "https://devtinder-web-p880.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Preflight for all routes

// ✅ Important: use middlewares after CORS
app.use(express.json());
app.use(cookieParser());

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
    console.log("✅ Database connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
  });
