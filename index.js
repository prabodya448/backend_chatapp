const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));


// Socket.io Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data)
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
