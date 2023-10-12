import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import crypto from "node:crypto";

import keys from "./config/keys";

const app = express();
const server = createServer(app);
const io = new Server(server);

const rooms = new Map();

app.use(cors({
  origin: 'http://127.0.0.1:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // This may be needed depending on your setup
}));

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "Server is running" });
});

app.get("/create-room", (req, res) => {
  try {
    const roomId = generateUniqueId(); // Generate a unique room ID
    rooms.set(roomId, { users: [] });
    return res.json({ roomId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Handle socket.io connections
io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, user }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.users.push(user);

      // Join the room
      socket.join(roomId);

      // Broadcast user join to all users in the room
      io.to(roomId).emit("user-join", user);

      // Handle song ID and status sharing within the room
      socket.on("song-change", ({ songId }) => {
        // Broadcast the song change to all users in the room
        io.to(roomId).emit("song-change", { songId });
      });

      socket.on("song-control", ({ songId, status }) => {
        // Broadcast the song change to all users in the room
        io.to(roomId).emit("song-change", { songId, status });
      });

      socket.on("disconnect", () => {
        // Handle user disconnection here
        room.users = room.users.filter((u: string) => u !== user);

        // Broadcast user leave to all users in the room
        socket.to(roomId).emit("user-leave", user);

        if (room.users.length === 0) {
          // If no users are left in the room, remove the room
          rooms.delete(roomId);
        }
      });
    } else {
      socket.disconnect();
    }
  });
});

server.listen(keys.PORT, () => {
  console.log(`server running at PORT ${keys.PORT}`);
});

function generateUniqueId() {
  return crypto.randomUUID();
}
