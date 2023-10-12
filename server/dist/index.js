"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const keys_1 = __importDefault(require("./config/keys"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const rooms = new Map();
app.use((0, cors_1.default)({
    origin: 'http://127.0.0.1:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // This may be needed depending on your setup
}));
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json({ message: "Server is running" });
});
app.get("/create-room", (req, res) => {
    try {
        const roomId = generateUniqueId(); // Generate a unique room ID
        rooms.set(roomId, { users: [] });
        return res.json({ roomId });
    }
    catch (error) {
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
                room.users = room.users.filter((u) => u !== user);
                // Broadcast user leave to all users in the room
                socket.to(roomId).emit("user-leave", user);
                if (room.users.length === 0) {
                    // If no users are left in the room, remove the room
                    rooms.delete(roomId);
                }
            });
        }
        else {
            socket.disconnect();
        }
    });
});
server.listen(keys_1.default.PORT, () => {
    console.log(`server running at PORT ${keys_1.default.PORT}`);
});
function generateUniqueId() {
    return node_crypto_1.default.randomUUID();
}
