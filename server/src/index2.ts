// server.js
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import keys from "./config/keys";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        credentials: true,
    }
});

app.use(cors());
app.use(express.json());

// Create an object to store room information
const rooms: Record<string, Record<string, string[]>> = {};

io.on("connection", (socket) => {
  socket.on("create-room", (roomName, username) => {
    // Create a new room
    rooms[roomName] = { users: [username] };
    socket.join(roomName);
    socket.emit("room-created", roomName);
  });

  socket.on("join-room", (roomName, username) => {
    // Join an existing room
    if (rooms[roomName]) {
      socket.join(roomName);
      rooms[roomName].users.push(username);
      io.to(roomName).emit("user-joined", username);
    }
  });

  socket.on("send-message", (roomName, message) => {
    // Broadcast message to the room
    io.to(roomName).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    // Handle user disconnect
  });
});

server.listen(keys.PORT, () => {
  console.log(`Server is running on port ${keys.PORT}`);
});
