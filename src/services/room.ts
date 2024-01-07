import { Types } from "mongoose";
import { CommonError } from "./commonError";
import { IRoom, IUser } from "./types";

let rooms: IRoom[] = [];
const commonError = new CommonError();

export class RoomService {
  getVideoUrlForRoom(roomId: string) {
    if (!roomId) {
      throw commonError.getMessageError("Required fields not passed");
    }

    const room = rooms.find((room) => room.roomId === roomId);

    if (!room) {
      throw commonError.getMessageError("Invalid roomId");
    }

    return room.videoUrl;
  }

  getBasicRoomInfo(roomId: string) {
    if (!roomId) {
      throw commonError.getMessageError("Required fields not passed");
    }

    const room = rooms.find((room) => room.roomId === roomId);

    if (!room) {
      throw commonError.getMessageError("Invalid roomId");
    }

    return {
      roomName: room.name,
      videoUrl: room.videoUrl,
    };
  }

  deleteRoomsOfAdmin(adminId: Types.ObjectId) {
    rooms = rooms.filter((room) => room.adminId !== adminId);
  }

  addNewRoom(room: IRoom) {
    rooms.push(room);
  }

  checkRoomAvailability(roomId: string) {
    const room = rooms.find((room) => room.roomId === roomId);
    return room ? true : false;
  }

  removeUserFromAllRooms(userId: Types.ObjectId) {
    rooms = rooms
      .filter((room) => room.adminId !== userId)
      .map((room) => {
        room.members = room.members.filter((user) => user.userId !== userId);
        return room;
      });
  }

  addMemberToRoom(roomId: string, user: IUser) {
    rooms = rooms.map((room) => {
      if (room.roomId === roomId) {
        const userExists = room.members.find(
          (member) => member.userId === user.userId
        );
        if (!userExists) {
          room.members.push(user);
        }
      }
      return room;
    });
  }

  checkMemberPresentInRoom(roomId: string, userId: Types.ObjectId) {
    const room = rooms.find(room => room.roomId === roomId);
    if (!room) return false;
    return room.members.some(member => member.userId === userId);
  }
}

