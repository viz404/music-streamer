import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import morgan from "morgan";

import { errorHandler } from "./middlewares/errorHandler";
import { SocketService } from "./services/socket";
import { userRouter } from "./routes/user";
import { videoRouter } from "./routes/video";
import { roomRouter } from "./routes/room";
import { corsHandler } from "./middlewares/corsHandler";

const app = express();
export const server = createServer(app);
const io = new Server(server);
const socketService = new SocketService(io);


app.use(corsHandler);
app.use(express.json());
app.use(morgan("tiny"));

// api handlers
app.use("/api/v1", userRouter);
app.use("/api/v1", videoRouter);
app.use("/api/v1", roomRouter);

app.use(errorHandler);

io.on("connection", socketService.handleConnection);

