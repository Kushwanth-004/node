// const express = require("express");
// const connectDB = require("./config/database");
// const User = require("./models/user");
// const app = express();
// const cookieParser = require("cookie-parser");
// const { userAuth } = require("./middlewares/Auth");
// const authRouter = require("./routes/authRouter");
// const profileRouter = require("./routes/profile");
// const { requestRouter } = require("./routes/request");
// const { userRouter } = require("./routes/user");
// const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();

// const chatRouter = require("../src/routes/chatRouter");

// app.use(express.json());
// app.use(cookieParser());
// const corsOptions = {
//   origin: "https://devtinder-web-p880.onrender.com",
//   credentials: true,
//   methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   optionsSuccessStatus: 200,
// };

// // Use this cors middleware globally
// app.use(cors(corsOptions));

// // Explicitly handle preflight requests
// app.options("*", cors(corsOptions));

// const initialiseSocket = require("./utils/socket");
// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", chatRouter);

// const { createServer } = require("node:http");
// const server = createServer(app);
// initialiseSocket(server);
// connectDB()
//   .then(() => {
//     console.log("Database connection established.......");
//     server.listen(process.env.PORT, () => {
//       console.log("Server created succesfully on port 8888");
//     });
//   })
//   .catch((err) => {
//     console.error("Database cannot be connected!!!");
//   });

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { userAuth } = require("./middlewares/Auth");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const chatRouter = require("../src/routes/chatRouter");
const initialiseSocket = require("./utils/socket");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "https://devtinder-web-p880.onrender.com", // frontend URL
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Create HTTP server and attach socket
const { createServer } = require("http");
const server = createServer(app);
initialiseSocket(server);

// Connect to DB and start server
const PORT = process.env.PORT || 8888;
connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
  });
