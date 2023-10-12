"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const keys_1 = __importDefault(require("./config/keys"));
const socket_1 = require("./constants/socket");
const user_1 = require("./routes/user");
const room_1 = require("./services/room");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: keys_1.default.ORIGINS,
        credentials: true,
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/users', user_1.userRouter);
io.on(socket_1.SocketEvent.CONNECTION, (socket) => {
    socket.on(socket_1.SocketEvent.CREATE_ROOM, ({ user }) => {
        try {
            const { room, error } = room_1.roomService.create({ user });
            if (error || room === undefined) {
                socket.emit(socket_1.SocketEvent.SERVER_ERROR, {
                    error: error || 'Unable to create room',
                });
            }
            else {
                socket.join(room.id);
            }
        }
        catch (error) {
            console.log(error);
            socket.emit(socket_1.SocketEvent.SERVER_ERROR, { error: 'Internal server error' });
        }
    });
    socket.on(socket_1.SocketEvent.JOIN_ROOM, ({ roomId, user }) => {
        try {
            const { room, error } = room_1.roomService.join({ roomId, user });
            if (error || room === undefined) {
                socket.emit(socket_1.SocketEvent.SERVER_ERROR, {
                    error: error || 'Unable to create room',
                });
            }
            else {
                socket.join(room.id);
                io.to(room.id).emit(socket_1.SocketEvent.JOIN_ROOM, user);
            }
        }
        catch (error) {
            console.log(error);
            socket.emit(socket_1.SocketEvent.SERVER_ERROR, { error: 'Internal server error' });
        }
    });
    socket.on(socket_1.SocketEvent.SEND_MESSAGE, ({ roomId, message, user }) => {
        try {
            io.to(roomId).emit(socket_1.SocketEvent.RECEIVE_MESSAGE, { message, user });
        }
        catch (error) {
            console.log(error);
            socket.emit(socket_1.SocketEvent.SERVER_ERROR, {
                error: 'Internal server error',
            });
        }
    });
    socket.on(socket_1.SocketEvent.DISCONNECT, () => {
        console.log('disconnected socket', socket.id);
    });
});
app.listen(keys_1.default.PORT, () => {
    console.log(`Server is running on PORT ${keys_1.default.PORT}`);
});
