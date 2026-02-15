require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
// using middlewares  - In Express, middleware order matters. The cors() middleware should be applied before the routes that need it.
app.use(express.json());
app.use(cookieParser());

// origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//     return callback(null, true);
//     }
//     callback(new Error("Not allowed by CORS"));
// },
app.use(
  cors({
    origin:
      process.env.ALLOWED_ORIGIN || "https://jarvis-ai-chatbot.onrender.com",
    credentials: true,
  }),
);

// creating routes
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
// using Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
