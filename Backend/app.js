const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socketAuth = require("./middlewares/soketToken");
const liveTracking = require("./routes/soketRoute");
const admin = require("./config/firebase");
const db = admin.firestore();
// Import routes
const userRoutes = require("./routes/user");
const allApi = require("./routes/api");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // 👈 allow cookies
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

socketAuth(io);
liveTracking(io);

// Use routes
app.use("/users", userRoutes);
app.use("/api", allApi);

server.listen(3000, () => console.log("Server running on 3000"));
