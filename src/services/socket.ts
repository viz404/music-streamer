import { Server, Socket } from "socket.io";
import { UserService } from "./user";
import { RoomService } from "./room";
import { IUser } from "./types";

const userService = new UserService();
const roomService = new RoomService();

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  handleConnection = async (socket: Socket) => {
    /* const { userid: userId, token } = socket.request.headers as {
      userid: string;
      token: string;
    }; */

    const userId = socket.handshake.query.userId as any;

    let user: any = undefined;

    try {
     user = await userService.getUser(userId);
    } catch (error) {
      console.log(error); 
    } 

    if (!user) {
      console.log(`User: ${userId} not found`);
      socket.disconnect(true);
      return;
    }

    console.log(`User: ${user!.username} connected`);

    socket.on("createRoom", (videoUrl: string) => {
      this.createRoom(socket, user!, videoUrl);
    });

    socket.on("joinRoom", (roomId: string) => {
      const isValidRoom = roomService.checkRoomAvailability(roomId);
      if (!isValidRoom) {
        socket.emit("roomNotFound", roomId);
      }

      const isMemberPresent = roomService.checkMemberPresentInRoom(roomId, userId);
      if (!isMemberPresent) {
        roomService.removeUserFromAllRooms(userId);
        roomService.addMemberToRoom(roomId, user!);
        socket.join(roomId);
        this.io.to(roomId).emit("userJoined", user);
      }
    });

    socket.on("leaveRoom", (roomId: string) => {
      const isValidRoom = roomService.checkRoomAvailability(roomId);
      if (isValidRoom) {
        roomService.removeUserFromAllRooms(userId);
        socket.leave(roomId);
        this.io.to(roomId).emit("userLeft", user);
      } else {
        socket.emit("roomNotFound", roomId);
      }
    });

    socket.on("deleteRoom", () => {
      const isValidRoom = roomService.checkRoomAvailability(socket.id);
      if (isValidRoom) {
        roomService.deleteRoomsOfAdmin(userId);
        this.io.emit("roomDeleted", socket.id);
      } else {
        socket.emit("roomNotFound", userId);
      }
    });

    socket.on("updateTime", (time) => {
      this.io.to(socket.id).emit("updateTime", time);
    });

    socket.on("updateStatus", (status) => {
      this.io.to(socket.id).emit("updateStatus", status);
    });

    socket.on("disconnect", () => {
      console.log(`User ${user?.username} disconnected`);
    });
  };

  private createRoom(socket: Socket, user: IUser, videoUrl: string) {
    roomService.deleteRoomsOfAdmin(user.userId);

    roomService.addNewRoom({
      roomId: socket.id,
      adminId: user.userId,
      name: user.username,
      members: [],
      videoUrl,
    });

    console.log("room created", user.userId);
    socket.emit("roomCreated", socket.id, user.userId);
  }
}
