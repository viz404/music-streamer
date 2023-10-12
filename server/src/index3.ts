import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

import keys from './config/keys';
import { SocketEvent } from './constants/socket';
import { userRouter } from './routes/user';
import { roomService } from './services/room';
import { ICreateRoom, IJoinRoom, ISendMessage } from './types/room';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: keys.ORIGINS,
        credentials: true,
    },
});

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);

io.on(SocketEvent.CONNECTION, (socket: Socket) => {
    socket.on(SocketEvent.CREATE_ROOM, ({ user }: ICreateRoom) => {
        try {
            const { room, error } = roomService.create({ user });

            if (error || room === undefined) {
                socket.emit(SocketEvent.SERVER_ERROR, {
                    error: error || 'Unable to create room',
                });
            } else {
                socket.join(room.id);
            }
        } catch (error) {
            console.log(error);
            socket.emit(SocketEvent.SERVER_ERROR, { error: 'Internal server error' });
        }
    });

    socket.on(SocketEvent.JOIN_ROOM, ({ roomId, user }: IJoinRoom) => {
        try {
            const { room, error } = roomService.join({ roomId, user });

            if (error || room === undefined) {
                socket.emit(SocketEvent.SERVER_ERROR, {
                    error: error || 'Unable to create room',
                });
            } else {
                socket.join(room.id);
                io.to(room.id).emit(SocketEvent.JOIN_ROOM, user);
            }
        } catch (error) {
            console.log(error);
            socket.emit(SocketEvent.SERVER_ERROR, { error: 'Internal server error' });
        }
    });

    socket.on(SocketEvent.SEND_MESSAGE, ({ roomId, message, user }: ISendMessage) => {
        try {
            io.to(roomId).emit(SocketEvent.RECEIVE_MESSAGE, { message, user });
        } catch (error) {
            console.log(error);
            socket.emit(SocketEvent.SERVER_ERROR, {
                error: 'Internal server error',
            });
        }
    });

    socket.on(SocketEvent.DISCONNECT, () => {
        console.log('disconnected socket', socket.id);
    });
});

app.listen(keys.PORT, () => {
    console.log(`Server is running on PORT ${keys.PORT}`);
});
