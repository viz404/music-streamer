"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.js
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const keys_1 = __importDefault(require("./config/keys"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        credentials: true,
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create an object to store room information
const rooms = {};
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
server.listen(keys_1.default.PORT, () => {
    console.log(`Server is running on port ${keys_1.default.PORT}`);
});
